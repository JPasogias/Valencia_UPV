'use strict';
const wrap = require('co-express');

module.exports = function (app, config) {

  const forummensajeController = require('../../../app/controllers/api/forum-mensaje');

  app.post('/api/forum-mensaje/contador', wrap(forummensajeController.contador));


  app.post('/api/forum-mensaje/', wrap(forummensajeController.create));
  app.put('/api/forum-mensaje/', wrap(forummensajeController.update));
  app.delete('/api/forum-mensaje/:idPost', wrap(forummensajeController.delete));

  app.get('/api/forum-mensaje/all', wrap(forummensajeController.getAll));
  app.get('/api/forum-mensaje/:idPost', wrap(forummensajeController.getById));
  app.get('/api/forum-mensaje/post/:idPost', wrap(forummensajeController.getByPostId));

};
