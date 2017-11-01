'use strict';

const validator = require('validator');
const errorHelper = require('../../helpers/error');
const datapool = require('../datapool');
const userRepository = datapool.getRepository('user');
const forumhiloRepository = datapool.getRepository('forum-hilo');
const forummensajeRepository = datapool.getRepository('forum-mensaje');

function compareDate(a, b) {
  if (a.creationDate > b.creationDate)
  return -1;
  if (a.creationDate < b.creationDate)
  return 1;
  return 0;
}

exports.create = function* newsCreate(topic, user) {
  topic.idUser = user._id;
  topic.public = true;
  topic.creationDate = new Date();
  const topicDB =  yield forumhiloRepository.create(topic);

  var post = {}
  post.content = topic.content || '';
  post.idHilo = topicDB._id;
  post.creationDate = new Date();
  post.idUser = user._id;

  const postdb =  yield forummensajeRepository.create(post);
  return topicDB;
};

exports.update = function* newsUpdate(topic, user) {
  topic.idUser = user;
  const topicDB =  yield forumhiloRepository.update(topic);
  return topicDB;
};

exports.delete = function* newsDelete(topic, user) {
  const topicDB =  yield forumhiloRepository.delete(topic);
  return topicDB;
};

exports.getAll = function* newsGetAll() {
  var hilosdb =  yield forumhiloRepository.getAll();
  for(var c in hilosdb){
    var topic = hilosdb[c];
    var mensajes = yield forummensajeRepository.getByPostId(topic._id);
    mensajes = mensajes.sort(compareDate);

    var voices = [];
    for(var m in mensajes){
      var voice = mensajes[m].idUser
      var index = voices.indexOf(voice);

      if(index <= 0){
        voices.push(voice)
      }
    }

    hilosdb[c].numVoices = voices.length || 0;
    hilosdb[c].numMensajes = mensajes.length || 0;
    if(mensajes.length > 0){
      hilosdb[c].lastPost = mensajes[0];
      var user = yield userRepository.getById(hilosdb[c].lastPost.idUser);
      hilosdb[c].lastPost.username = user.username
    }else{
      hilosdb[c].lastPost =  '';
    }
  }
  return hilosdb;
};

exports.getById = function* notebooksGetById(topicId) {
  return yield forumhiloRepository.getById(topicId);
};

exports.getByCategoryId = function* notebooksGetByCategoryId(topicId) {
  var hilosdb =  yield forumhiloRepository.getByCategoryId(topicId);
  for(var c in hilosdb){
    var topic = hilosdb[c];
    var userC = yield userRepository.getById(hilosdb[c].idUser);
    hilosdb[c].creatorName = userC.username;
    var mensajes = yield forummensajeRepository.getByPostId(topic._id);
    mensajes = mensajes.sort(compareDate);

    var voices = [];
    for(var m in mensajes){
      var voice = mensajes[m].idUser.toString()
      var index = voices.indexOf(voice.toString());
      if(index <= 0){
        voices.push(voice)
      }
    }

    hilosdb[c].numVoices = voices.length || 0;
    hilosdb[c].numMensajes = mensajes.length || 0;
    if(mensajes.length > 0){
      hilosdb[c].lastPost = mensajes[0];
      var user = yield userRepository.getById(hilosdb[c].lastPost.idUser);
      hilosdb[c].lastPost.username = user.username
    }else{
      hilosdb[c].lastPost =  '';
    }
  }
  return hilosdb;
};
