'use strict';
module.exports = function(app) {
	var realmsController = require('./../controllers/realmsController');
	app.route('/realms')
		.get(realmsController.get)
};
