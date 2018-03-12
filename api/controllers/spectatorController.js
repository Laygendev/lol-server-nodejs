'use strict';


var https = require('https'),
	config = require('../../config.json');

exports.get = function(req, resp) {
	var url = "https://" + req.params.region + ".api.riotgames.com/lol/spectator/" + config.api.version + "/active-games/by-summoner/" + req.params.summonerId + "?api_key=" + config.api.key;
	https.get(url, (res) => {
		let data = '';

	   // A chunk of data has been recieved.
	   res.on('data', (chunk) => {
	     data += chunk;
	   });

	   // The whole response has been received. Print out the result.
	   res.on('end', () => {
	     resp.send(data)
	   });

	 }).on("error", (err) => {
	   console.log("Error: " + err.message);
	 });
};
