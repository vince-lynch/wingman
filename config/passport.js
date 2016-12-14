var passport = require('passport'),
	mongoose = require('mongoose');

module.exports = function() {
	passport.serializeUser(function(user, done){
		var details = {
			id 			: user.id,
			name		: user.name,
			email		: user.email,
			user_type 	: user.user_type
		};

		if (user.show) {
			details.show_id = user.show;
		}

		done(null, details);
	});

	passport.deserializeUser(function(user, done){
		var User = mongoose.model('User');

		User.findOne({
			_id : user.id
		}, '-password -salt', function(err, user) {
			done(err, user);
		});
	});

	require('./strategies/local.js')();
};