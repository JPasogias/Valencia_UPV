'use strict';

const validator = require('validator');
const errorHelper = require('../../helpers/error');
const datapool = require('../datapool');
const blogRepository = datapool.getRepository('blog');
const userBll = require('./user');

exports.create = function* blogCreate(post, user) {
  post.idUser = user._id;
  const postDB =  yield blogRepository.create(post);
  return postDB;
};

exports.update = function* blogUpdate(post, user) {
  post.idUser = user;
  const postDB =  yield blogRepository.update(post);
  return postDB;
};

exports.delete = function* blogDelete(post, user) {
  const postDB =  yield blogRepository.delete(post);
  return postDB;
};

function compareDate(a, b) {
  if (a.publishdate > b.publishdate)
  return -1;
  if (a.publishdate < b.publishdate)
  return 1;
  return 0;
}

exports.getAll = function* blogGetAll() {
  // SortPosts
  let blog = yield blogRepository.getAll();
  blog = blog.sort(compareDate);

  //Get user name
  for (var post in blog) {
    var user = yield userBll.getById(blog[post].idUser);
    if(user){
      blog[post].owner =  user.username;
    }else{
      blog[post].owner = 'UNKOWN'
    }
  }

  //Get abstract
  for (var post in blog) {
    blog[post].abstract = blog[post].contentmsg.replace(/<(?:.|\n)*?>/gm, '').substring(0, 300) + '...';
  }

  return blog;
};

exports.getById = function* notebooksGetById(postId) {
  var post = yield blogRepository.getById(postId);
  var user = yield userBll.getById(post.idUser);
  if(user){
    post.owner =  user.username;
  }else{
    post.owner = 'UNKOWN'
  }
  return post;
};
