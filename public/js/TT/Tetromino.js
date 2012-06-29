var TT = TT || {};

TT.Tetromino = function(options, shapeMapByRotation) {
	var me = {};
	TT.Mixin.Event(me);

	me.identifier = shapeMapByRotation.getIdentifier();
	me.x = 5;
	me.y = 0;
	me.rotationIndex = 0;
	me.shape = shapeMapByRotation;
	me.shapeMapByRotation = shapeMapByRotation; 

	me.lockInterval = 550;
	me.lockIntervalWhenMoved = 800;

	var _map = options.map;
	var _lockDownTimer;

	me.renderToMap = function(map, x, y) {
		x = x || me.x;
		y = y || me.y;

		var shapeMap = me.shape.getShapeMapByRotation(me.rotationIndex);
		shapeMap.foreachCell(function(shapeX, shapeY, data) {
			if (data != 0) {
				map.set(shapeX + x, shapeY + y, me.identifier + " current");
			}
		});
	};

	me.move = function(relativeX, relativeY, relativeRotation) {
		relativeRotation = relativeRotation || 0;
		var absoluteRotation = me.rotationIndex + relativeRotation;

		if (absoluteRotation < 0) absoluteRotation = me.shape.getRotationCount() - 1;
		if (absoluteRotation >= me.shape.getRotationCount()) absoluteRotation = 0;

		// me.isMovePossible(0, 1) will tell us if a move would be impossible because of a tetromino getting locked down
		if (me.isMovePossible(relativeX, relativeY, absoluteRotation)) {
			me.x += relativeX;
			me.y += relativeY;
			me.rotationIndex = absoluteRotation;

			if (_lockDownTimer) {
				clearTimeout(_lockDownTimer);
				_lockDownTimer = setTimeout(
					function() {
						me.fire("lockdown", me);
					}, me.lockIntervalWhenMoved);
			}
		}
	}

	me.isMovePossible = function(relativeX, relativeY, absoluteRotation) {
		var isMovePossible = true;

		var absoluteX = relativeX + me.x;
		var absoluteY = relativeY + me.y;

		// Check cell for cell
		var shapeMap = me.shape.getShapeMapByRotation(absoluteRotation)
		shapeMap.foreachCell(function(shapeX, shapeY, data) {
			if (data != 0) {
				var mapX = parseInt(shapeX) + absoluteX;
				var mapY = parseInt(shapeY) + absoluteY;
				if (_map.get(mapX, mapY) != 0) {
					isMovePossible = false;
				}
			}
		});

		return isMovePossible;
	}

	me.update = function() {
		me.move(0, 1, 0);
		me.checkIfLockDown();
	};

	me.checkIfLockDown = function() {
		// me.isMovePossible(0, 1) will tell us if a move would be impossible because of Tetromino getting locked down
		if (me.isMovePossible(0, 1, 0) == false) {
			if (!_lockDownTimer) {
				_lockDownTimer = setTimeout(function() {
					me.fire("lockdown", me);
				}, me.lockInterval);
			}
		}
	}

	me.unload = function() {
		if (_lockDownTimer) {
			clearTimeout(_lockDownTimer);
		}
	};

	return me;
};
