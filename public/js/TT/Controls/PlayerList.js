var TT = TT || {};
TT.Controls = TT.Controls || {};

TT.Controls.PlayerList = function(options) {
	var me = {};
	var _model = TT.Container.create("Models.PlayerList");
	var _templating = TT.Container.create("Templating");

	me.init = function() {
		_model.on("updated", onPlayerListUpdated);
	};

	var onPlayerListUpdated = function()
	{
		_templating.fill("#players ul", _model.getPlayers());
	};

	me.init();
	return me;
};
