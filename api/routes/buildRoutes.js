'use strict';
module.exports = function(app) {
	var buildController = require('./../controllers/buildController');
	app.route('/build')
		.post(buildController.post)
	app.route('/build/:gameMode/:championId')
		.get(buildController.get)
	app.route('/build/:gameMode/:championId/:favorite')
		.get(buildController.get)
	app.route('/build/:id')
		.get(buildController.get)
};
