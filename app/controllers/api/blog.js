'use strict';
const co = require('co');
const handleError = require('../../../helpers/controller').handleError;
const blogBll = require('../../bll/blog');

exports.contador = function blogGetAll(req, res) {
  co(function* () {
    const result = yield blogBll.getAll();
    var reslength = result.length
    res.send({value:reslength});
  }).catch(handleError(req, res));
};

exports.create = function blogCreate(req, res) {
  co(function* () {
    const msg = req.body.data;
    const post = yield blogBll.create(msg, req.user);
    res.send(post);
  }).catch(handleError(req, res));
};

exports.update = function blogUpdate(req, res) {
  co(function* () {
    const msg = req.body.data;
    const post = yield blogBll.update(msg, req.user);
    res.send(post);
  }).catch(handleError(req, res));
};

exports.delete = function blogDelete(req, res) {
  co(function* () {
    const idPost = req.params.idPost;
    const posts = yield blogBll.delete(idPost, req.user);
    res.send(posts);
  }).catch(handleError(req, res));
};

exports.getAll = function blogGetAll(req, res) {
  co(function* () {
    const result = yield blogBll.getAll();
    res.send(result);
  }).catch(handleError(req, res));
};

exports.getById = function teamsGetById(req, res) {
  co(function* () {
    const idPost = req.params.idPost;
    const post = yield blogBll.getById(idPost);
    res.send(post);
  }).catch(handleError(req, res));
};
