'use strict';
const mongoose = require('mongoose');
const experimentModel = mongoose.model('Experiment');

exports.create = function* experimentCreate(experiment) {
  return experimentModel.create(experiment);
};

exports.update = function* experimentUpdate(experiment) {
  var filter = { _id: experiment._id };
  var update = experiment;
  var options = { new: true };
  return yield experimentModel.findOneAndUpdate(filter, update, options).lean().exec();
};

exports.delete = function* experimentDelete(experiment) {
  const query = {
    _id: experiment,
  };
  return yield experimentModel.remove(query).lean().exec();
};


exports.getAll = function* experimentGetAll(user) {
  return yield experimentModel.find({}).lean().exec();
};

exports.getById = function* experimentGetById(id) {
  return yield experimentModel.findOne({ _id: id }).lean().exec();
};
