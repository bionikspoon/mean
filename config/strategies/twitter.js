'use strict';

// Load the module dependencies
var passport = require('passport');
var url = require('url');
var TwitterStrategy = require('passport-twitter').Strategy;
var config = require('../config');
var users = require('../../app/controllers/users.server.controller');

// Create the Twitter strategy configuration method
module.exports = function () {
  // Use the Passport's Twitter strategy
  passport.use(new TwitterStrategy({
    consumerKey: config.twitter.clientID,
    consumerSecret: config.twitter.clientSecret,
    callbackURL: config.twitter.callbackURL,
    passReqToCallback: true
  }, function (req, token, tokenSecret, profile, done) {
    // Set the user's provider data and include tokens
    var providerUserProfile;
    var providerData = profile._json;
    providerData.token = token;
    providerData.tokenSecret = tokenSecret;

    // Create the user OAuth profile
    providerUserProfile = {
      fullName: profile.displayName,
      username: profile.username,
      provider: 'twitter',
      providerId: profile.id,
      providerData: providerData
    };

    // Save the user OAuth profile
    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }));
};