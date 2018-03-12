'use strict';
module.exports = function(app) {
	var spectatorController = require('./../controllers/spectatorController');
	app.route('/spectator/:region/:summonerId')
		.get(spectatorController.get)
};
