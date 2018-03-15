'use strict';

var mongoose = require('mongoose'),
	https = require('https'),
	config = require('../../config.json'),
	User = mongoose.model('User'),
	mailController = require('../../components/mail/mailController');

exports.post = function(req, resp) {
	if (req.body.mail &&
		req.body.pseudo &&
		req.body.password) {

		var userData = {
			mail: req.body.mail,
			pseudo: req.body.pseudo,
			password: req.body.password,
			new: true,
		};

		//use schema.create to insert data into the db
		User.create(userData, function (err, user) {
			if (err) {
				resp.send(err);
			} else {
				mailController.send( 'registration', 'LoL Hypes Account', userData.mail, {
					pseudo: userData.pseudo
				} );
				resp.send(user);
			}

		});
	}
};

exports.auth = function(req, resp) {
	User.authenticate(req.body.mail, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
	      resp.send(err);
      } else {
        req.session.userId = user._id;
        resp.send(user);
      }
    });
}

exports.get = function(req, resp) {
	if ( req.params.id ) {
		User.findOne({'_id': req.params.id}, function(err, users) {
			if (err) {
				resp.send(err);
			}

			resp.send(users);
		});
	} else {
		resp.send([]);
	}

};
