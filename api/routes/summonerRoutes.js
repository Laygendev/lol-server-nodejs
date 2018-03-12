'use strict';
module.exports = function(app) {
	var summonerList = require('./../controllers/summonerController');

	app.route('/summoner/:region/:name')
		.get(summonerList.get)
};
