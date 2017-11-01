'use strict';

const validator = require('validator');
const errorHelper = require('../../helpers/error');
const datapool = require('../datapool');
const experimentsRepository = datapool.getRepository('experiments');
const userBll = require('./user');

const forumhiloRepository = datapool.getRepository('forum-hilo');
const forummensajeRepository = datapool.getRepository('forum-mensaje');
const forumcategoriaRepository = datapool.getRepository('forum-categoria');


exports.create = function* experimentsCreate(experiment, user) {
  experiment.idUser = user;

  const experimentDB =  yield experimentsRepository.create(experiment);
  if(experimentDB){
    const categoriaDB = yield forumcategoriaRepository.getByName('Experiments')
    var topic = {
      title: experiment.title,
      idCategoria: categoriaDB._id,
      public: true,
      idUser: user._id,
      creationDate: new Date()
    };
    const topicDB =  yield forumhiloRepository.create(topic);
    var exp = experimentDB
    exp.forum = '/categories/' + categoriaDB._id +'/topic/' +topicDB._id


    var contentmsg = "";
    contentmsg = contentmsg + "<p><strong>Title: </strong>" + experiment.title + "</p>";
    contentmsg = contentmsg + "<p><strong>Abstract: </strong>" + experiment.abstractmsg + "</p>";

    var msg = {
      idHilo: topicDB._id,
      creationDate: new Date(),
      idUser: user._id,
      content: contentmsg,
    };
    const msgDB =  yield forummensajeRepository.create(msg);

    const experimentWithForum =  yield experimentsRepository.update(exp);
    return experimentWithForum;

  }

  return experimentDB;
};

exports.update = function* experimentsUpdate(experiment, user) {
  experiment.idUser = user;
  const experimentDB =  yield experimentsRepository.update(experiment);
  return experimentDB;
};

exports.delete = function* experimentsDelete(experiment, user) {
  const experimentDB =  yield experimentsRepository.delete(experiment);
  return experimentDB;
};

function compareDate(a, b) {
  if (a.publishdate > b.publishdate)
  return -1;
  if (a.publishdate < b.publishdate)
  return 1;
  return 0;
}

exports.getAll = function* experimentsGetAll() {
  // SortPosts
  let experiments = yield experimentsRepository.getAll();
  experiments = experiments.sort(compareDate);

  //Get user name
  for (var experiment in experiments) {
    var user = yield userBll.getById(experiments[experiment].idUser);
    experiments[experiment].owner = user.username;
  }

  //Get abstract
  for (var experiment in experiments) {
    experiments[experiment].abstract = experiments[experiment].abstractmsg.replace(/<(?:.|\n)*?>/gm, '').substring(0, 300) + '...';
  }
  return experiments;
};

exports.getById = function* notebooksGetById(experimentId) {
  var experiment = yield experimentsRepository.getById(experimentId);
  if(experiment){
    var user = yield userBll.getById(experiment.idUser);
    experiment.owner =  user.username;
  }
  return experiment;
};

exports.getNumKeyWords = function getNumKeyWords(keyword) {
  var numkw = 0;
  var experiments = getAll();

  for (var experiment in experiments) {
    if (experiment.keyword1 == keyword){
      numkw++;
    }
    else if (experiment.keyword2 == keyword){
      numkw++;
    }
    else if (experiment.keyword3 == keyword){
      numkw++;
    }
    else if (experiment.keyword4 == keyword){
      numkw++;
    }
  }

  return numkw;
};

exports.getAllNameExperiments = function nameExperimentsGetAll() {
  var names = [];
  var experiments = getAll();

  for (var experiment in experiments) {
    names.push(experiment.title);
  }

  return names;
};
