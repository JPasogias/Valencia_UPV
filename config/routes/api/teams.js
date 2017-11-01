'use strict';
const wrap = require('co-express');
const ObjectID = require('mongodb').ObjectID

module.exports = function (app, config) {
  const teamsInvitationsController = require('../../../app/controllers/api/team-invitations');
  app.post('/api/teams/invitations/:idTeam/accept-invitation', wrap(teamsInvitationsController.acceptInvitation));
  app.put('/api/teams/invitations', wrap(teamsInvitationsController.create));
  app.get('/api/teams/invitations/:idTeam', wrap(teamsInvitationsController.getByTeam));
  app.get('/api/teams/invitations/', wrap(teamsInvitationsController.getByUser));
  app.delete('/api/teams/invitations/:idTeam', wrap(teamsInvitationsController.delete));

  const teamsRequestsController = require('../../../app/controllers/api/team-requests');
  app.put('/api/teams/requests', wrap(teamsRequestsController.create));

  const teamsController = require('../../../app/controllers/api/teams');
  app.get('/api/teams/', wrap(teamsController.getAll));
  app.get('/api/teams/user/', wrap(teamsController.getByUser));
  app.get('/api/teams/name-id/:name', wrap(teamsController.getByNameId));
  app.get('/api/teams/search/all/', wrap(teamsController.getAll));
  app.get('/api/teams/search/:word', wrap(teamsController.search));
  app.get('/api/teams/:idTeam', wrap(teamsController.getById));

  app.put('/api/teams/', wrap(teamsController.create));



  app.post('/api/teams/uploadphoto', function editPhoto(req, res) {
    if (!req.files){
      return res.status(400).send('No files were uploaded.');
    }
    let sampleFile = req.files.image_file;
    var direction = __dirname.substring(0, __dirname.indexOf('config')) + '/public/images_plantlabco/teams/';
    var name = new ObjectID() + "-" + req.files.image_file.name;
    sampleFile.mv(direction + name, function(err) {
      if (err){
        return res.status(500).send(err);
      }
      res.send('/images_plantlabco/teams/'+name);
    });
  });
  app.post('/api/teams/:idTeam/left-group', wrap(teamsController.leftGroup));
  app.post('/api/teams/:idTeam', wrap(teamsController.update));
};
