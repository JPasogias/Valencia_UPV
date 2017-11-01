'use strict';
const wrap = require('co-express');

module.exports = function (app, config) {

  const forumcategoriaController = require('../../../app/controllers/api/forum-categoria');

  app.post('/api/forum-categoria/', wrap(forumcategoriaController.create));
  app.put('/api/forum-categoria/', wrap(forumcategoriaController.update));
  app.delete('/api/forum-categoria/:idPost', wrap(forumcategoriaController.delete));

  app.get('/api/forum-categoria/all', wrap(forumcategoriaController.getAll));
  app.get('/api/forum-categoria/:idPost', wrap(forumcategoriaController.getById));

};
