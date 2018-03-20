<<<<<<< HEAD
'use strict';

var mongoose = require('mongoose'),
	fs = require('fs'),
	https = require('https'),
	config = require('../../config.json'),
	User = mongoose.model('User'),
	Guide = mongoose.model('Guide'),
	mailController = require('../../components/mail/mailController');

exports.post = function(req, resp) {
	if ( req.body._id ) {
		Guide.findOne({'_id': req.body._id}, function(err, guide) {
			if ( guide ) {

				guide.dateModified = Date.now;
				guide.starterItemsSlotId = req.body.starterItemsSlotId;
				guide.buildItemsSlotId = req.body.buildItemsSlotId;

				if (guide.state == 'publish' ) {
					guide.state = "updated";
				}
			}

			guide.save(function(err, updatedGuide) {
				if (err) {
					resp.send(err);
				}

				resp.send(updatedGuide);
			});
		});
	} else {

		fs.readFile('data/realms.json', 'utf8', (err, realms) => {
			if (err) throw err;

			realms = JSON.parse(realms);

			var itemData = {
				state: 'draft',
				championId: req.body.championId,
				starterItemsSlotId: req.body.starterItemsSlotId,
				buildItemsSlotId: req.body.buildItemsSlotId,
				gameMode: req.body.gameMode,
				favorite: false,
				version: realms.v,
				author: req.body.author
			};

			var newGuide = new Guide(itemData);

			newGuide.save(function(err, guide) {
				if (err) {
					resp.send(err);
				}

				User.findOne({'_id': guide.author}, function(err, user) {
					if (err) {
						resp.send(err);
					}

					mailController.send( 'created-guide', 'LoL Hypes Guides', user.mail, {
						username: user.pseudo
					} );

					resp.send(guide);
				});
			});
		});
	}
};


exports.put = function(req, resp) {
	Guide.findOne({'_id': req.body._id}, function(err, guide) {
		if ( guide ) {
			guide.dateModified = Date.now;

			if ( 'toPublish' == req.body.action &&  (guide.state == 'draft' || guide.state == 'updated' ) && req.body.state == 'publish' ) {
				// Check have current guid for this mode and champion in favorite.
				Guide.findOne({'gameMode': guide.gameMode, championId: guide.championId, favorite: true}, function(err, favoriteGuide) {
					if ( null == favoriteGuide ) {
						guide.favorite = true;
					}

					guide.state = req.body.state;
					guide.save(function(err, updatedGuide) {
						if (err) {
							resp.send(err);
						}
						resp.send(updatedGuide);
					});
				});
			}

			if ( 'updateGuide' == req.body.action ) {
				guide.starterItemsSlotId = req.body.starterItemsSlotId;
				guide.buildItemsSlotId = req.body.buildItemsSlotId;

				fs.readFile('data/realms.json', 'utf8', (err, realms) => {
					if (err) throw err;

					realms = JSON.parse(realms);

					guide.version =  realms.v;
					guide.state = "updated";

					guide.save(function(err, updatedGuide) {
						if (err) {
							resp.send(err);
						}
						resp.send(updatedGuide);
					});
				});
			}

			if ( ! req.body.action ) {
				resp.send();
			}
		}
	});
};

exports.get = function(req, resp) {
	req.params.number = req.params.number ? req.params.number : 5;

	if ( req.params.id ) {
		Guide.findOne({'_id': req.params.id}).populate('author').exec( function(err, guide) {
			if (err) {
				resp.send(err);
			}

			resp.send(guide);
		});
	} else {
		if ( req.params.favorite && req.params.gameMode && req.params.championId ) {
			Guide.findOne({'state': 'publish', 'gameMode': req.params.gameMode, 'championId': req.params.championId, 'favorite': true}).
			populate('author').
			exec( function(err, guide) {
				if (err) {
					resp.send(err);
				}

				resp.send(guide);
			});
		} else {
			if (5 === req.params.number) {
				Guide.find({'state': 'publish', 'gameMode': req.params.gameMode, 'championId': req.params.championId}).
				populate('author').
				exec( function(err, guides) {
					if (err) {
						resp.send(err);
					}

					resp.send(guides);
				});
			} else {
				Guide.findOne({'state': 'publish', 'gameMode': req.params.gameMode, 'championId': req.params.championId}).
				populate('author').
				exec( function(err, guide) {
					if (err) {
						resp.send(err);
					}
					resp.send(guide);

				});
			}
		}
	}
};

exports.getFavorite = function(req, resp) {
	Guide.findOne({'state': 'publish', 'version': req.params.version, 'gameMode': req.params.gameMode, 'championId': req.params.championId, favorite: true}).
	populate('author').
	exec( function(err, guide) {
		if (err) {
			resp.send(err);
		}

		resp.send(guide);
	});
};

exports.getByAuthor = function(req, resp) {
	Guide.find({'author': req.params.authorId}).
	populate('author').
	exec( function(err, guides) {
		if (err) {
			resp.send(err);
		}

		resp.send(guides);
	});
};

exports.getByGameModeChampionIdAndState = function(req, resp) {
	Guide.find({'gameMode': req.params.gameMode, 'championId': req.params.championId, 'state': req.params.state}).
	populate('author').
	exec( function(err, guides) {
		if (err) {
			resp.send(err);
		}

		resp.send(guides);
	});
};

exports.getAll = function(req, resp) {
	Guide.find().
	populate('author').
	exec( function(err, guides) {
		if (err) {
			resp.send(err);
		}

		resp.send(guides);
	});
};

exports.voteUp = function(req, resp) {
	var userId = req.body.userId;
	var guideId = req.body._id;

	if ( ! userId || ! guideId ) {
		resp.send(null);
	}

	User.findOne({'_id': userId}, function(err, user) {
		user.votes.push(guideId);

		user.save(function(err, updatedUser) {


			Guide.findOne({'_id': guideId}, function(err, guide) {
				if ( guide ) {
					guide.vote++;

					Guide.findOne({'gameMode': guide.gameMode, 'championId': guide.championId, 'favorite': true}).exec(function( err, favoriteGuide) {
						if ( guide.vote > favoriteGuide.vote ) {
							favoriteGuide.favorite = false;
							guide.favorite = true;
						}

						guide.save(function(err, updatedGuide) {
							if (err) {
								resp.send(err);
							}

							favoriteGuide.save(function(err, updatedFavoriteGuide) {
								resp.send({
									favoriteGuide: updatedGuide,
									noFavoriteGuide: updatedFavoriteGuide,
									user: updatedUser,
								});

							});
						});
					});

				}
			});
		});

	});

};
=======
'use strict';

var mongoose = require('mongoose'),
	fs = require('fs'),
	https = require('https'),
	config = require('../../config.json'),
	User = mongoose.model('User'),
	Guide = mongoose.model('Guide'),
	mailController = require('../../components/mail/mailController');

exports.post = function(req, resp) {
	if ( req.body._id ) {
		Guide.findOne({'_id': req.body._id}, function(err, guide) {
			if ( guide ) {

				guide.dateModified = Date.now;
				guide.starterItemsSlotId = req.body.starterItemsSlotId;
				guide.buildItemsSlotId = req.body.buildItemsSlotId;

				if (guide.state == 'publish' ) {
					guide.state = "updated";
				}
			}

			guide.save(function(err, updatedGuide) {
				if (err) {
					resp.send(err);
				}

				resp.send(updatedGuide);
			});
		});
	} else {

		fs.readFile('data/realms.json', 'utf8', (err, realms) => {
			if (err) throw err;

			realms = JSON.parse(realms);

			var itemData = {
				state: 'draft',
				championId: req.body.championId,
				starterItemsSlotId: req.body.starterItemsSlotId,
				buildItemsSlotId: req.body.buildItemsSlotId,
				gameMode: req.body.gameMode,
				favorite: false,
				version: realms.v,
				author: req.body.author
			};

			var newGuide = new Guide(itemData);

			newGuide.save(function(err, guide) {
				if (err) {
					resp.send(err);
				}

				User.findOne({'_id': guide.author}, function(err, user) {
					if (err) {
						resp.send(err);
					}

					mailController.send( 'created-guide', 'LoL Hypes Guides', user.mail, {
						username: user.pseudo
					} );

					resp.send(guide);
				});
			});
		});
	}
};


exports.put = function(req, resp) {
	Guide.findOne({'_id': req.body._id}, function(err, guide) {
		if ( guide ) {
			guide.dateModified = Date.now;

			if ( 'toPublish' == req.body.action &&  (guide.state == 'draft' || guide.state == 'updated' ) && req.body.state == 'publish' ) {
				// Check have current guid for this mode and champion in favorite.
				Guide.findOne({'gameMode': guide.gameMode, championId: guide.championId, favorite: true}, function(err, favoriteGuide) {
					if ( null == favoriteGuide ) {
						guide.favorite = true;
					}

					guide.state = req.body.state;
					guide.save(function(err, updatedGuide) {
						if (err) {
							resp.send(err);
						}
						resp.send(updatedGuide);
					});
				});
			}

			if ( 'updateGuide' == req.body.action ) {
				guide.starterItemsSlotId = req.body.starterItemsSlotId;
				guide.buildItemsSlotId = req.body.buildItemsSlotId;

				fs.readFile('data/realms.json', 'utf8', (err, realms) => {
					if (err) throw err;

					realms = JSON.parse(realms);

					guide.version =  realms.v;
					guide.state = "updated";

					guide.save(function(err, updatedGuide) {
						if (err) {
							resp.send(err);
						}
						resp.send(updatedGuide);
					});
				});
			}

			if ( ! req.body.action ) {
				resp.send();
			}
		}
	});
};

exports.get = function(req, resp) {
	req.params.number = req.params.number ? req.params.number : 5;

	if ( req.params.id ) {
		Guide.findOne({'_id': req.params.id}).populate('author').exec( function(err, guide) {
			if (err) {
				resp.send(err);
			}

			resp.send(guide);
		});
	} else {
		if ( req.params.favorite && req.params.gameMode && req.params.championId ) {
			Guide.findOne({'state': 'publish', 'gameMode': req.params.gameMode, 'championId': req.params.championId, 'favorite': true}).
			populate('author').
			exec( function(err, guide) {
				if (err) {
					resp.send(err);
				}

				resp.send(guide);
			});
		} else {
			if (5 === req.params.number) {
				Guide.find({'state': 'publish', 'gameMode': req.params.gameMode, 'championId': req.params.championId}).
				populate('author').
				exec( function(err, guides) {
					if (err) {
						resp.send(err);
					}

					resp.send(guides);
				});
			} else {
				Guide.findOne({'state': 'publish', 'gameMode': req.params.gameMode, 'championId': req.params.championId}).
				populate('author').
				exec( function(err, guide) {
					if (err) {
						resp.send(err);
					}
					resp.send(guide);

				});
			}
		}
	}
};

exports.getFavorite = function(req, resp) {
	Guide.findOne({'state': 'publish', 'version': req.params.version, 'gameMode': req.params.gameMode, 'championId': req.params.championId, favorite: true}).
	populate('author').
	exec( function(err, guide) {
		if (err) {
			resp.send(err);
		}

		resp.send(guide);
	});
};

exports.getByAuthor = function(req, resp) {
	Guide.find({'author': req.params.authorId}).
	populate('author').
	exec( function(err, guides) {
		if (err) {
			resp.send(err);
		}

		resp.send(guides);
	});
};

exports.getByGameModeChampionIdAndState = function(req, resp) {
	Guide.find({'gameMode': req.params.gameMode, 'championId': req.params.championId, 'state': req.params.state}).
	populate('author').
	exec( function(err, guides) {
		if (err) {
			resp.send(err);
		}

		resp.send(guides);
	});
};

exports.getAll = function(req, resp) {
	Guide.find().
	populate('author').
	exec( function(err, guides) {
		if (err) {
			resp.send(err);
		}

		resp.send(guides);
	});
};

exports.voteUp = function(req, resp) {
	var userId = req.body.userId;
	var guideId = req.body._id;

	if ( ! userId || ! guideId ) {
		resp.send(null);
	}

	User.findOne({'_id': userId}, function(err, user) {
		user.votes.push(guideId);

		user.save(function(err, updatedUser) {


			Guide.findOne({'_id': guideId}, function(err, guide) {
				if ( guide ) {
					guide.vote++;

					Guide.findOne({'gameMode': guide.gameMode, 'championId': guide.championId, 'favorite': true}).exec(function( err, favoriteGuide) {
						if ( guide.vote > favoriteGuide.vote ) {
							favoriteGuide.favorite = false;
							guide.favorite = true;
						}

						guide.save(function(err, updatedGuide) {
							if (err) {
								resp.send(err);
							}

							favoriteGuide.save(function(err, updatedFavoriteGuide) {
								resp.send({
									favoriteGuide: updatedGuide,
									noFavoriteGuide: updatedFavoriteGuide,
									user: updatedUser,
								});

							});
						});
					});

				}
			});
		});

	});

};
>>>>>>> 4fbdecd8a40918a7eaf96a0f78ac549c4691c01a
