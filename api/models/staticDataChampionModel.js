'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var championModel = new Schema({
	image: {
		full: {
			type: String
		},
		group: {
			type: String
		},
		sprite: {
			type: String
		},
		h: {
			type: Number
		},
		w: {
			type: Number
		},
		y: {
			type: Number
		},
		x: {
			type: Number
		}
	},
	title: {
		type: String
	},
	id: {
		type: Number
	},
	key: {
		type: String
	},
	name: {
		type: String
	}
});

module.exports = mongoose.model('Champion', championModel);
