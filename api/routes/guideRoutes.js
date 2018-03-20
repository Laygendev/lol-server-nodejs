'use strict';
var guideController = require('./../controllers/guideController');

module.exports = function(app) {
	app.route('/guide')
		.put(guideController.put)
		.post(guideController.post)
	app.route('/guide/author/:authorId')
	.get(guideController.getByAuthor)
	app.route('/guide/:gameMode/:championId')
		.get(guideController.get)
	app.route('/guide/:gameMode/:championId/:state')
		.get(guideController.getByGameModeChampionIdAndState)
	app.route('/guide-favorite/:version/:gameMode/:championId/')
		.get(guideController.getFavorite)
	app.route('/guide/:id')
		.get(guideController.get)
	app.route('/guides')
		.get(guideController.getAll);
	app.route('/vote')
		.post(guideController.voteUp);
};
