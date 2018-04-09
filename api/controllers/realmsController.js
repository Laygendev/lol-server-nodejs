'use strict';

var fs = require('fs');

var path = process.cwd() + '/lol-server-nodejs/';

exports.get = function(req, resp) {
	fs.readFile( path + 'data/realms.json', 'utf8', (err, data) => {
		if (err) throw err;

		data = JSON.parse(data);

		resp.send({
			status: 200,
			data: data,
		});
	});
};
