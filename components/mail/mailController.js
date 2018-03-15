'use strict';

const nodemailer = require('nodemailer');
const jade       = require('jade');
const fs         = require('fs');
const config     = require('./../../config.json');

module.exports.send = function(type, subject, recipients) {

	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		host: config.mail.smtp,
		port: config.mail.port,
		secure: true, // true for 465, false for other ports
		auth: {
			user: config.mail.user, // generated ethereal user
			pass: config.mail.password // generated ethereal password
		},
		dkim: {
			domainName: config.mail.dkim.domainName,
			keySelector: config.mail.dkim.keySelector,
			privateKey: config.mail.dkim.privateKey
		}
	});

	fs.readFile('./components/mail/email-templates/registration/html.jade', 'utf8', function (err, data) {
		if (err) throw err;

		var fn = jade.compile(data);
		var html = fn();

		// setup email data with unicode symbols
		let mailOptions = {
			from: '"LoL Hype" <' + config.mail.user + '>', // sender address
			to: recipients,
			subject: subject,
			text: text,
			html: html
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
		});
	});
};
