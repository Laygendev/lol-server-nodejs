'use strict';


var https = require('https'),
	config = require('../../config.json'),
	mongoose = require('mongoose'),
	Champion = mongoose.model('Champion'),
	Item = mongoose.model('Item'),
	fs = require('fs');


exports.getChampions = function(req, resp) {
	fs.readFile('data/en_US_champion.json', 'utf8', (err, data) => {
		if (err) throw err;

		data = JSON.parse(data);

		resp.send({
			status: 200,
			data: data,
		});
	});
}

exports.getItems = function(req, resp) {
	var lang = req.params.lang;
	var full_lang = lang + "_" + lang;

	fs.readFile('data/items/' + full_lang + '_items.json', 'utf8', (err, data) => {
		if (err) throw err;

		data = JSON.parse(data);
		var finalData = new Array();

		for ( var key in data ) {
			if ( data[key].inStore ) {
				finalData.push(data[key]);
			}
		}

		resp.send({
			status: 200,
			data: finalData,
		});
	});
}

exports.getSummonerSpells = function(req, resp) {
	fs.readFile('data/en_US_summoner.json', 'utf8', (err, data) => {
		if (err) throw err;

		data = JSON.parse(data);

		resp.send({
			status: 200,
			data: data,
		});
	});
}


exports.getChampionById = function(req, resp) {
	//req.params.id
  Item.findOne({'id': req.params.id}, function(err, item) {
		if (err) {
			resp.send(err);
		}

		resp.send(item);
	});
};

exports.getItemById = function(req, resp) {
	//req.params.id
  Item.findOne({'id': req.params.id}, function(err, item) {
		if (err) {
			resp.send(err);
		}

		resp.send(item);
	});
};
