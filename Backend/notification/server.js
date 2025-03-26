require('dotenv').config();
var app = require('express')();
var http = require('http');
var socketIO  = require('socket.io');
var bodyParser = require('body-parser');

const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT"]
    }
});
app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-AUTH-TOKEN');
    next();
});

var pjson = require('./package.json');

var pushService = (function() {
	var connections = {};

	return {
		registerUser: function(userId, connectionId) {
			if (connections[userId] === undefined) {
				connections[userId] = {};
			}

			connections[userId][connectionId] = null;
			console.log('Registered connection ' + connectionId.substring(0, 4) + '*** for user ' + userId);
		},
		registerSocket: function(userId, connectionId, socket) {
			if (connections[userId] != null && connections[userId][connectionId] == null) {
				socket.userId = userId;
				socket.connectionId = connectionId;
				connections[userId][connectionId] = socket;
				console.log('Registered socket for connection ' + connectionId.substring(0, 4) + '*** and  user ' + userId);
				return true;
			} else {
				console.log('Not found ' + connectionId.substring(0, 4) + '*** and  user ' + userId);
				return false;
			}
		},
		removeConnection: function(socket) {
			var userId = socket.userId;
			var connectionId = socket.connectionId;
			if (userId && connectionId && connections[userId] && connections[userId][connectionId]) {
				console.log('Removed socket for user ' + userId + ' and connection: ' + connectionId.substring(0, 4) + '***');
				delete connections[socket.connectionId];
			}
		},
		pushMessage: function(userId, message) {
			var userConnections = connections[userId];
			if (userConnections) {
				for (var connectionId in  userConnections) {
					if (userConnections.hasOwnProperty(connectionId)) {
						var socket = userConnections[connectionId];
						if (socket != null) {
							socket.emit('message', message);
						}
					}
				}
			}
		}
	}
}());

io.on('connection', function(socket) {

	// đăng ký nhận thông báo
	socket.on('register', function(userId, connectionId) {
		pushService.registerSocket(userId, connectionId, socket);
	});

	socket.on('disconnect', function() {
		pushService.removeConnection(socket);
	});

});

app.put('/api/:userId/register', function(req, res) {
    console.log(process.env['AUTH_TOKEN'])
	if (req.header('X-AUTH-TOKEN') != process.env['AUTH_TOKEN']) {
		res.status(401).send();
	} else {
		var userId = req.params['userId'];
		var connectionId = req.query['connectionId'];
		if (userId && connectionId) {
			pushService.registerUser(userId, connectionId);
			res.send();
		} else {
			res.status(400).send('Bad Request');
		}
	}
});

app.post('/api/:userId/push', function(req, res) {
	if (req.header('X-AUTH-TOKEN') != process.env['AUTH_TOKEN']) {
		res.status(401).send();
	} else {
		console.log(req.body);
		var userId = req.params['userId'];
		if (userId && req.body) {
			pushService.pushMessage(userId, req.body);
			res.send();
		}
		else {
			res.status(400).send('Bad Request');
		}
	}
});


app.get('/api/status/ping', function(req, res) {
	res.send('pong')
});


app.get('/api/status/info', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	var info = {
		'name': pjson.name,
		'version': pjson.version
	};
	res.send(info)
});

server.listen(process.env['PORT'], function() {
	console.log('Node app is running on port', process.env['PORT']);
});
