
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemModel = new Schema({
	modeNameInclusions: Object,
	iconPath: String,
	inStore: Boolean,
	description: String,
	id: Number,
	name: String
});

module.exports = mongoose.model('Item', itemModel);
