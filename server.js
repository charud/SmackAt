var express = require("express");
var http = require("http");
var socketio = require("socket.io");

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

// Serve the public directory
app.use(express.static(__dirname + "/public"));

var PlayerList = function() {
	var me = {};
	var _players = {};

	me.add = function(player) {
		_players[player.id] =player;
	} 	

	me.removeById = function(id) {
		delete _players[id];
	}

	me.getAll = function() {
		return Helpers.objectToArray(_players).sort(function(a, b) { 
			return b.score - a.score;
		});
	}

	me.get = function(id)
	{
		return _players[id];	
	};

	return me;
}

var Player = function(options) {	
	var me = {};
	me.id = options.id;
	me.score = 0;
	return me;
}

var Helpers = (function() {
	var me = {};

	me.objectToArray = function(object) {
		var array = [];
		for(var i in object) {
			array.push(object[i]);
		}
		return array;
	}

	return me;
})();

var playerList = new PlayerList();

// Socket connections
io.sockets.on('connection', function(socket) {
	console.log("Client connected (" + socket.id + ")");
	playerList.add(new Player({id: socket.id}));
	
	socket.on("getPlayers", function() {
		socket.emit("players", playerList.getAll());
	});

	socket.on('disconnect', function() {
		console.log("Client disconnected (" + socket.id + ")");
		playerList.removeById(socket.id);
		io.sockets.emit("players", playerList.getAll());
	});

	socket.on("score", function(score) {
		playerList.get(socket.id).score = score;
		io.sockets.emit("players", playerList.getAll());
		//socket.broadcast.emit("players", playerList.getAll());
	});

	//socket.emit("players", { players: players });
	socket.broadcast.emit("players", playerList.getAll());
	socket.emit("status", {id: socket.id});
});



server.listen(80);