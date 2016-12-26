var Venue = require('../models/venue.model.js');


function addVenue(venueObj) {

 console.log("addVenue() called"); 

 var message = new MessageHistory(venueObj);
  message.save(function (err) {
    if (err) {
      return err;
    }
    else {
      console.log("venue saved");
    }
  });
}



module.exports = {
  addVenue: addVenue
};