'use strict';

const validator = require('validator');
const errorHelper = require('../../helpers/error');
const datapool = require('../datapool');
const i18next = require('i18next');
const co = require('co');
const invitationsRepository = datapool.getRepository('teams-invitations');
const activitiesBll = require('./activities');
const userBll = require('./user');
const teamsBll = require('./teams');

exports.create = function* invitationsCreate(dataTransfer, user) {
  const emailAddresse = dataTransfer.email.toLowerCase();
  const userDB = yield userBll.getByEmail(emailAddresse);

  if (!userDB) {
    const errorDataTransfer = {
      error: true,
      type: 'NO_USER',
      msg: 'User email not found',
    };
    return errorDataTransfer;
  }

  const team = dataTransfer.idTeam;
  const teamDB = yield teamsBll.getByIdAndUser(team, userDB);

  if (teamDB) {
    const errorDataTransfer = {
      error: true,
      type: 'IN_TEAM',
      msg: 'User allready in Group',
    };
    return errorDataTransfer;
  }

  const invitationExist = yield invitationsRepository.getByEmailAndTeam(emailAddresse, team);
  if (invitationExist.length) {
    const errorDataTransfer = {
      error: true,
      type: 'INVITATION_EXIST',
      msg: 'User allready in Group',
    };
    return errorDataTransfer;
  }

  var invitation = {};
  invitation.idTeam = team;
  invitation.creationDate = new Date();
  invitation.invitation = {};
  invitation.invitation.userSender = user._id;
  invitation.invitation.userAddresse = userDB._id;
  invitation.invitation.userEmail = userDB.email;
  invitation.accepted = false;

  var invitationDb = yield invitationsRepository.create(invitation);
  var teamDB2 = yield teamsBll.getById(team);
  var groupInfo = {
    idGroup: teamDB2._id,
    groupName: teamDB2.name,
  };
  var activity = {
    idUser: userDB._id,
    time: new Date(),
    type: 'GROUP',
    description: 'INVITATION_SEND',
    typeGroup: groupInfo,
  };
  yield activitiesBll.create(activity);
  return invitationDb;
};

exports.getByTeam = function* invitationsGetByTeam(teamId, user) {
  return yield invitationsRepository.getByTeam(teamId, user._id);
};

exports.getById = function* teamsGetById(teamId) {
  return yield invitationsRepository.getById(teamId);
};

exports.getByUser = function* invitationsGetByUser(user) {
  var invitations =  yield invitationsRepository.getByUser(user.email);
  for (var invitation in invitations) {
    let teamDB = yield teamsBll.getById(invitations[invitation].idTeam);
    invitations[invitation].team = teamDB.name;
  }

  return invitations;
};

exports.delete = function* invitationsDelete(invitationId, user) {
  return yield invitationsRepository.delete(invitationId, user._id);
};

exports.acceptInvitation = function* invitationsAccept(invitationId, user) {
  var invitation =  yield invitationsRepository.getById(invitationId);
  var team = yield teamsBll.addUserToTeam(invitation.idTeam, user._id);
  yield invitationsRepository.delete(invitationId, user._id);
  return team;
};
