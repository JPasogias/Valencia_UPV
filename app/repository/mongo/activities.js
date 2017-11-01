'use strict';
const mongoose = require('mongoose');
const activityModel = mongoose.model('Activities');

exports.create = function* activityCreate(activity) {
  return activityModel.create(activity);
};

exports.get = function* activityGetAll(user) {
  const query = {
    idUser: user._id,
  };
  return yield activityModel.find(query).lean().exec();
};

exports.getByType = function* activityGetByType(activityType, user) {
  const query = {
    idUser: user._id,
    type: activityType,
  };
  return yield activityModel.find(query).lean().exec();
};

exports.getByTeam = function* activityGetByTeam(idTeam, user) {
  const query = {
    type: 'GROUP',
    'typeGroup.idGroup': idTeam,
  };
  return yield activityModel.find(query).lean().exec();
};

exports.markAsRead = function* activityMarkAsRead(activityType, user) {
  const query = {
    idUser: user._id,
    type: activityType,
  };
  const update = {
    $set: {
      readed: true,
    },
  };
  const options = {
    multi: true,
  };
  return yield activityModel.update(query, update, options).lean().exec();
};

exports.getUnread = function* activityGetUnread(user) {
  const query = {
    idUser: user._id,
    readed: false,
  };
  return yield activityModel.find(query).lean().exec();
};
