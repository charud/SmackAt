var TT = TT || {};
TT.Models = TT.Models || {};

TT.Models.CurrentPlayer = function(options) {
	var me = {};
	TT.Mixin.Event(me);

	var _connection = TT.Container.create("Connection");
	var _score = 0;

	me.setScore = function(score)
	{
		_score = score;
		_connection.emit("score", _score);
	};

	return me;
};
