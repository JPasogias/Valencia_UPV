'use strict';

const validator = require('validator');
const errorHelper = require('../../helpers/error');
const datapool = require('../datapool');
const i18next = require('i18next');
const co = require('co');
const teamsRepository = datapool.getRepository('teams');
const activitiesBll = require('./activities');

exports.create = function* teamsCreate(team, user) {
  team.creationDate = new Date();
  team.members = [];
  team.members[0] = {
    idUser: user._id,
    joinDate: new Date(),
    isAdmin: true,
  };

  var teamDb = yield teamsRepository.create(team);
  var groupInfo = {
    idGroup: teamDb._id,
    groupName: teamDb.name,
  };
  var activity = {
    idUser: user._id,
    time: new Date(),
    type: 'GROUP',
    description: 'GROUP_CREATED',
    typeGroup: groupInfo,
  };
  yield activitiesBll.create(activity);
  return teamDb;
};

exports.getAll = function* teamsGet(user) {
  return yield teamsRepository.get(user);
};

exports.getByUser = function* teamsGetByUser(user) {
  return yield teamsRepository.getByUser(user._id);
};

exports.getById = function* teamsGetById(teamId, user) {
  return yield teamsRepository.getById(teamId, user._id);
};
