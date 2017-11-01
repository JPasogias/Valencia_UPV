'use strict';

const validator = require('validator');
const errorHelper = require('../../helpers/error');
const datapool = require('../datapool');
const userRepository = datapool.getRepository('user');
const forumcategoriaRepository = datapool.getRepository('forum-categoria');
const forumhiloRepository = datapool.getRepository('forum-hilo');
const forummensajeRepository = datapool.getRepository('forum-mensaje');

// ****************************************************************************
// Metodo para inicializar la herramienta en el primer usuario
function* initdb(){

  // Consultamos si esta el primer usuario creado, en caso contrario no hacemos nada
  const users = yield userRepository.getUsers();
  if (users.length == 0) {
    return;
  }
  const user = users[0]

  // Creamos la categoria
  var categoria = {}
  categoria = {
    title: 'Forum Rules',
    description: 'Forum Rules',
    type: 'general',
    idUser: user._id,
    public: true,
    creationDate: new Date(),
  };

  yield forumcategoriaRepository.create(categoria);

  categoria = {
    title: 'Products Presentation',
    description: 'Products Presentation',
    type: 'general',
    idUser: user._id,
    public: true,
    creationDate: new Date(),
  };

  yield forumcategoriaRepository.create(categoria);

  categoria = {
    title: 'Offtopic Forum',
    description: 'Offtopic Forum',
    type: 'general',
    idUser: user._id,
    public: true,
    creationDate: new Date(),
  };

  yield forumcategoriaRepository.create(categoria);

  categoria = {
    title: 'PlantLabCo News',
    description: 'PlantLabCo News',
    type: 'general',
    idUser: user._id,
    public: true,
    creationDate: new Date(),
  };

  yield forumcategoriaRepository.create(categoria);

  categoria = {
    title: 'Support',
    description: 'Support',
    type: 'support',
    idUser: user._id,
    public: true,
    creationDate: new Date(),
  };

  yield forumcategoriaRepository.create(categoria);
  categoria = {
    title: 'Frequently Asqued Questions',
    description: 'Frequently Asqued Questions',
    type: 'support',
    idUser: user._id,
    public: true,
    creationDate: new Date(),
  };

  yield forumcategoriaRepository.create(categoria);

  categoria = {
    title: 'Experiments',
    description: 'Forum of experiments',
    type: 'general',
    idUser: user._id,
    public: true,
    creationDate: new Date(),
  };

  yield forumcategoriaRepository.create(categoria);
}
// ****************************************************************************

function compareDate(a, b) {
  if (a.creationDate > b.creationDate)
  return -1;
  if (a.creationDate < b.creationDate)
  return 1;
  return 0;
}


exports.create = function* newsCreate(category, user) {
  category.idUser = user._id;
  category.public = true;
  category.creationDate = new Date();
  const categoryDB =  yield forumcategoriaRepository.create(category);
  return categoryDB;
};

exports.update = function* newsUpdate(category, user) {
  category.idUser = user;
  const categoryDB =  yield forumcategoriaRepository.update(category);
  return categoryDB;
};

exports.delete = function* newsDelete(category, user) {
  const categoryDB =  yield forumcategoriaRepository.delete(category);
  return categoryDB;
};


exports.getAll = function* newsGetAll() {

  var categoryDB = yield forumcategoriaRepository.getAll();
  if(categoryDB.length == 0){
    yield initdb();
    categoryDB = yield forumcategoriaRepository.getAll();
  }
  for(var c in categoryDB){

    // if(categoryDB[c].title == 'Experiments'){
    //   categoryDB[c].description ='Forum of experiments';
    //   yield forumcategoriaRepository.update(categoryDB[c]);
    // }

    var cat = categoryDB[c];
    var hilos = yield forumhiloRepository.getByCategoryId(cat._id);
    var mensajes = []
    for(var h in hilos){
      mensajes = mensajes.concat( yield forummensajeRepository.getByPostId(hilos[h]._id));
    }
    mensajes = mensajes.sort(compareDate);

    categoryDB[c].numHilos = hilos.length || 0;
    categoryDB[c].numPost = mensajes.length || 0;
    if(mensajes.length > 0){
      categoryDB[c].lastPost = mensajes[0];
      var user = yield userRepository.getById(categoryDB[c].lastPost.idUser);
      categoryDB[c].lastPost.username = user.username
    }else{
      categoryDB[c].lastPost =  '';
    }
  }
  return categoryDB;
};

exports.getById = function* notebooksGetById(categoryId) {
  return yield forumcategoriaRepository.getById(categoryId);
};
