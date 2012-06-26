var TT = TT || {};

TT.Helpers = (function(me)
{
	me.objToArray = function(object)
	{
		var array = [];
		for (var i in object) {
			array.push({key: i, value: object[i]});
		}
		return array;
	};

	me.cloneArray = function(array)
	{
		return jQuery.extend(true, [], array);
	}

	me.clone = function(object)
	{
		return jQuery.extend(true, {}, object);
	};


	return me;
})(TT.Helpers || {});