var TT = TT || {};
TT.Controls = TT.Controls || {};

TT.Controls.PlayerList = function(options) {
	var me = {};
	var _model = TT.Container.create("Models.PlayerList");
	var _templating = TT.Container.create("Templating");

	me.init = function() {
		_model.on("updated", onPlayerListUpdated);
	};

	var onPlayerListUpdated = function() {
		_templating.fill("#players ul", _model.getPlayers());

		var divs = $("<div>");

		var players = _model.getPlayers();
		console.log(players);
		for(var i in players) {
			var player = players[i];
			var div = $("<div>").addClass("player");

			var name = $("<div>").addClass("name");
			name.text("Player");
			div.append(name);
			
			var score = $("<div>").addClass("score");
			score.text(player.score);
			div.append(score);

			divs.append(div);
		}


		$("#players").empty();
		$("#players").append(divs);


	};

	me.init();
	return me;
};
