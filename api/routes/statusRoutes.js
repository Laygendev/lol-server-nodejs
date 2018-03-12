'use strict';
module.exports = function(app) {
	var statusController = require('./../controllers/statusController');
	app.route('/get')
		.get(statusController.get)
};
