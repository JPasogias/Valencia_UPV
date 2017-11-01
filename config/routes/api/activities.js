'use strict';
const wrap = require('co-express');

module.exports = function (app, config) {

  const activityController = require('../../../app/controllers/api/activities');

  app.get('/api/activities/unread', wrap(activityController.getUnread));
  app.get('/api/activities/team/:idTeam', wrap(activityController.getByTeam));
  app.get('/api/activities/:type', wrap(activityController.getByType));
  app.post('/api/activities/:type', wrap(activityController.markAsRead));
  app.get('/api/activities/', wrap(activityController.getAll));

};
