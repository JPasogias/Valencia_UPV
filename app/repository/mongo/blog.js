'use strict';
const mongoose = require('mongoose');
const blogsModel = mongoose.model('Blog');

exports.create = function* blogsCreate(post) {
  return blogsModel.create(post);
};

exports.update = function* blogsUpdate(post) {
  var filter = { _id: post._id };
  var update = post;
  var options = { new: true };
  return yield blogsModel.findOneAndUpdate(filter, update, options).lean().exec();
};

exports.delete = function* blogsDelete(post) {
  const query = {
    _id: post,
  };
  return yield blogsModel.remove(query).lean().exec();
};


exports.getAll = function* blogsGetAll(user) {
  return yield blogsModel.find({}).lean().exec();
};

exports.getById = function* blogsGetById(id) {
  return yield blogsModel.findOne({ _id: id }).lean().exec();
};
