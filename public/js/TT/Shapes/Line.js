var TT = TT || {};
TT.NewShapes = TT.NewShapes || {};

TT.NewShapes.Line = function(me)
{
	var me = {};
	TT.NewShapes.ShapeMixin(me);

	me._identifier = 3;

	me.addRotationMap(new TT.Map([
		 [0,0,0,0,0],
		 [0,0,0,0,0],
		 [1,1,1,1,0],
		 [0,0,0,0,0]
	]));

	me.addRotationMap(new TT.Map([
		 [0,0,1,0,0],
		 [0,0,1,0,0],
		 [0,0,1,0,0],
		 [0,0,1,0,0]
	]));

	return me;
};
