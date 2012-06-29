var TT = TT || {};
TT.Models = TT.Models || {};

TT.Models.PlayerList = function(options) {
	var me = {};
	TT.Mixin.Event(me);

	var _players = [];
	var _connection = TT.Container.create("Connection");

	me.init = function() {
		_connection.emit("getPlayers");
		_connection.on('players', onPlayersUpdated);
	};

	var onPlayersUpdated = function(players) {
		_players = players;

		// Find current player
		for(var i in _players) {
			if(_players[i].id == _connection.getId()) {
				_players[i].isCurrentPlayer = " (You)";
			} else {
				_players[i].isCurrentPlayer = "";
			}
		}

		me.fire("updated", players);
	};

	me.getPlayers = function()
	{
		return _players;
	};

	me.init();
	return me;
};
