'use strict';
const mongoose = require('mongoose');
const requestModel = mongoose.model('Team-request');

exports.create = function* requestTeamCreate(requestTeam) {
  return requestModel.create(requestTeam);
};

exports.getById = function* requestTeamGetById(id) {
  return yield requestModel.findOne({ _id: id }).lean().exec();
};
