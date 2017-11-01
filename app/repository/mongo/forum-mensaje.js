'use strict';
const mongoose = require('mongoose');
const newsModel = mongoose.model('Forum-mensaje');

exports.create = function* newsCreate(post) {
  return newsModel.create(post);
};

exports.update = function* newsUpdate(post) {
  var filter = { _id: post._id };
  var update = post;
  var options = { new: true };
  return yield newsModel.findOneAndUpdate(filter, update, options).lean().exec();
};

exports.delete = function* newsDelete(post) {
  const query = {
    _id: post,
  };
  return yield newsModel.remove(query).lean().exec();
};


exports.getAll = function* newsGetAll(user) {
  return yield newsModel.find({}).lean().exec();
};

exports.getById = function* newsGetById(id) {
  return yield newsModel.findOne({ _id: id }).lean().exec();
};

exports.getByPostId = function* newsGetById(id) {
  return yield newsModel.find({ idHilo: id }).lean().exec();
};
