'use strict';
const mongoose = require('mongoose');
const teamsModel = mongoose.model('Team');

exports.getMandatory = function* tokenGetById() {
  const query = {
    isMandatory: true,
  };
  return yield teamsModel.findOne(query).lean().exec();
};

exports.create = function* teamsCreate(team) {
  return teamsModel.create(team);
};

exports.getAllPublics = function* teamsGetAll() {
  var search = {
    isPublic: true,
  };

  return yield teamsModel.find(search).lean().exec();
};

exports.getById = function* tokenGetById(invitationId) {
  const query = {
    _id: invitationId,
  };
  return yield teamsModel.findOne(query).lean().exec();
};

exports.getByNameLC = function* teamGetByNameLC(name) {
  return yield teamsModel.find({ nameLowerCase: name }).lean().exec();
};

exports.getByNameId = function* tokenGetById(name) {
  const query = {
    nameLowerCase: name,
  };
  return yield teamsModel.findOne(query).lean().exec();
};





exports.getByUser = function* tokenGetByUser(userId) {
  const query = {
    members: {
      $elemMatch: {
        idUser: userId,
      },
    },
  };
  return yield teamsModel.find(query).lean().exec();
};

exports.getByIdAndUser = function* tokenGetByIdAndUser(teamId, userId) {
  const query = {
    _id: teamId,
    members: {
      $elemMatch: {
        idUser: userId,
      },
    },
  };
  return yield teamsModel.findOne(query).lean().exec();
};

exports.getById = function* tokenGetById(teamId, userId) {
  const query = {
    _id: teamId,
  };
  return yield teamsModel.findOne(query).lean().exec();
};

exports.leftGroup = function* tokenGetById(teamId, userId) {
  const filter = {
    _id: teamId,
  };
  var options = {
    new: true,
  };
  var update = {
    $pull: {
      members: {
        idUser: userId,
      },
    },
  };

  return yield teamsModel.findOneAndUpdate(filter, update, options).lean().exec();
};

exports.addUserToTeam = function* tokenAddUserToTeam(teamId, userId) {
  const filter = {
    _id: teamId,
  };
  var options = {
    new: true,
  };
  var update = {
    $addToSet: {
      members: {
        idUser: userId,
        joinDate: new Date(),
        isAdmin: false,
      },
    },
  };
  return yield teamsModel.findOneAndUpdate(filter, update, options).lean().exec();
};

exports.update = function* updateTeam(idTeam, update) {
  var filter = {
    _id: idTeam,
  };
  var options = {
    new: true,
  };
  var update = { $set: update };
  return yield teamsModel.findOneAndUpdate(filter, update, options).lean().exec();
};

exports.search = function* searchTeam(word) {
  var search = {
    nameLowerCase: { $regex: '.*' + word + '.*' },
    isPublic: true,
  };

  return yield teamsModel.find(search).lean().exec();
};
