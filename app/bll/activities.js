'use strict';

const datapool = require('../datapool');
const activitiesRepository = datapool.getRepository('activities');

exports.create = function* activitiesCreate(activity, user) {
  return yield activitiesRepository.create(activity);
};

exports.getAll = function* activitiesGet(user) {
  return yield activitiesRepository.get(user);
};

exports.getByType = function* activitiesGetByType(type, user) {
  return yield activitiesRepository.getByType(type, user);
};

exports.getByTeam = function* activitiesGetByTeam(idTeam, user) {
  return yield activitiesRepository.getByTeam(idTeam, user);
};

exports.getUnread = function* activitiesGetUnread(user) {
  return yield activitiesRepository.getUnread(user);
};

exports.markAsRead = function* activitiesMarkAsRead(type, user) {
  return yield activitiesRepository.markAsRead(type, user);
};
