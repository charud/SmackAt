
var TT = TT || {};

TT.Hold = function()
{
	var me = {};
	var _shapeOnHold = null;
	var _elmHold;

	me.init = function()
	{
		_elmHold = $("#hold");
	}; 

	me.hold = function(shape)
	{
		var oldShapeOnhold = _shapeOnHold;
		_shapeOnHold = shape;
		_shapeOnHold.getShapeMapByRotation(0).getCropped().renderToElement(_elmHold, 20, 20);
		return oldShapeOnhold;		
	};

	me.init();
	return me;
};