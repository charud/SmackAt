var TT = TT || {};


TT.TetrominoGenerator = function()
{
	var me = {};
	var _elmNextTetromino;
	var _shapes = [];
	var _nextTetromino;

	me.init = function()
	{
		_elmNextTetromino = $("#next");

		_shapes = [
			new TT.NewShapes.T(),
			new TT.NewShapes.Block(),
			new TT.NewShapes.Line(),
			new TT.NewShapes.S(),
			new TT.NewShapes.Z(),
			new TT.NewShapes.L(),
			new TT.NewShapes.J()
		];

		_nextTetromino = getRandomShape();
	};

	me.getNextTetromino = function()
	{
		var returnTetromino = _nextTetromino;
		_nextTetromino = getRandomShape();
		_nextTetromino.getShapeMapByRotation(0).getCropped().renderToElement(_elmNextTetromino, 20, 20);
		
		return returnTetromino;
	};

	var getRandomShape = function()
	{
		var shapeIndex = getRandom(0, _shapes.length - 1);
		return _shapes[shapeIndex];
	};

	var getRandom = function(min, max)
	{
		return Math.floor((Math.random() * (max - min + 1)) + min);
	};

	me.getList = function()
	{
		return _nextTetrominos;
	};

	me.init();
	return me;
};
