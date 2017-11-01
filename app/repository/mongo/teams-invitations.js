'use strict';
const mongoose = require('mongoose');
const invitationsModel = mongoose.model('Team-invitation');

exports.create = function* invitationsTeamCreate(invitationsTeam) {
  return invitationsModel.create(invitationsTeam);
};

exports.getByTeam = function* invitationsTeamGetByTeam(idTeam, userID) {
  const query = {
    idTeam: idTeam,
    accepted: false,
  };
  return yield invitationsModel.find(query).lean().exec();
};

exports.getById = function* invitationsTeamGetById(idInvitation) {
  const query = {
    _id: idInvitation,
  };
  return yield invitationsModel.findOne(query).lean().exec();
};

exports.getByUser = function* invitationsTeamGetByUser(email) {
  const query = {
    'invitation.userEmail': email,
  };
  return yield invitationsModel.find(query).lean().exec();
};

exports.delete = function* invitationsTeamDelete(idInvitation, userID) {
  const query = {
    _id: idInvitation,
  };
  return yield invitationsModel.remove(query).lean().exec();
};

exports.getByEmailAndTeam = function* invitationsGetByEmailAndTeam(email, teamId) {
  const query = {
    idTeam: teamId,
    'invitation.userEmail': email,
  };
  return yield invitationsModel.find(query).lean().exec();
};
