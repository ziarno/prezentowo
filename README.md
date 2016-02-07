Prezentowo
==========

DB scripts
----------

To use functions saved in system.js collection, connect to `meteor mongo` and type:

```
db.loadServerScripts();
//now you can use saved functions, example:
updatePresentsCount();
resetDB();
```

1. `resetDB()` - remove all docs from collections

```
db.system.js.save({
    _id: 'resetDB',
    value: function () {
      db.events.remove({}, {multi: true});
      db.presents.remove({}, {multi: true});
      db.comments.remove({}, {multi: true});
      db.users.remove({}, {multi: true});
    }
});
```

2. `updatePresentCounts()` - updates the values in ownPresentsCount and
otherPresentsCount in the events.participants collection

```
db.system.js.save({
    _id: 'updatePresentCounts',
    value: function () {
        db.events.find({}).forEach(function (event) {
            event.participants.forEach(function (participant) {

                var ownPresentsCount = db.presents.count({
                    forUserId: participant.userId,
                    creatorId: participant.userId
                });
                var otherPresentsCount = db.presents.count({
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
        });
    }
});
```

Index for unique userId's in participants array
Note: doesn't work :(

```js
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
Events.methods.createEvent.call({
    title: 'Christmas 2016!',
    type: 'many-to-many',
    date: new Date(24,11,2016)
});

var eventId = '3pv8hdxXXQXpsNAEr';

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
    picture: 'pic',
    forUserId: forUserId,
    eventId: eventId
});

Presents.methods.createPresent.call({
    title: 'telefon',
    picture: 'pic',
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

Todo:
----

- add latency compensation for adding participants (?)
- add security for adding comments:
  - to add a comment user must be in the event that present is in (so need to find that event and present)
  - to add a secret comment user must not be in "forId" (can't add a comment to his own present)