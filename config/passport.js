'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const co = require('co');
const i18next = require('i18next');
const userBll = require('../app/bll/user');
const activitiesBll = require('../app/bll/activities');

module.exports = function (config) {

  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    if(user){
      return done(null, user._id);
    }
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    return co(function* () {
      if(id){
        let user = yield userBll.getByIdPassportMethod(id);
        return done(null, user);
      }
    });
  });

  passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
  }, function (req, username, password, done) {
    if (!username && !password) {
      return done(null, false,"ERROR EN EL LOGIN");
    }

    co(function* () {
      var email = username;
      var user;
      if (email.indexOf('@') > 1) {
        user = yield userBll.getByEmail(email);
      } else {
        user = yield userBll.getByUsername(username);
      }

      if(user == null){
        return done(null, false,"ERROR EN EL LOGIN");
      }else{
        var validPassword = userBll.validPassword(password, user);
        if (!validPassword) {
          var activity = {
            idUser: user._id,
            time: new Date(),
            type: 'LOGIN',
            description: 'USER_LOGIN FAIL',
          };
          yield activitiesBll.create(activity);
          return done(null, false,"ERROR EN EL LOGIN");
        }

        var activity = {
          idUser: user._id,
          time: new Date(),
          type: 'LOGIN',
          description: 'USER_LOGIN',
        };
        yield activitiesBll.create(activity);
        done(null, user);
      }


    }).catch(function (err) {
      return done(null, false,"ERROR EN EL LOGIN");
    });
  }));
};
