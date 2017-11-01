'use strict';
const wrap = require('co-express');

module.exports = function (app, config) {
  const modelController = require('../../../app/controllers/api/model');
  app.post('/api/model/', wrap(modelController.modelObj));
};
