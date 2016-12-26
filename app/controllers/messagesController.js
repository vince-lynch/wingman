var MessageHistory = require('../models/messageHistory.model.js');

function insertMessage(username, timestamp,  message, city) {
 var message = new MessageHistory({username: username, timestamp: timestamp, 
                          message: message, city: city});
  message.save(function (err) {
    if (err) {
      return err;
    }
    else {
      console.log("message saved");
    }
  });
}



function messageHistoryforCity(req,res) {
  var city = req.body.city;

  MessageHistory.find({city: city}).limit(100).exec(function(err, messages) {
    if(err) return console.log("error:", err );
    console.log("messages for city -"+city+"- ", messages)
    res.json(messages);
  });
}



module.exports = {
  insertMessage: insertMessage,
  messageHistoryforCity: messageHistoryforCity
};