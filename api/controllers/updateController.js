'use strict';


var https = require('https'),
	config = require('../../config.json'),
	fs = require('fs');


exports.version;

exports.updatedMessage = new Array();

exports.get = function(req, resp) {
	exports.updateRealms(req, resp, () => {
		exports.updateItems(req, resp, () => {
			exports.updateItemslang('fr_fr', req, resp, () => {
				exports.updateSummonerSpell(req, resp, () => {
					exports.updateChampion(req, resp, () => {
						resp.send(exports.updatedMessage);
					});
				});

			});

		});
	});

}

exports.updateRealms = function(req, resp, cb) {
	var url = "https://ddragon.leagueoflegends.com/realms/euw.json";

	https.get(url, (res) => {
		let data = '';

		res.on('data', (chunk) => {
			data += chunk;
		});

		res.on('end', () => {
			fs.writeFileSync('data/realms.json', data, 'utf8');

			data = JSON.parse(data)
			exports.version = data.v;

			exports.updatedMessage.push( 'Updated: EUW realms' );
			exports.updatedMessage.push( 'Next update for version ' + exports.version );
			cb();
		});
	}).on("error", (err) => {
		console.log("Error: " + err.message);
	});
}

exports.updateItems = function(req, resp, cb) {
	var url = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/items.json";

	https.get(url, (res) => {
		let response = '';

		res.on('data', (chunk) => {
			response += chunk;
		});

		res.on('end', () => {
			response = JSON.parse(response);

			var jsonData = new Array();
			for (var key in response) {
				var newJSON = response[key];
				newJSON.id = parseInt(key);
				newJSON.iconPath = newJSON.iconPath.replace( '/lol-game-data/assets/DATA', 'data' );
				newJSON.iconPath = newJSON.iconPath.toLowerCase();
				jsonData.push(newJSON);
			}

			jsonData = JSON.stringify(jsonData);
			fs.writeFileSync('data/items/en_en_items.json', jsonData, 'utf8');

			exports.updatedMessage.push( 'Updated: en_en items' );
			cb();
		});
	}).on("error", (err) => {
		console.log("Error: " + err.message);
	});
}

exports.updateItemslang = function(lang, req, resp, cb) {
	var url = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/" + lang + "/v1/items.json";

	https.get(url, (res) => {
		let response = '';

		res.on('data', (chunk) => {
			response += chunk;
		});

		res.on('end', () => {
			response = JSON.parse(response);

			var jsonData = new Array();
			for (var key in response) {
				var newJSON = response[key];
				newJSON.id = parseInt(key);
				newJSON.iconPath = newJSON.iconPath.replace( '/lol-game-data/assets/DATA', 'data' );
				newJSON.iconPath = newJSON.iconPath.toLowerCase();
				jsonData.push(newJSON);
			}

			jsonData = JSON.stringify(jsonData);
			fs.writeFileSync('data/items/' + lang + '_items.json', jsonData, 'utf8');

			exports.updatedMessage.push( 'Updated: ' + lang + ' items' );
			cb();
		});
	}).on("error", (err) => {
		console.log("Error: " + err.message);
	});
}

exports.updateSummonerSpell = function(req, resp, cb) {
	var url = "https://ddragon.leagueoflegends.com/cdn/" + exports.version + "/data/en_US/summoner.json";

	https.get(url, (res) => {
		let response = '';

		res.on('data', (chunk) => {
			response += chunk;
		});

		res.on('end', () => {
			response = JSON.parse(response);

			var jsonData = new Array();
			for (var key in response.data) {
				var newJSON = response.data[key];
				newJSON.id = parseInt(response.data[key].key);
				jsonData.push(newJSON);
			}

			jsonData = JSON.stringify(jsonData);
			fs.writeFileSync('data/en_US_summoner.json', jsonData, 'utf8');

			exports.updatedMessage.push( 'Updated: en_US summoner' );
			cb();
		});
	}).on("error", (err) => {
		console.log("Error: " + err.message);
	});
}

exports.updateChampion = function(req, resp, cb) {
	var url = "https://ddragon.leagueoflegends.com/cdn/" + exports.version + "/data/en_US/champion.json";

	https.get(url, (res) => {
		let response = '';

		res.on('data', (chunk) => {
			response += chunk;
		});

		res.on('end', () => {
			response = JSON.parse(response);

			var jsonData = new Array();
			for (var key in response.data) {
				var newJSON = response.data[key];
				newJSON.id = parseInt(response.data[key].key);
				jsonData.push(newJSON);
			}

			jsonData = JSON.stringify(jsonData);
			fs.writeFileSync('data/en_US_champion.json', jsonData, 'utf8');

			exports.updatedMessage.push( 'Updated: en_US champion' );
			cb();
		});
	}).on("error", (err) => {
		console.log("Error: " + err.message);
	});
}
