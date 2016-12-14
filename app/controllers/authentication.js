var User = require('../models/user.server.model');
var jwt  = require('jsonwebtoken');
var secret = require('../../config/tokens').secret;
var request = require('request-promise');
//var config = require('../config/app');
var oauth = require('../../config/oauth');


function register(req, res) {
  console.log("reached register function")
  console.log("register req.body: ", req.body);

    req.body.passwordConfirmation = req.body.password;
    console.log(req.body)

  User.create(req.body, function(err, user) {
    // tidy up mongoose's awful error messages
    if(err) {
      console.log(err)
      if(err.code && (err.code === 11000 || err.code === 11001)) {
        var attribute = err.message.match(/\$([a-z]+)_/)[1];
        err = "An account with that " + attribute + " already exists";
      }
      return res.status(400).json({ message: err.toString() });
    }

    var token = jwt.sign(user, secret, "24h");
    return res.status(200).json({ message: "Thanks for registering", user: user, token: token });
  });
}

function login(req, res) {

  console.log("login req.body: ", req.body);

  User.findOne({ email: req.body.email }, function(err, user) {
    if(err) return res.send(500).json({ message: err });
    if(!user || !user.validatePassword(req.body.password)) return res.status(401).json({ message: "Unauthorized" });

    var token = jwt.sign(user, secret, "24h");
    return res.status(200).json({ message: "Login successful", user: user, token: token });
  });
}

function facebook(req, res) {
  console.log("Reached facebook function")
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: process.env.FACEBOOK_API_SECRET,
    redirect_uri: "http://localhost/"
  };
  console.log(params);

  // step 1, we make a request to facebook for an access token
  request
    .get({
      url: oauth.facebook.accessTokenUrl,
      qs: params,
      json: true
    })
    .then(function(accessToken) {
      console.log("this is the accesstoken: " + accessToken);
      // step 2, we use the access token to get the user's profile data from facebook's api
      return request.get({
        url: oauth.facebook.profileUrl,
        qs: accessToken,
        json: true
      });
    })
    .then(function(profile) {
      console.log(profile);
      // step 3, we try to find a user in our database by their email
      return User.findOne({ email: profile.email })
        .then(function(user) {
          console.log("found the user!" )
          // if we find the user, we set their facebookId and picture to their profile data
          if(user) {
            console.log("user already exists-still continuing")
            user.facebookId = profile.id;
            user.picture = user.picture || profile.picture.data.url;
          }
          else {
            // otherwise, we create a new user record with the user's profile data from facebook
            user = new User({
              facebookId: profile.id,
              name: profile.name,
              picture: profile.picture.data.url,
              email: profile.email
            });
          }
          // either way, we save the user record
          return user.save();
        });
    })
    .then(function(user) {
      // step 4, we create a JWT and send it back to our angular app
      var payload = { _id: user._id, name: user.name, picture: user.picture };
      var token = jwt.sign(payload, config.secret, { expiresIn: '24h' });
      return res.send({ token: token, user: payload });
    })
    .catch(function(err) {
      // we handle any errors here
      return res.status(500).json({ error: err });
    });
}

module.exports = {
  login: login,
  register: register,
  facebook: facebook
};