Prezentowo
==========

DB scripts
----------

To use functions saved in system.js collection, connect to `meteor mongo` and type:

```js
db.loadServerScripts();
//now you can use saved functions, example:
1.
resetDB();
2.
updatePresentCounts();
4.
setDefaultSettings();
5.
updateIsOwnPresent();
6.
convertForUserIdToArray();
convertForUserIdArrayToSingle();
7.
setParticipantsCount();
8.
setTotalPresentsCount();
```

1. `resetDB()` - remove all docs from collections

```js
db.system.js.save({
    _id: 'resetDB',
    value: function () {
      db.events.remove({}, {multi: true});
      db.presents.remove({}, {multi: true});
      db.comments.remove({}, {multi: true});
      db.users.remove({}, {multi: true});
      db.invitations.remove({}, {multi: true});
      db.notifications.remove({}, {multi: true});
    }
});
```

2. `updatePresentCounts()` - updates the values in ownPresentsCount and
otherPresentsCount in the events.participants collection and
events.ownPresentsCount / events.otherPresentsCount

```js
db.system.js.save({
    _id: 'updatePresentCounts',
    value: function () {
        db.events.find({}).forEach(function (event) {

            event.participants.forEach(function (participant) {
                var ownPresentsCount = db.presents.count({
                    eventId: event._id,
                    forUserId: participant.userId,
                    creatorId: participant.userId
                });
                var otherPresentsCount = db.presents.count({
                    eventId: event._id,
                    forUserId: participant.userId,
                    creatorId: {$ne: participant.userId}
                });

                db.events.update({
                    _id: event._id,
                    'participants.userId': participant.userId
                }, {
                    $set: {
                        'participants.$.ownPresentsCount': ownPresentsCount,
                        'participants.$.otherPresentsCount': otherPresentsCount
                    }
                });
            });

            var eventOwnPresentsCount = db.presents.count({
                eventId: event._id,
                isOwn: true
            });
            var eventOtherPresentsCount = db.presents.count({
                eventId: event._id,
                isOwn: false
            });

            db.events.update({
                _id: event._id
            }, {
                $set: {
                    ownPresentsCount: eventOwnPresentsCount,
                    otherPresentsCount: eventOtherPresentsCount
                }
            });

        });
    }
});
```

3. Change pictureUrl object to string

```js
db.users.find({}).forEach(function (user) {
    db.users.update({_id: user._id}, {$set: {'profile.pictureUrl': user.profile.pictureUrl.large}});
});

```

4. Set default settings

```js
db.system.js.save({
    _id: 'setDefaultSettings',
    value: function () {
        db.users.find({}).forEach(function (user) {
            var defaultSettings = {
                viewMode: {
                    participantsMode: 'single',
                    presentMode: 'full-width'
                }
            }
            var settings = user.settings || {}

            settings.viewMode = settings.viewMode || {}
            settings.viewMode.participantsMode = settings.viewMode.participantsMode
                || defaultSettings.viewMode.participantsMode
            settings.viewMode.presentMode = settings.viewMode.presentMode
                || defaultSettings.viewMode.presentMode

            db.users.update({_id: user._id}, {$set: {settings: settings}})
        });
    }
});
```

5. Set isOwn field of every present

```js
db.system.js.save({
    _id: 'updateIsOwnPresent',
    value: function () {
        db.presents.find({}).forEach(function (present) {
            var event = db.events.find({_id: present.eventId});
            var isManyToOneEvent = event && event.type === 'many-to-one'
            var isOwn

            if (isManyToOneEvent) {
                isOwn = event.beneficiaries.indexOf(present.creatorId) > -1
            } else {
                isOwn = present.forUserId === present.creatorId
            }

            db.presents.update({_id: present._id}, {
                $set: {isOwn: isOwn}
            })

        });
    }
});
```

6. Convert present.forUserId to an array and back

```js

db.system.js.save({
    _id: 'convertForUserIdToArray',
    value: function () {
        db.presents.find({}).forEach(function (present) {
            db.presents.update({_id: present._id}, {
                $unset: {forUserId: 1},
                $set: {forUserIds: [present.forUserId]}
            })
        });
    }
});

db.system.js.save({
    _id: 'convertForUserIdArrayToSingle',
    value: function () {
        db.presents.find({}).forEach(function (present) {
            db.presents.update({_id: present._id}, {
                $unset: {forUserIds: 1},
                $set: {forUserId: [present.forUserIds[0]]}
            })
        });
    }
});

```

7. Set event.participantsCount

```js
db.system.js.save({
    _id: 'setParticipantsCount',
    value: function () {
        db.events.find({}).forEach(function (event) {
            db.events.update({_id: event._id}, {
                $set: {participantsCount: event.participants.length}
            })
        });
    }
});

```

8. Set event.realTotalPresentsCount

```js
db.system.js.save({
    _id: 'setTotalPresentsCount',
    value: function () {
        db.events.find({}).forEach(function (event) {
          var presentsCount = db.presents
            .find({eventId: event._id})
            .count()

            db.events.update({_id: event._id}, {
                $set: {realTotalPresentsCount: presentsCount}
            })
        });
    }
});

```

iteration over a collection (just edit this and use)

```js
db.presents.find({creatorAt: {$exists: true}}).forEach(function (present) {
    db.presents.update({_id: present._id}, {
        $unset: {creatorAt: 1},
        $set: {
          createdAt: present.creatorAt
        }
    })
});
```

Index for unique userId's in participants array
Note: doesn't work :(

```
db.events.ensureIndex({_id: 1, 'participants.userId' : 1}, {unique:true, sparse:true});
```

Env variables
-------------

```
env NODE_OPTIONS='--debug' UNIVERSE_I18N_LOCALES='pl'
```

Test scripts
------------

```
var eventId = '3pv8hdxXXQXpsNAEr';

var eventId = Events.methods.createEvent.call({
    title: 'Christmas 2016!',
    type: 'many-to-many',
    date: new Date(2016,11,24)
});

Events.methods.addParticipant.call({
    eventId: eventId,
    participant: {
        name: 'Filut',
        email: 'filut@filut.pl',
        gender: 'male',
        picture: 'pic'
    }
});
Events.methods.addParticipant.call({
    eventId: eventId,
    participant: {
        name: 'Filipo',
        gender: 'male'
    }
});
Events.methods.addParticipant.call({
    eventId: eventId,
    participant: {
        name: 'Klaudynka',
        gender: 'female'
    }
});

var forUserId = '7LNydRfj6Z2NzMRt7'

Presents.methods.createPresent.call({
    title: 'iPod',
    pictureUrl: 'pic',
    forUserId: forUserId,
    eventId: eventId
});

Presents.methods.createPresent.call({
    title: 'telefon',
    pictureUrl: 'pic',
    description: 'desc',
    forUserId: forUserId,
    eventId: eventId
});

var presentId = 'nK7kFcf2SSzJuzTYA';

Comments.methods.createComment.call({
    presentId: presentId,
    type: 'secret',
    message: 'msg'
});


```

_i18n find regex:
\{_i18n.__\(['"]([\w]*)['"]\)\}

Todo:
----

- add latency compensation for adding participants (?)
- add security for adding comments:
  - to add a comment user must be in the event that present is in (so need to find that event and present)
  - to add a secret comment user must not be in "forId" (can't add a comment to his own present)
- lang rerendering
- momentjs renrendering (5 minutes ago will be invalid after some time)
- add user search in add participant
- use semantic's Visibility plugin instead of scrollSpy (might be faster, uses getAnimationFrame)
- BUG: SelectInput on language change looses placeholder text. Note: it seems semantic looses $().data value of dropdown
- add MongodDb indexes