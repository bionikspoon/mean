'use strict';

// Load the module dependencies
var passport = require('passport');
var url = require('url');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../config');
var users = require('../../app/controllers/users.server.controller');

// Create the Facebook strategy configuration method
module.exports = function () {
  // Use the Passport's Facebook strategy
  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    passReqToCallback: true
  }, function (req, accessToken, refreshToken, profile, done) {
    // Set the user's provider data and include tokens
    var providerUserProfile;
    var providerData = profile._json;
    providerData.accessToken = accessToken;
    providerData.refreshToken = refreshToken;

    // Create the user OAuth profile
    providerUserProfile = {
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      fullName: profile.displayName,
      email: profile.emails[0].value,
      username: profile.username,
      provider: 'facebook',
      providerId: profile.id,
      providerData: providerData
    };

    // Save the user OAuth profile
    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }));
};