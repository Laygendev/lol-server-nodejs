'use strict';

const nodemailer = require('nodemailer');

module.exports = function() {
	nodemailer.createTestAccount((err, account) => {

	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		host: 'smtp.lolhype.com',
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: 'contact@lolhype.com', // generated ethereal user
			pass: 'M5eG0wCY5mEiiSfSDIS5@' // generated ethereal password
		}
	});

	// setup email data with unicode symbols
	let mailOptions = {
		from: '"LoL Hype" <contact@lolhype.com>', // sender address
		to: 'latour.jimmy@gmail.com', // list of receivers
		subject: 'Hello ✔', // Subject line
		text: 'Hello world?', // plain text body
		html: '<b>Hello world?</b>' // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error);
		}
		console.log('Message sent: %s', info.messageId);
		// Preview only available when sending through an Ethereal account
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
	});
};
