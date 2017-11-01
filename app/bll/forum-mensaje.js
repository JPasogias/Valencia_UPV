'use strict';

const validator = require('validator');
const errorHelper = require('../../helpers/error');
const datapool = require('../datapool');
const newsRepository = datapool.getRepository('forum-mensaje');

exports.create = function* newsCreate(data, categoria, user) {
  var post = {}
  post.content = data || '';
  post.idHilo = categoria;
  post.creationDate = new Date();
  post.idUser = user._id;

  const postdb =  yield newsRepository.create(post);
  return postdb;
};

exports.update = function* newsUpdate(post, user) {
  post.idUser = user;
  const postDB =  yield newsRepository.update(post);
  return postDB;
};

exports.delete = function* newsDelete(post, user) {
  const postDB =  yield newsRepository.delete(post);
  return postDB;
};

exports.getAll = function* newsGetAll() {
  return yield newsRepository.getAll();
};

exports.getById = function* notebooksGetById(postId) {
  return yield newsRepository.getById(postId);
};

const userBll = require('../bll/user');
exports.getByPostId = function* notebooksGetByPostId(topicId) {
  var posts =  yield newsRepository.getByPostId(topicId);
  var user = {};
  for(var p in posts){
    var userId = posts[p].idUser;
    user = yield userBll.getByIdPassportMethod(userId);
    posts[p].userdata = {
      username : user.username,
      isAdmin : user.admin,
      id: user._id,
      name: user.personalInfo.name  + ' ' + user.personalInfo.lastname || user.username,
      image: user.personalInfo.image,
    }
  }
  return posts;
};
