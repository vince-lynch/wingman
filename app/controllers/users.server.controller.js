var User = require('../models/user.server.model.js');

function usersIndex(req, res) {
  User.find(function(err, users) {
    if(err) return res.status(500).json({ message: err });
    return res.status(200).json(users);
  });
}

function usersShow(req, res) {
  User.findById(req.params.id, function(err, user) {
    if(err) return res.status(500).json({ message: err });
    return res.status(200).json({ user: user });
  });
}

function usersUpdate(req, res) {
  User.findByIdAndUpdate(req.params.id, req.body.user, { new: true }, function(err, user) {
    if(err) return res.status(500).json({ message: err });
    return res.status(200).json({ user: user });
  });
}

function usersDelete(req, res) {
  User.findByIdAndRemove(req.params.id, function(err) {
    if(err) return res.status(500).json({ message: err });
    return res.status(204).send();
  });
}

function getUserObj(username,callback) {
  User.find({username: username}).exec(function(err, userObj) {
    if(err) return console.log("error:", err );
    callback(userObj);
  });
}


function addProfilePicture(profilepicture, username) {

  console.log("addProfilePicture()", "profilepicture", profilepicture, "username", username)
  User.findOneAndUpdate({username: username}, {$set:{ image: profilepicture}},function(err, user){
      if(err){
          console.log("Something wrong when updating data!");
      }

      console.log(user);
  });
}

function updateLatLng(username, latLngObj) {

  console.log("updateLatLng()", "latLngObj", latLngObj, "username", username)
  User.findOneAndUpdate({username: username}, {$set:{ lastLatLng: latLngObj, lastUpdate: Date.now() }},function(err, user){
      if(err){
          console.log("Something wrong when updating data!");
      }

      console.log(user);
  });
}

function updateLastCity(username, lastCity) {
  console.log("updateLastCity()", "lastCity", lastCity, "username", username)
  User.findOneAndUpdate({username: username}, {$set:{lastCity: lastCity, lastUpdate: Date.now() }},function(err, user){
      if(err){
          console.log("Something wrong when updating updateLastCity() data!");
      }

      console.log(user);
  });
}

function updateCheckin(username, venueObj){
  console.log("reached updateCheckin function - with ", venueObj)
  User.findOneAndUpdate({username: username}, {$set:{venueCheckedIN: venueObj}},function(err, user){
    if(err){
        console.log("Something wrong when updating updateCheckin() data!");
    }
    console.log(user);
  });
}



function usersFindByCity(lastCity, callback) {
  User.find({lastCity: lastCity}).exec(function(err, users) {
    if(err) return console.log("error:", err );
    callback(users);
  });
}



module.exports = {
  index: usersIndex,
  show: usersShow,
  update: usersUpdate,
  delete: usersDelete,
  addProfilePicture: addProfilePicture,
  updateLatLng: updateLatLng,
  updateLastCity: updateLastCity,
  usersFindByCity: usersFindByCity,
  updateCheckin: updateCheckin,
  getUserObj: getUserObj
};