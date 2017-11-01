'use strict';

const validator = require('validator');
const errorHelper = require('../../helpers/error');
const datapool = require('../datapool');
const i18next = require('i18next');
const co = require('co');
const teamsRepository = datapool.getRepository('teams');
const activitiesBll = require('./activities');
const usersBll = require('./user');




// ****************************************************************************
// Metodo para inicializar la herramienta en el primer usuario
function* initdb(){

  // Creamos el grupo por defecto para él
  let team = {
    name : "PlantLabCo",
    isMandatory: true,
    description : "PlantLabCo, you cant leave this group",
    nameLowerCase: 'plantlabco'
  }
  return yield teamsRepository.create(team);
}
// ****************************************************************************


// Devuelve el grupo por defecto de la plataforma
exports.getMandatory = function* teamsGetById() {
  let team = yield teamsRepository.getMandatory();
  if(!team){
    // En caso de que no este el grupo por defecto lo creamos
    return yield initdb();
  }

  return team;
};

// Funcion para crear grupos
exports.create = function* teamsCreate(team, user) {
  team.nameLowerCase = team.name.toLowerCase();

  var num =  yield teamsRepository.getByNameLC(team.nameLowerCase) || [];
  team.nameLowerCase = team.nameLowerCase + '-' + num.length;
  if(num.length == 0){
    team.nameLowerCase = team.name.toLowerCase();
  }

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

exports.getAll = function* teamsGet() {
  return yield teamsRepository.getAllPublics();
};

exports.getByNameId = function* teamsGetByUser(name) {
  var team = yield teamsRepository.getByNameId(name);
  for(var t in team.members){
    var u = yield usersBll.getById(team.members[t].idUser);
    if(u){
      team.members[t].image = u.personalInfo.image;
      team.members[t].username = u.username;
      team.members[t].lastLogin = u.lastLogin;
    }
  }
  return team;

};
exports.getByUser = function* teamsGetByUser(user) {
  return yield teamsRepository.getByUser(user._id);
};

exports.getByIdAndUser = function* teamsGetById(teamId, user) {
  return yield teamsRepository.getByIdAndUser(teamId, user._id);
};

exports.getById = function* teamsGetById(teamId) {
  return yield teamsRepository.getById(teamId);
};

exports.update = function* teamsUser(teamId, update) {
  var mandatoryTeam = yield teamsRepository.getMandatory();
  if(mandatoryTeam._id.toString() == teamId.toString()){
    return mandatoryTeam;
  }

  update.nameLowerCase = update.name.toLowerCase();
  var team = yield teamsRepository.update(teamId, update);
  return team;
};

exports.search = function* teamsUserSearch(word) {
  var team = yield teamsRepository.search(word.toLowerCase());
  return team;
};

exports.leftGroup = function* teamsLeftGroup(teamId, user) {
  var mandatoryTeam = yield teamsRepository.getMandatory();
  if(mandatoryTeam._id.toString() == teamId.toString()){
    return mandatoryTeam;
  }
  var teamDb = yield teamsRepository.leftGroup(teamId, user._id);
  var groupInfo = {
    idGroup: teamDb._id,
    groupName: teamDb.name,
  };
  var activity = {
    idUser: user._id,
    time: new Date(),
    type: 'GROUP',
    description: 'LEFT_GROUP',
    typeGroup: groupInfo,
  };
  yield activitiesBll.create(activity);
  return teamDb;
};

exports.addUserToTeam = function* teamsAddUserToTeam(teamId, userId) {
  var teamDb = yield teamsRepository.addUserToTeam(teamId, userId);
  return teamDb;
};
