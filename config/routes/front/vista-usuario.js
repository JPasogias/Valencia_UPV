'use strict';

const wrap = require('co-express');
const co = require('co');
const passport = require('passport');
const userController = require('../../../app/controllers/front/user');
const teamsBll = require('../../../app/bll/teams');
const handleError = require('../../../helpers/controller').handleError;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {return next();}
  res.redirect('/');
}

function isCorrectUser(req, res, next) {
  if (req.params.idUser.toString() === req.user._id.toString()) {return next();}
  res.redirect('/log-out');
}

function isVerified(req, res, next) {
  if (req.user.verified) {return next();}
  res.redirect('/activate-account-reverify?email=' + req.user.email + '&token=false');
}


function setTimeSession(req, res, next) {
  if (req.body.remCredentials === true) {
    req.session.cookie.maxAge = 100 * 365 * 24 * 60 * 60 * 1000;
  } else {
    req.session.cookie.expires = false;
  }
  return next();
}

//Redireccion de rutas
module.exports = function (app, config) {

  //Log in

  const teamsBll = require('../../../app/bll/teams');

  app.get('/defaultsite', function (req, res) {
    res.redirect('/');
  });
  app.get('/', function (req, res) {
    res.render('vista-usuario/login/index.jade', {
    });
  });
  app.get('/login', function (req, res) {
    res.render('vista-usuario/login/index.jade', {
    });
  });
  app.post('/login', setTimeSession, passport.authenticate('local-login'), function (req, res) {
    res.send({
      userId: req.user._id
    });
  });

  //Log in aux
  app.get('/activate-account', wrap(userController.verifyEmail));
  app.get('/activate-account-reverify', wrap(userController.reverifyEmail));
  app.get('/check-email', function (req, res) {
    res.render('vista-usuario/check-email/index.jade', {
      team: req.params.idteam
    });
  });
  app.get('/users/:idUser/check-email', function (req, res) {
    res.render('vista-usuario/check-email/index.jade', {
        user: req.user,
    });
  });

  //LogOut
  app.get('/log-out', isLoggedIn, function (req, res) {
    req.logout();
    res.redirect('/');
  });

  //Team
  app.get('/teams', function (req, res) {
    res.render('vista-usuario/teams/index.jade', {
      team: req.params.idteam
    });
  });
  app.get('/users/:idUser/teams', isLoggedIn, isVerified, isCorrectUser, function (req, res) {
    res.render('vista-usuario/teams/index.jade', {
        user: req.user,
    });
  });

  //Blog
  app.get('/blog', function (req, res) {
    res.render('vista-usuario/blog/index.jade', {
      team: req.params.idteam
    });
  });
  app.get('/users/:idUser/blog', isLoggedIn, isVerified, isCorrectUser, function (req, res) {
    res.render('vista-usuario/blog/index.jade', {
        user: req.user,
    });
  });
  app.get('/post/:idPost', function (req, res) {
    res.render('vista-usuario/blog/show-post.jade', {
      idPost: req.params.idPost,
    });
  });
  app.get('/users/:idUser/post/:idPost', isLoggedIn, isVerified, isCorrectUser, function (req, res) {
    res.render('vista-usuario/blog/show-post.jade', {
        user: req.user,
      idPost: req.params.idPost,
    });
  });
  app.get('/users/:idUser/blog/manage-post', isLoggedIn, isVerified, isCorrectUser, function (req, res) {
    res.render('vista-usuario/blog/manage-post.jade', {
        user: req.user,
    });
  });
  app.get('/users/:idUser/blog/manage-post/:idPost', isLoggedIn, isVerified, isCorrectUser, function (req, res) {
    res.render('vista-usuario/blog/manage-post.jade', {
        user: req.user,
      idPost: req.params.idPost,
    });
  });

  //Talks
  app.get('/talks', function (req, res) {
    res.render('vista-usuario/talks/index.jade', {
      team: req.params.idteam
    });
  });
  app.get('/users/:idUser/talks', isLoggedIn, isVerified, isCorrectUser, function (req, res) {
    res.render('vista-usuario/talks/index.jade', {
        user: req.user,
    });
  });

  //Forum
  app.get('/foro', function (req, res) {
    res.render('vista-usuario/foro/index_1.jade', {
      });
  });
  app.get('/users/:idUser/foro', isLoggedIn, isVerified, isCorrectUser,function (req, res) {
    res.render('vista-usuario/foro/index_1.jade', {
        user: req.user,
    });
  });
  app.get('/categories/:idCategory', function (req, res) {
    res.render('vista-usuario/foro/index_2.jade',{
        idCategory: req.params.idCategory,
    });
  });
  app.get('/users/:idUser/categories/:idCategory', isLoggedIn, isVerified, isCorrectUser,function (req, res) {
    res.render('vista-usuario/foro/index_2.jade', {
        idCategory: req.params.idCategory,
      user: req.user,
    });
  });
  app.get('/categories/:idCategory/topic/:idTopic', function (req, res) {
    res.render('vista-usuario/foro/index_2.jade',{
        idCategory: req.params.idCategory,
      idTopic: req.params.idTopic,
    });
  });
  app.get('/users/:idUser/categories/:idCategory/topic/:idTopic', isLoggedIn, isVerified, isCorrectUser,function (req, res) {
    res.render('vista-usuario/foro/index_3.jade', {
        idCategory: req.params.idCategory,
      idTopic: req.params.idTopic,
      user: req.user,
    });
  });

  //Experiments
  app.get('/experiments', function (req, res) {
    res.render('vista-usuario/experiments/index.jade', {
      team: req.params.idteam
    });
  });
  app.get('/users/:idUser/experiments', isLoggedIn, isVerified, isCorrectUser, function (req, res) {
    res.render('vista-usuario/experiments/index.jade', {
        user: req.user,
    });
  });
  app.get('/experiment/:idExperiment', function (req, res) {
    res.render('vista-usuario/experiments/show-experiment.jade', {
      idExperiment: req.params.idExperiment,
    });
  });
  app.get('/users/:idUser/experiment/:idExperiment', isLoggedIn, isVerified, isCorrectUser, function (req, res) {
    res.render('vista-usuario/experiments/show-experiment.jade', {
        user: req.user,
      idExperiment: req.params.idExperiment,
    });
  });
  app.get('/users/:idUser/experiments/manage-experiment', isLoggedIn, isVerified, isCorrectUser, function (req, res) {
    res.render('vista-usuario/experiments/manage-experiment.jade', {
        user: req.user,
    });
  });
  app.get('/users/:idUser/experiments/manage-experiment/:idExperiment', isLoggedIn, isVerified, isCorrectUser, function (req, res) {
    res.render('vista-usuario/experiments/manage-experiment.jade', {
        user: req.user,
      idExperiment: req.params.idExperiment,
    });
  });

  //Modeling
  app.get('/modeling', function (req, res) {
    res.render('vista-usuario/modeling/index.jade', {
      team: req.params.idteam
    });
  });
  app.get('/users/:idUser/modeling', isLoggedIn, isVerified, isCorrectUser, function (req, res) {
    res.render('vista-usuario/modeling/index', {
        user: req.user,
    });
  });


  //About us
  app.get('/about-us', function (req, res) {
    res.render('vista-usuario/about-us/index.jade', {
      team: req.params.idteam
    });
  });
  app.get('/users/:idUser/about-us', isLoggedIn, isVerified, isCorrectUser, function (req, res) {
    res.render('vista-usuario/about-us/index.jade', {
        user: req.user,
    });
  });

  //Chatter plant
  app.get('/chatter-plant', function (req, res) {
    res.render('vista-usuario/chatter-plant/index.jade', {
      team: req.params.idteam
    });
  });
  app.get('/users/:idUser/chatter-plant', isLoggedIn, isVerified, isCorrectUser, function (req, res) {
    res.render('vista-usuario/chatter-plant/index.jade', {
        user: req.user,
    });
  });

  //Valencia UPV iGEM
  app.get('/valencia-upv-igem', function (req, res) {
    res.render('vista-usuario/valencia-upv-igem/index.jade', {
      team: req.params.idteam
    });
  });
  app.get('/users/:idUser/valencia-upv-igem', isLoggedIn, isVerified, isCorrectUser, function (req, res) {
    res.render('vista-usuario/valencia-upv-igem/index.jade', {
        user: req.user,
    });
  });

  //FAQ
  app.get('/faq', function (req, res) {
    res.render('vista-usuario/faq/index.jade', {
      team: req.params.idteam
    });
  });
  app.get('/users/:idUser/faq', isLoggedIn, isVerified, isCorrectUser, function (req, res) {
    res.render('vista-usuario/faq/index.jade', {
        user: req.user,
    });
  });

  //Dashboard
  app.get('/users/:idUser/', function (req, res) {
    res.render('vista-usuario/dashboard/index', {
        user: req.user,
    });
  });
  app.get('/users/:idUser/dashboard', isLoggedIn, isVerified, isCorrectUser, function (req, res) {
    res.render('vista-usuario/dashboard/index', {
        user: req.user,
    });
  });

  //Profile
  app.get('/users/:idUser/manage-profile', isLoggedIn, isVerified, isCorrectUser, function (req, res) {
    res.render('vista-usuario/profile/index', {
        user: req.user,
    });
  });
  app.get('/users/:idUser/profile/:name', isLoggedIn, isVerified, isCorrectUser, function (req, res) {
    res.render('vista-usuario/profile/public', {
        user: req.user,
      userview: req.params.name,
    });
  });

  //Activities
  app.get('/users/:idUser/activities', isLoggedIn, isVerified, isCorrectUser, function (req, res) {
    res.render('vista-usuario/activities/index', {
        user: req.user,
    });
  });

  // Terms and conditions
  app.get('/terms-and-conditions', function (req, res) {
    res.render('vista-usuario/terms-and-conditions/index.jade', {
      team: req.params.idteam
    });
  });
  app.get('/users/:idUser/terms-and-conditions', isLoggedIn, isVerified, isCorrectUser, function (req, res) {
    res.render('vista-usuario/terms-and-conditions/index.jade', {
        user: req.user,
    });
  });


// Manage users
app.get('/users/:idUser/manage-users', isLoggedIn, isVerified, isCorrectUser, function (req, res) {
  res.render('vista-usuario/manage-users/index.jade', {
    user: req.user,
  });
});


// Manage team
app.get('/users/:idUser/manage-team', isLoggedIn, isVerified, isCorrectUser, function (req, res) {
  res.render('vista-usuario/manage-team/index.jade', {
    user: req.user,
  });
});


  // RUTAS VIEJAS

  // app.get('/users/:idUser/teams', isLoggedIn, isVerified, isCorrectUser,function (req, res) {
  //   res.render('vista-usuario/teams/index', {
  //   // user: req.user,
  //   });
  // });
  //
  //
  // app.get('/users/:idUser/log', isLoggedIn, isVerified, isCorrectUser,function (req, res) {
  //   res.render('vista-usuario/log/index', {
  //   // user: req.user,
  //   });
  // });
  //
  // const co = require('co');
  // const handleError = require('../../../helpers/controller').handleError;
  // const teamsBll = require('../../../app/bll/teams');
  // app.get('/users/:idUser/teams/:idteam', isLoggedIn, isVerified, isCorrectUser,function (req, res) {
  //   co(function* () {
  //     let idteam = req.params.idteam;
  //     const team = yield teamsBll.getById(idteam);
  //     const validUsers = team.members;
  //     const user = _.filter(validUsers, { idUser: req.user._id });
  //     if (user.length == 0) {
  //       res.render('vista-usuario/teams/visitor_view', {
  //       // user: req.user,
  //       //       });
  //     }else if (user[0].isAdmin == true) {
  //       res.render('vista-usuario/teams/admin_view', {
  //       // user: req.user,
  //       //       });
  //     }else {
  //       res.render('vista-usuario/teams/researcher_view', {
  //       // user: req.user,
  //       //       });
  //     }
  //   }).catch(handleError(req, res));
  // });
  //
  //


};
