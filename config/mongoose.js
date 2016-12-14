var config 		= require('./config'),
	mongoose 	= require('mongoose');

module.exports = function() {
	var options = {
  		replset: { rs_name: 'myReplicaSetName' }
	}
	
	var db = mongoose.connect(config.db, options);

	require('../app/models/user.server.model');

	return db;
}