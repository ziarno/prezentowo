import {HTTP} from 'meteor/http'

PushNotifications = {}

PushNotifications.send = function ({
  userIds,
  eventId,
  contents,
}) {
  var {
    ONE_SIGNAL_API_KEY: apiKey,
    ONE_SIGNAL_APP_ID: app_id
  } = process.env

  if (!apiKey || !app_id) {
    return
  }

  HTTP.post('https://onesignal.com/api/v1/notifications', {
    data: {
      app_id,
      contents,
      filters: userIds.map(userId => ({
        field: 'tag',
        key: 'userId',
        operator: 'OR',
        value: userId
      }))
    },
    headers: {
      Authorization: `Basic ${apiKey}`,
      'Content-Type': 'application/json'
    }
  })
}