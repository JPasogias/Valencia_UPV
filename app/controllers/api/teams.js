'use strict';
const co = require('co');
const handleError = require('../../../helpers/controller').handleError;
const teamsBll = require('../../bll/teams');

exports.create = function teamsCreate(req, res) {
  co(function* () {
    const team = req.body;
    const newTeam = yield teamsBll.create(team, req.user);
    res.send(newTeam);
  }).catch(handleError(req, res));
};

exports.getAll = function teamsGet(req, res) {
  co(function* () {
    const teams = yield teamsBll.getAll();
    res.send(teams);
  }).catch(handleError(req, res));
};

exports.getByUser = function teamsGetByUser(req, res) {
  co(function* () {
    const teams = yield teamsBll.getByUser(req.user);
    res.send(teams);
  }).catch(handleError(req, res));
};

exports.getByNameId = function teamsGetByNameId(req, res) {
  co(function* () {
    const name = req.params.name;
    const teams = yield teamsBll.getByNameId(name);
    res.send(teams);
  }).catch(handleError(req, res));
};

exports.getById = function teamsGetById(req, res) {
  co(function* () {
    const idTeam = req.params.idTeam;
    const team = yield teamsBll.getById(idTeam);
    res.send(team);
  }).catch(handleError(req, res));
};

exports.update = function* teamsUpdate(req, res) {
  const teamId = req.params.idTeam;
  const team = req.body.team;
  const result = yield teamsBll.update(teamId, team);
  res.send(result);
};

exports.leftGroup = function* teamsLeftGroup(req, res) {
  const teamId = req.params.idTeam;
  const result = yield teamsBll.leftGroup(teamId, req.user);
  res.send(result);
};

exports.search = function* teamsSearchGroup(req, res) {
  const word = req.params.word;
  const result = yield teamsBll.search(word);
  res.send(result);
};
