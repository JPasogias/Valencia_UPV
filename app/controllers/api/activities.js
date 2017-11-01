'use strict';
const co = require('co');
const handleError = require('../../../helpers/controller').handleError;
const activitiesBll = require('../../bll/activities');

exports.create = function activitiesCreate(req, res) {
  co(function* () {
    const activity = req.body;
    const newActivity = yield activitiesBll.create(activity, req.user);
    res.send(newActivity);
  }).catch(handleError(req, res));
};

exports.getAll = function activitiesGet(req, res) {
  co(function* () {
    const activities = yield activitiesBll.getAll(req.user);
    res.send(activities);
  }).catch(handleError(req, res));
};

exports.getByType = function activitiesGet(req, res) {
  co(function* () {
    const type = req.params.type;
    const activities = yield activitiesBll.getByType(type, req.user);
    res.send(activities);
  }).catch(handleError(req, res));
};

exports.getByTeam = function activitiesGetByTeam(req, res) {
  co(function* () {
    const idTeam = req.params.idTeam;
    const activities = yield activitiesBll.getByTeam(idTeam, req.user);
    res.send(activities);
  }).catch(handleError(req, res));
};

exports.getUnread = function activitiesGetUnread(req, res) {
  co(function* () {
    const activities = yield activitiesBll.getUnread(req.user);
    res.send(activities);
  }).catch(handleError(req, res));
};

exports.markAsRead = function activitiesMarkAsRead(req, res) {
  co(function* () {
    const type = req.params.type;
    const activities = yield activitiesBll.markAsRead(type, req.user);
    res.send(activities);
  }).catch(handleError(req, res));
};
