var mongoose = require('mongoose');

var messageHistorySchema = mongoose.Schema({
  username  : String,
  timestamp : Date,
  message   : String,
  city      : String,
  avatar    : String
});



module.exports = mongoose.model("messageHistory", messageHistorySchema);