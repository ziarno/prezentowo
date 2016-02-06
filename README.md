Prezentowo
==========



DB scripts
----------

Index for unique userId's in participants array

```js
db.Events.ensureIndex({_id: 1, 'participants.userId' : 1}, {unique:true, sparse:true});
```
