'use strict';
const wrap = require('co-express');
const ObjectID = require('mongodb').ObjectID

module.exports = function (app, config) {
  const blogController = require('../../../app/controllers/api/blog');
  const fileUpload = require('express-fileupload');

  // default options
  app.use(fileUpload());

  app.post('/api/blog/contador', wrap(blogController.contador));

  app.post('/api/blog/', wrap(blogController.create));
  app.put('/api/blog/', wrap(blogController.update));
  app.delete('/api/blog/:idPost', wrap(blogController.delete));

  app.get('/api/blog/all', wrap(blogController.getAll));
  app.get('/api/blog/:idPost', wrap(blogController.getById));

  app.post('/api/blog/uploadphoto', function editPhoto(req, res) {
    console.log(req.body);
    console.log(req.files);

    if (!req.files){
      return res.status(400).send('No files were uploaded.');
    }
    let sampleFile = req.files.image_file;
    var direction = __dirname.substring(0, __dirname.indexOf('config')) + '/public/images_plantlabco/blog/';
    var name = new ObjectID() + "-" + req.files.image_file.name;
    sampleFile.mv(direction + name, function(err) {
      if (err){
        return res.status(500).send(err);
      }
      res.send('/images_plantlabco/blog/'+name);
    });

  });
};
