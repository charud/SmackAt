var TT = TT || {};
TT.Mixin = TT.Mixin || {};

TT.Mixin.Event = (function(me)
{
	me.events = {};

	me.fire = function(eventName, parameters)
	{
		if (me.events[eventName]) {
			for (var i in me.events[eventName]) {
				me.events[eventName][i](parameters);
			}
		}
	}

	me.on = function(eventName, callback)
	{
		if (!me.events[eventName]) {
			me.events[eventName] = [];
		}
		me.events[eventName].push(callback);
	};

	return me;
});