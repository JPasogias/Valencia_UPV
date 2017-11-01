'use strict';
const wrap = require('co-express');
const ObjectID = require('mongodb').ObjectID

module.exports = function (app, config) {
  const experimentsController = require('../../../app/controllers/api/experiments');
  const fileUpload = require('express-fileupload');

  // default options
  app.use(fileUpload());

  app.post('/api/experiments/contador', wrap(experimentsController.contador));

  app.post('/api/experiments/', wrap(experimentsController.create));
  app.put('/api/experiments/', wrap(experimentsController.update));
  app.delete('/api/experiments/:idExperiment', wrap(experimentsController.delete));

  app.get('/api/experiments/all', wrap(experimentsController.getAll));
  app.get('/api/experiments/:idExperiment', wrap(experimentsController.getById));

  app.post('/api/experiments/uploadphoto', function editPhoto(req, res) {
    if (!req.files){
      return res.status(400).send('No files were uploaded.');
    }
    let sampleFile = req.files.image_file;
    var direction = __dirname.substring(0, __dirname.indexOf('config')) + '/public/images_plantlabco/experiments/';
    var name = new ObjectID() + "-" + req.files.image_file.name;
    sampleFile.mv(direction + name, function(err) {
      if (err){
        return res.status(500).send(err);
      }
      res.send('/images_plantlabco/experiments/'+name);
    });

  });
};
