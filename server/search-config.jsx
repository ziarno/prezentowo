import React from 'react'

SearchSource.defineSource('email', function (searchText) {
  return Meteor.users.find({
    registered_emails: {
      $elemMatch: {
        address: searchText
      }
    },
    isTemp: {$ne: true}
  }, {
    sort: {'profile.name': 1},
    limit: 20,
    fields: {
      registered_emails: 1,
      profile: 1
    }
  }).fetch()
})

SearchSource.defineSource('usernames', function (searchText) {
  return Meteor.users.find({
    _id: {$ne: this.userId},
    'profile.name': buildRegExp(searchText),
    isTemp: {$ne: true}
  }, {
    sort: {'profile.name': 1},
    limit: 20,
    fields: {
      profile: 1
    }
  }).fetch()
})

function buildRegExp(searchText) {
  if (!searchText) {
    return
  }

  var words = searchText.trim().split(/[ \-\:]+/)
  var exps = _.map(words, function(word) {
    return "(?=.*" + word + ")"
  })
  var fullExp = exps.join('') + ".+"
  return new RegExp(fullExp, "i")
}
