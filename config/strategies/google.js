'use strict';

// Load the module dependencies
var passport = require('passport');
var url = require('url');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('../config');
var users = require('../../app/controllers/users.server.controller');

// Create the Google strategy configuration method
module.exports = function () {
  // Use the Passport's Google strategy
  passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL,
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
      provider: 'google',
      providerId: profile.id,
      providerData: providerData
    };

    // Save the user OAuth profile
    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }));
};