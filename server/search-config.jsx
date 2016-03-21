SearchSource.defineSource('userEmail', function (searchText) {
  return Meteor.users.find({
    registered_emails: {
      $elemMatch: {
        address: searchText
      }
    }
  }).fetch()
})

SearchSource.defineSource('usernames', function (searchText, options = {sort: {'profile.name': 1}, limit: 20}) {
  return Meteor.users.find({
    'profile.name': buildRegExp(searchText)
  }, options).fetch()
})

function buildRegExp(searchText) {
  var words = searchText.trim().split(/[ \-\:]+/)
  var exps = _.map(words, function(word) {
    return "(?=.*" + word + ")"
  })
  var fullExp = exps.join('') + ".+"
  return new RegExp(fullExp, "i")
}
