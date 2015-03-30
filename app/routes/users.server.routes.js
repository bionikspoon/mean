'use strict';

var users = require('../../app/controllers/users.server.controller');
var passport = require('passport');

module.exports = function (app) {
  // @formatter:off
  app.route('/users')
    .post(users.create)
    .get(users.list);
  app.route('/users/:userId')
    .get(users.read)
    .put(users.update)
    .delete(users.delete);
  app.route('/signup')
    .get(users.renderSignup)
    .post(users.signup);
  app.route('/signin')
    .get(users.renderSignin)
    .post(passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/signin',
      failureFlash: true
    }));

  app.param('userId', users.userByID);
  // @formatter:on
};