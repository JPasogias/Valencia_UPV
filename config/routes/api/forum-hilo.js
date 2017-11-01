'use strict';
const wrap = require('co-express');

module.exports = function (app, config) {

  const forumhiloController = require('../../../app/controllers/api/forum-hilo');

  app.post('/api/forum-hilo/', wrap(forumhiloController.create));
  app.put('/api/forum-hilo/', wrap(forumhiloController.update));
  app.delete('/api/forum-hilo/:idPost', wrap(forumhiloController.delete));

  app.get('/api/forum-hilo/all', wrap(forumhiloController.getAll));
  app.get('/api/forum-hilo/:idPost', wrap(forumhiloController.getById));
  app.get('/api/forum-hilo/category/:idCategory', wrap(forumhiloController.getByCategoryId));


};
