'use strict';
module.exports = function(app) {
	var staticData = require('./../controllers/staticDataController');

	app.route('/static-data/champions/')
		.get(staticData.getChampions)

	app.route('/static-data/champions/:id')
		.get(staticData.getChampionById)

	app.route('/static-data/items/:lang')
		.get(staticData.getItems)

	app.route('/static-data/items/:lang/:id')
		.get(staticData.getItemById)

	app.route('/static-data/summoner')
		.get(staticData.getSummonerSpells)
};
