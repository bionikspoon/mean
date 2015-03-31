'use strict';

var User     = require('mongoose').model('User');
var passport = require('passport');

var getErrorMessage = function (err) {
  var errName;
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'Username already exists';
        break;
      default :
        message = 'Something went wrong';
    }
  } else {
    for (errName in err.errors) {
      //noinspection JSUnfilteredForInLoop
      if (err.errors[errName].message) {
        //noinspection JSUnfilteredForInLoop
        message = err.errors[errName].message;
      }
    }
  }
  return message;
};

exports.renderSignin = function (req, res, next) {
  if (!req.user) {
    res.render('signin', {
      title:    'Sign-in Form',
      messages: req.flash('error') || req.flash('info')
    });
  } else {
    return res.redirect('/');
  }
};

exports.renderSignup = function (req, res, next) {
  if (!req.user) {
    res.render('signup', {
      title:    'Sign-up Form',
      messages: req.flash('error')
    });
  } else {
    return res.redirect('/');
  }
};

exports.signup = function (req, res, next) {
  var message;
  var user;

  if (!req.user) {
    user          = new User(req.body);
    message       = null;
    user.provider = 'local';
    user.save(function (err) {
      var message;
      if (err) {
        message = getErrorMessage(err);
        req.flash('error', message);
        return res.redirect('/signup');
      }
      req.login(user, function (err) {
        if (err) {return next(err);}


        return res.redirect('/');
      });
    });
  } else {
    return res.redirect('/');
  }
};

exports.saveOAuthUserProfile = function (req, profile, done) {
  User.findOne({
    provider:   profile.provider,
    providerId: profile.providerId
  }, function (err, user) {
    var possibleUsername;
    if (err) {
      return done(err);
    } else {
      if (!user) {
        possibleUsername = profile.username || ((profile.email)
          ? profile.email.split('@')[0] : '');

        User.findUniqueUsername(possibleUsername,
          null,
          function (availableUsername) {
            profile.username = availableUsername;

            user = new User(profile);

            user.save(function (err) {
              return done(err, user);
            });
          });
      } else {
        return done(err, user);
      }
    }
  });
};

exports.signout = function (req, res) {
  req.logout();

  res.redirect('/');
};

exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).send({
      message: 'User is not logged in'
    });
  }
  next();
};