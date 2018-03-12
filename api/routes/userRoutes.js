'use strict';
module.exports = function(app) {
	var userController = require('./../controllers/userController');
	app.route('/user')
		.post(userController.post)
	app.route('/user/auth')
		.post(userController.auth)
	app.route('/user/:id')
		.get(userController.get)
};
