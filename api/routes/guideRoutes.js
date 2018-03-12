'use strict';
module.exports = function(app) {
	var guideController = require('./../controllers/guideController');
	app.route('/guide')
		.post(guideController.post)
		.put(guideController.put)
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
