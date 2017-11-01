'use strict';

const validator = require('validator');
const errorHelper = require('../../helpers/error');
const datapool = require('../datapool');
const co = require('co');
const userRepository = datapool.getRepository('user');
const bcrypt = require('bluebird').promisifyAll(require('bcrypt-nodejs'));
const tokenBll = require('./token');
const activitiesBll = require('./activities');
const teamsBll = require('./teams');
var error;

const i18next = require('i18next');
const mailer = require('../utils/mailer');
const EMAILUSER = require('../../config/config/config.json').mail;
const URLWEB = require('../../config/config/config.json').url;
const jade = require('jade');


// ****************************************************************************
// Metodo para inicializar la herramienta en el primer usuario
function* initdb(user){

  // Le damos privilegios de administrador
  user.admin = true;
  user.verified = true;
  yield userRepository.update(user._id, user);

  // Añadimos al usuario al grupo por defecto
  var team = yield teamsBll.getMandatory()
  team.members.push({
    idUser: user._id,
    joinDate: new Date(),
    isAdmin: true,
  });
  yield teamsBll.update(team._id, team);

  // - Se registra la actividad de la tarea realizada
  var activity = {
    idUser: user._id,
    time: new Date(),
    type: 'USER',
    description: 'User joins to team' + team._id ,
  };
  yield activitiesBll.create(activity);

}
// ****************************************************************************

// Metodo para crear un usuario
exports.create = function* userCreate(user) {
  //  - Se pasa a minusculas el email antes de persistirlo
  user.email = user.email.toLowerCase();

  //  - Se pasa a clave hash la contraseña antes de persistirla
  user.password = generateHash(user.password);

  //  - Se dota al usuario de un nombre de usuario "aleatorio"
  var num =  yield userRepository.getByName(user.personalInfo.name) || [];
  user.username = user.personalInfo.name + '-' + num.length;
  user.username = user.username.toLowerCase();
  if(num.length == 0){
    user.username = user.personalInfo.name.toLowerCase();
  }

  //  - Se persiste al usuario
  user = yield userRepository.create(user);

  // - Se registra la actividad de la tarea realizada
  var activity = {
    idUser: user._id,
    time: new Date(),
    type: 'USER',
    description: 'User created',
  };
  yield activitiesBll.create(activity);

  // - Se une al usuario al grupo por defecto
  var mandatoryTeam = yield teamsBll.getMandatory();
  yield teamsBll.addUserToTeam(mandatoryTeam._id, user._id)
  // - Se registra la actividad de la tarea realizada
  var activity = {
    idUser: user._id,
    time: new Date(),
    type: 'USER',
    description: 'User joins to team' + mandatoryTeam._id ,
  };
  yield activitiesBll.create(activity);

  // En caso de que no este el grupo por defecto inicializamos la base de datos
  var users = yield userRepository.getUsers();
  if(users.length == 1){
    yield initdb(user);
  }

  //  - Se envia correo de confirmación
  yield sendVerificationEmail(user);

  return user;
};

// Metodo para establecer un encriptado a un token dado
// Devuelve el token encriptado
function generateHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// Metodo para enviar un correo de verificación de cuenta de usuario
function* sendVerificationEmail(user) {
  var email = createVerificationEmailForAnUser(user);

  var mailOptions = {
    from: EMAILUSER.name + '<' + EMAILUSER.username + '>',
    to: user.email,
    subject: 'Please verify your account to continue',
    html: email,
  };

  yield mailer.sendEmail(mailOptions);
}

// Metodo para componer un email de verificación concreto para un usuario dado
// Devuelve el email en formato HTML
function createVerificationEmailForAnUser(user) {

  var verifyEmailLink = URLWEB + 'activate-account?email=' + user.email + '&token=' + user._id;
  var unsubscribeEmailLink = URLWEB + 'unsubscribe-account?email=' + user.email + '&token=' + user._id;

  var renderOptions = {
    i18next: i18next,
    linkWeb: URLWEB,
    linkLogoHeader: URLWEB + 'images/emails/FirmaPlantlabco.jpg',
    linkVerification: verifyEmailLink,
    linkUnsubscribe: unsubscribeEmailLink,
  };

  var dirname = __dirname;

  return jade.renderFile(__dirname + '/../views/emails/verify_email.jade', renderOptions);

}

// Metodo que dado un email y un id de usuario, cambia el estado verificado de un usuario
// a true si el id coincide con el del objeto de usuario
exports.verifyEmail = function* userCreate(email, token) {
  try {
    let dbUser = yield userRepository.getById(token);
    if (dbUser && dbUser.email === email) {
      if (dbUser.verified === false) {
        yield userRepository.findOneAndUpdateStatus(token);
        return { error: false, errorType: 'VerifiedSuccess' };
      } else {
        return { error: false, errorType: 'AlreadyVerified' };
      }
    };

    return { error: true, errorType: 'idNotFound' };
  }catch (err) {
    return { error: true, errorType: 'idNotFound' };
  }

};


// Metodo que dada una contraseña y un usuario devuelve 'True' en caso de que la
// contraseña sea correcta
exports.validPassword = function validPassword(password, user) {
  return bcrypt.compareSync(password, user.password);
};

exports.reverifyEmail = function* reverifyEmail(email) {
  let user = yield userRepository.getByEmail(email);
  yield sendVerificationEmail(user);
  return user;

};

exports.getByEmail = function* userGetByEmail(email) {
  let user = yield userRepository.getByEmail(email);
  return user;
};

exports.getByUsername = function* userGetByUsername(username) {
  username = username.replace('@', '');
  let user = yield userRepository.getByUsername(username);
  return user;
};

//
exports.update = function* updateUser(idUser, update) {
  var user = yield userRepository.update(idUser, update);
  return user;
};

exports.updatePassword = function* updateUser(passwords, user) {
  var user = yield getById(user._id)
  if(bcrypt.compareSync(passwords.password, user.password)){
    passwords.newpassword1 = generateHash(passwords.newpassword1);
    var user = yield userRepository.updatePassword(passwords.newpassword1, user._id);
    return true;
  }else{
    return false;
  }
};

exports.getByIdPassportMethod = function* userGetByIdPassportMethod(id) {
  let user = yield userRepository.getById(id);
  user.lastLogin = new Date();
  yield userRepository.update(user._id, user);
  delete user.password;
  delete user.creationDate;

  return user;
};

function* getById(id) {
  error = errorHelper.create('ValidationFailed', 'User BLL validation failed');
  yield validateId(id, error);
  if (Object.keys(error.data).length) {
    throw error;
  };

  let user = yield userRepository.getById(id);
  return user;
}

function validateName(user, error) {
  if (user.name) {
    var nameValue = user.name.toString();
    var isNameValid = nameValue && validator.isLength(nameValue, {
      min: 1,
      max: undefined,
    });
    if (!isNameValid) {
      error.data.name = 'NameIsRequired';
    }
  } else {
    error.data.name = 'NameIsRequired';
  }
}

function validateLastName(user, error) {
  if (user.lastName) {
    var lastNameValue = user.lastName.toString();
    var isLastNameValid = lastNameValue && validator.isLength(lastNameValue, {
      min: 1,
      max: undefined,
    });
    if (!isLastNameValid) {
      error.data.lastName = 'LastNameIsRequired';
    }
  } else {
    error.data.lastName = 'LastNameIsRequired';
  }
}

function validateEmail(email, error) {
  if (email) {
    var emailValue = email.toString();
    var isEmailValid = emailValue && validator.isLength(emailValue, {
      min: 1,
      max: undefined,
    });
    if (!isEmailValid) {
      error.data.email = 'EmailIsRequired';
    }else {
      isEmailValid = validator.isEmail(email);
      if (!isEmailValid) {
        error.data.email = 'EmailIsWrong';
      }
    }
  } else {
    error.data.email = 'EmailIsRequired';
  }
}

function* validateId(id, error) {
  if (id) {
    var idValue = id.toString();
    var validLength = idValue && validator.isLength(idValue, {
      min: 1,
      max: undefined,
    });
    var aux = yield userRepository.validateId(idValue);
    var validId = id && aux;
    var isIdValid = validLength && validId;
    if (!isIdValid) {
      error.data.id = 'IdIsRequired';
    }
  } else {
    error.data.id = 'IdIsRequired';
  }
}

function validatePassword(user, error) {
  if (user.password) {
    var isPasswordValid = user.password &&
    validator.isLength(user.password, { min: 1, max: undefined });
    if (!isPasswordValid) {
      error.data.password = 'PasswordIsRequired';
    }else {
      isPasswordValid = validator.isLength(user.password, {
        min: 6,
        max: undefined,
      })
      && validator.isAlphanumeric(user.password)
      && !validator.isAlpha(user.password)
      && !validator.isNumeric(user.password);
      if (!isPasswordValid) {
        error.data.password = 'PasswordIsWrong';
      }
    }
  } else {
    error.data.password = 'PasswordIsRequired';
  }
}

function getEmailOptions(user) {
  var mailConfig = require('../../config/config/config.json').mail;
  var verifyemaillink = 'http://finabee.finametrix.com/activate-account?email=' + user.email + '&token=' + user._id;

  var jade = require('jade');
  var options = {
    i18next: i18next,
    link: verifyemaillink,
  };
  var dirname = __dirname;
  var htmlcorreo = jade.renderFile(dirname + '/../views/emails/verify.jade', options);
  var mailOptions = {
    from: mailConfig.name + '<' + mailConfig.username + '>',
    to: user.email,
    subject: i18next.t('VERIFICATIONEMAIL.SUBJECT'),
    html: htmlcorreo,
  };
  return mailOptions;
}

function randomString(len, charSet) {
  charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var randomString = '';
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }

  return randomString;
}

function* sendRecoverPasswordEmail(user, idToken) {

  var mailConfig = require('../../config/config/config.json').mail;
  var passwordLink = 'http://finabee.finametrix.com/new-password?token=' + idToken;

  var jade = require('jade');
  var options = {
    i18next: i18next,
    link: passwordLink,
  };
  var dirname = __dirname;
  var htmlcorreo = jade.renderFile(dirname + '/../views/emails/recoverpassword.jade', options);
  var mailOptions = {
    from: mailConfig.name + '<' + mailConfig.username + '>',
    to: user.email,
    subject: i18next.t('RECOVERPASSWORDEMAIL.SUBJECT'),
    html: htmlcorreo,
  };

  yield mailer.sendEmail(mailOptions);
}

function objectFindByKey(array, key, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][key].toString() == value.toString()) {
      return array[i];
    }
  }

  return null;
}

exports.resendVerificationEmail = function* resendVerificationEmail(user) {
  yield sendVerificationEmail(user);
  return user;
};

exports.getById = function* userGetById(id) {
  return yield getById(id);
};

exports.getUsers = function* getUsers() {
  return yield userRepository.getUsers();
};

exports.recoverpassword = function* recoverpassword(email) {
  error = errorHelper.create('ValidationFailed', 'User BLL validation failed');
  validateEmail(email, error);
  if (Object.keys(error.data).length) {
    throw error;
  };

  var user = yield userRepository.getByEmail(email);

  if (!user) {
    error = errorHelper.create('UserNotFound', 'User for email not found');
    error.data.user = email;
    throw error;
  }

  var token = {
    idUser: user._id,
  };

  var token = yield tokenBll.create(token);
  yield sendRecoverPasswordEmail(user, token._id);

  return user;
};

exports.updateImage = function* updateImage(image, user) {
  var user = yield userRepository.updateImage(image, user._id);
  return user;
};
