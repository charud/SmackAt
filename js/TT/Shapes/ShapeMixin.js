var TT = TT || {};
TT.NewShapes = TT.NewShapes || {};

TT.NewShapes.ShapeMixin = function(me)
{
	me._shapeMapByRotation = [];

	me.getIdentifier = function()
	{
		return me._identifier;
	};

	me.getShapeMapByRotation = function(rotation)
	{
		return me._shapeMapByRotation[rotation];
	}

	me.getRotationCount = function()
	{
		return me._shapeMapByRotation.length;
	};

	me.addRotationMap = function(map)
	{
		// Convert all non-zeros to actual shapes identifier, ie [0, 1, 0], [0, 1, 0], [0, 1, 0] to [0, 4, 0], [0, 4, 0], [0, 4, 0] if identifier for this shape is 4
		// Makes it easier to change identifier for the shape as it's not necessary to use it in the data map 
		map.foreachCell(function(x, y, data) {
			if (data != 0) { 
				map.set(x, y, me.getIdentifier());
			}
		});

		me._shapeMapByRotation.push(map);
	};

	return me;
};