#!/user/bin/env node

const http   = require('http'),
	https      = require('https'),
	fs         = require('fs'),
	express    = require('express'),
	app        = express(),
	port       = process.env.PORT || 3002,
	mongoose   = require('mongoose'),
	bodyParser = require('body-parser'),
	session    = require('express-session'),
	config     = require('./config.json');

const options = {
  key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
  cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
};

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://' + config.auth.user + ':' + config.auth.password + '@' + config.auth.ip + ':' + config.auth.port + '/' + config.auth.db)

require('./api/models/staticDataChampionModel');
require('./api/models/itemModel');
require('./api/models/guideModel');
require('./api/models/userModel');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
	secret: config.secret,
	resave: true,
	saveUninitialized: false
}));

// Add headers
app.use(function (req, res, next) {
	var allowedOrigins = ['http://www.guideslol.com', 'http://guideslol.com',  'http://localhost:4200', 'http://54.36.43.4', 'http://guideslol.com', 'http://www.guideslol.com', 'https://guideslol.com', 'https://www.guideslol.com'];
	var origin = req.headers.origin;
	if(allowedOrigins.indexOf(origin) > -1){
		res.setHeader('Access-Control-Allow-Origin', origin);
	}

	res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});


var httpsServer = https.createServer(options, app);

httpsServer.on('listening', function() {
	console.log('is listening');
})

require('./api/routes/summonerRoutes')(app);
require('./api/routes/spectatorRoutes')(app);
require('./api/routes/staticDataRoutes')(app);
require('./api/routes/guideRoutes')(app);
require('./api/routes/userRoutes')(app);
require('./api/routes/updateRoutes')(app);
require('./api/routes/realmsRoutes')(app);

httpsServer.listen(port);

console.log('riot RESTful API server started on: ' + port);
