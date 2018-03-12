'use strict';
module.exports = function(app) {
	var updateController = require('./../controllers/updateController');
	app.route('/update')
		.get(updateController.get)
};
