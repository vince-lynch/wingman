var mongoose = require('mongoose');

var locationlogSchema = mongoose.Schema({
  geocoords: {},
  username: String,
  timestamp: Date
});



module.exports = mongoose.model("locationlog", locationlogSchema);