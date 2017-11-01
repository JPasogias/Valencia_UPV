'use strict';
const co = require('co');
const handleError = require('../../../helpers/controller').handleError;
const forumBLL = require('../../bll/forum-categoria');

exports.create = function newsCreate(req, res) {
  co(function* () {
    const msg = req.body.data;
    const post = yield forumBLL.create(msg, req.user);
    res.send(post);
  }).catch(handleError(req, res));
};

exports.update = function newsUpdate(req, res) {
  co(function* () {
    const msg = req.body.data;
    const post = yield forumBLL.update(msg, req.user);
    res.send(post);
  }).catch(handleError(req, res));
};
exports.delete = function newsDelete(req, res) {
  co(function* () {
    const idPost = req.params.idPost;
    const posts = yield forumBLL.delete(idPost, req.user);
    res.send(posts);
  }).catch(handleError(req, res));
};
exports.getAll = function newsGetAll(req, res) {
  co(function* () {
    const result = yield forumBLL.getAll();
    res.send(result);
  }).catch(handleError(req, res));
};

exports.getById = function teamsGetById(req, res) {
  co(function* () {
    const idPost = req.params.idPost;
    const post = yield forumBLL.getById(idPost);
    res.send(post);
  }).catch(handleError(req, res));
};
