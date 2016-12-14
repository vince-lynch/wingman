var mongoose = require('mongoose');

var websiteSchema = mongoose.Schema({
  websiteUrl: String,
  user: String,
  serverinfo: {}
});



module.exports = mongoose.model("Website", websiteSchema);