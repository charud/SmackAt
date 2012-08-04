/*global require,__dirname,module,exports */
/*jshint es5:true */

var express = require("express");
var http = require("http");
//var socketio = require("socket.io");

var app = express();
var server = http.createServer(app);
//var io = socketio.listen(server);

// Serve the public directory
app.use(express.static(__dirname + "/public"));

if(module.parent) {
	exports.app = app;
} else {
	server.listen(8080);
}