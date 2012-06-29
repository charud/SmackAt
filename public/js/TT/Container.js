var TT = TT || {};

TT.Container = (function(me) {
	var _map = {};

	me.setup = function() {
		me.register("Models.PlayerList", TT.Models.PlayerList);
		me.register("Controls.PlayerList", TT.Controls.PlayerList);
		me.register("CurrentPlayer", TT.Models.CurrentPlayer, "singleton");
		me.register("Templating", LC.Templating, "singleton");
		me.register("Connection", TT.Connection, "singleton");
	};

	me.register = function(name, object, type) {
		_map[name] = { object: object, type: type };
	};

	me.create = function(name) {
		var module = _map[name];
		if (module.type == "singleton") {
			if(typeof module.object == "function") {
				var object = new module.object();
				me.register(name, object, module.type);
				return object;
			} else {
				return module.object;
			}
		} else {
			return new module.object();
		}
	};

	return me;
})(TT.Container || {});