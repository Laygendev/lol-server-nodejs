'use strict';


var mongoose = require('mongoose'),
	https = require('https'),
	config = require('../../config.json'),
	Build = mongoose.model('Build');

exports.post = function(req, resp) {
	var itemData = {
		author: 'Jimmy',
		state: 'draft',
		championId: req.body.championId,
		starterItemsSlotId: req.body.starterItemsSlotId,
		buildItemsSlotId: req.body.buildItemsSlotId,
		gameMode: req.body.gameMode,
		favorite: true
	};

	Build.findOne({'gameMode': req.body.gameMode, 'championId': req.body.championId}, function(err, build) {
		if ( ! build ) {
			var newBuild = new Build(itemData);

			newBuild.save(function(err, build) {
				if (err) {
					resp.send(err);
				}
				resp.send(build);

			});
		} else {
			build.starterItemsSlotId = req.body.starterItemsSlotId;
			build.buildItemsSlotId   = req.body.buildItemsSlotId;

			build.save(function(err, updatedBuild) {
				if (err) {
					resp.send(err);
				}
				resp.send(updatedBuild);

			});
		}
	});
};

exports.get = function(req, resp) {
	req.params.number = req.params.number ? req.params.number : 5;

	if ( req.params.id ) {
		Build.findOne({'_id': req.params.id}, function(err, builds) {
			if (err) {
				resp.send(err);
			}

			resp.send(builds);
		});
	} else {
		if ( req.params.favorite && req.params.gameMode && req.params.championId ) {
			Build.findOne({'gameMode': req.params.gameMode, 'championId': req.params.championId, 'favorite': true}, function(err, build) {
				if (err) {
					resp.send(err);
				}

				resp.send(build);
			});
		} else {


			if (5 === req.params.number) {
				Build.find({'gameMode': req.params.gameMode, 'championId': req.params.championId}, function(err, builds) {
					if (err) {
						resp.send(err);
					}

					resp.send(builds);
				});
			} else {
				Build.findOne({'gameMode': req.params.gameMode, 'championId': req.params.championId}, function(err, build) {
					if (err) {
						resp.send(err);
					}
					resp.send(build);

				});
			}
		}
	}

};
