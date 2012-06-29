
var TT = TT || {};

TT.Connection = function(options) {
	var me = {};
	var _socket = null;
	var _id;

	me.init = function() {
		_socket = io.connect('http://localhost');
		_socket.on("status", function(data) {
			_id = data.id;
		});
	};

	me.on = function(event, callback) {
		_socket.on(event, callback);
	};

	me.emit = function(event, data) {
		_socket.emit(event, data);
	};

	me.getId = function()
	{
		return _id;
	};

	me.init();
	return me;
};