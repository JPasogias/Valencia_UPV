'use strict';
const co = require('co');
const handleError = require('../../../helpers/controller').handleError;
const invitationsBll = require('../../bll/team-invitations');

exports.create = function invitationsCreate(req, res) {
  co(function* () {
    const invitation = req.body.data;
    const newInvitation = yield invitationsBll.create(invitation, req.user);
    res.send(newInvitation);
  }).catch(handleError(req, res));
};

exports.getByTeam = function invitationsGetByTeam(req, res) {
  co(function* () {
    const idTeam = req.params.idTeam;
    const invitations = yield invitationsBll.getByTeam(idTeam, req.user);
    res.send(invitations);
  }).catch(handleError(req, res));
};

exports.getByUser = function invitationsGetByUser(req, res) {
  co(function* () {
    const invitations = yield invitationsBll.getByUser(req.user);
    res.send(invitations);
  }).catch(handleError(req, res));
};

exports.delete = function invitationsGet(req, res) {
  co(function* () {
    const idTeam = req.params.idTeam;
    const invitations = yield invitationsBll.delete(idTeam, req.user);
    res.send(invitations);
  }).catch(handleError(req, res));
};

exports.acceptInvitation = function invitationsAccept(req, res) {
  co(function* () {
    const idTeam = req.params.idTeam;
    const invitations = yield invitationsBll.acceptInvitation(idTeam, req.user);
    res.send(invitations);
  }).catch(handleError(req, res));
};
