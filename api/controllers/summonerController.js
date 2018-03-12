'use strict';


var mongoose = require('mongoose'),
	https = require('https'),
	config = require('../../config.json');

exports.get = function(req, resp) {
	var patt = /^[A-Za-z0-9\\p{L} _\\.]+$/;
	if ( ! patt.test(req.params.name) ) {
		resp.send({
			status: 404,
			message: 'summoner name is not valid',
		});
	}
	else {
		var url = "https://" + req.params.region + ".api.riotgames.com/lol/summoner/" + config.api.version + "/summoners/by-name/" + req.params.name + "?api_key=" + config.api.key;
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
	 }
};
