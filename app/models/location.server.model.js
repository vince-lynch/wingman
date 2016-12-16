var mongoose = require('mongoose');

var locationlogSchema = mongoose.Schema({
  geocoords : {},
  username  : String,
  timestamp : Date,
  inCity    : String
});



module.exports = mongoose.model("locationlog", locationlogSchema);