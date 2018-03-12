'use strict';
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var userModel = Schema({
	_id: Schema.Types.ObjectId,
	mail: {
		type: String,
		lowercase: true,
		required: [true, "can't be blank"],
		match: [/\S+@\S+\.\S+/, 'is invalid'],
		index: true,
		unique: true
	},
	password:  {
		type: String,
		required: [true, "can't be blank"],
		minlength: 5
	},
	pseudo: {
		type: String,
		required: [true, "can't be blank"],
		index: true,
		unique: true,
		minlength: 5
	},
	roles: [String],
	votes: [String],
	state: {
		type: String,
		default: 0
	}
});

userModel.plugin(uniqueValidator, {message: 'is already taken.'});

userModel.pre('save', function (next) {
  var user = this;

	if ( user._id ) {
		next();
	} else {
		user._id = new mongoose.Types.ObjectId();
	  bcrypt.hash(user.password, 10, function (err, hash){
	    if (err) {
	      return next(err);
	    }
	    user.password = hash;
	    next();
	  })
	}
});

userModel.statics.authenticate = function (email, password, callback) {
  User.findOne({ mail: email })
  .exec(function (err, user) {
    if (err) {
      return callback(err)
    } else if (!user) {
      var err = new Error('User not found.');
      err.status = 401;
      return callback(err);
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (result === true) {
        return callback(null, user);
      } else {
        return callback();
      }
    })
  });
}


var User = mongoose.model('User', userModel);
module.exports = User;
