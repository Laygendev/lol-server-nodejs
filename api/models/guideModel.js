'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var guideModel = Schema({
	championId: Number,
	author: { type: Schema.Types.ObjectId, ref: 'User' },
	state: String,
	starterItemsSlotId: Array,
	buildItemsSlotId: Array,
	gameMode: String,
	favorite: Boolean,
	version: String,
	createdDate: {
		type: Date, default: Date.now
	},
	modifiedData: {
		type: Date, default: Date.now
	},
	vote: {
		type:Number,
		default: 0
	}
});

module.exports = mongoose.model('Guide', guideModel);
