'use strict';
const co = require('co');
const handleError = require('../../../helpers/controller').handleError;
const experimentsBll = require('../../bll/experiments');

exports.contador = function blogGetAll(req, res) {
  co(function* () {
    const result = yield experimentsBll.getAll();
    var reslength = result.length
    res.send({value:reslength});
  }).catch(handleError(req, res));
};

exports.create = function experimentsCreate(req, res) {
  co(function* () {
    const msg = req.body.data;
    const post = yield experimentsBll.create(msg, req.user);
    res.send(post);
  }).catch(handleError(req, res));
};

exports.update = function experimentsUpdate(req, res) {
  co(function* () {
    const msg = req.body.data;
    const post = yield experimentsBll.update(msg, req.user);
    res.send(post);
  }).catch(handleError(req, res));
};

exports.delete = function experimentsDelete(req, res) {
  co(function* () {
    const idExperiment = req.params.idExperiment;
    const posts = yield experimentsBll.delete(idExperiment, req.user);
    res.send(posts);
  }).catch(handleError(req, res));
};

exports.getAll = function experimentsGetAll(req, res) {
  co(function* () {
    const result = yield experimentsBll.getAll();
    res.send(result);
  }).catch(handleError(req, res));
};

exports.getById = function teamsGetById(req, res) {
  co(function* () {
    const idExperiment = req.params.idExperiment;
    const post = yield experimentsBll.getById(idExperiment);
    res.send(post);
  }).catch(handleError(req, res));
};
