var mongoose = require('mongoose');

var venueSchema = mongoose.Schema({
	geometry: {},
	icon: String,
	id: String,
	name: String,
	photos: {},
	place_id: { type: String, unique: true },
	rating: Number,
	reference: String,
	scope: String,
	types: [],
	vicinity: String,
	distance: String,
	checkedIn: Boolean,
	city: String,
	checkedInUsers: []
});



module.exports = mongoose.model("venue", venueSchema);