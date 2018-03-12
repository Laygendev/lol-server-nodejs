'use strict';

var fs = require('fs');


exports.get = function(req, resp) {
	fs.readFile('data/realms.json', 'utf8', (err, data) => {
		if (err) throw err;

		data = JSON.parse(data);

		resp.send({
			status: 200,
			data: data,
		});
	});
};
