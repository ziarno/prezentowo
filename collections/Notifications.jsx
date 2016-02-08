/**
 * Notifications Collection
 */
Notifications = new Mongo.Collection('notifications');
Notifications.permit(['insert', 'update', 'remove']).never().apply(); //ongoworks:security

