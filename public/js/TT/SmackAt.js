/**
 * SmackAt
 * @author Charlie Rudenstål <charlie4@gmail.com>
 */

// Observera: Om _lockInterval är lägre än inteval kommer lockDown att triggas så fort något krockar, t ex 
// om en kloss åker in i väggen. Detta eftersom locktimern bara resettas när en update sker, vilket alltså då sker mindre ofta
// än _lockInterval

var TT = TT || {};

TT.SmackAt = (function(me)
{
	me.currentTetromino = null;

	var _map;
	var _tetrominoGenerator;
	var _hold;
	var _scoreCounter;

	var _elmStage;

	var _keyLeft = 37;
	var _keyUp = 38;
	var _keyRight = 39;
	var _keyDown = 40;
	var _keySpace = 32;
	var _keyShift = 16;
	var _keyA = 65;
	var _keyS = 83;
	var _keysDown = {};

	var _originalInterval = 50;
	var _currentInterval = _originalInterval;
	var _keyUpdateInterval = 50;

	var _cellWidth = 20;
	var _cellHeight = 20;

	var _removingLines = false;
	var _isCurrentBlockDropped = false; // dropped using space
	
	var _updateIntervalRef; /* reference to javascript interval object */
	var _keyUpdateIntervalRef; /* reference to javascript interval object */

	me.init = function()
	{
		TT.Mixin.Event(me);

		_elmStage = $("#stage");
		_map = new TT.Map();
		_tetrominoGenerator = new TT.TetrominoGenerator();
		_scoreCounter = new TT.ScoreCounter();
		_hold = new TT.Hold();

		$(window).on("keydown", onKeyDown);
		$(window).on("keyup", onKeyUp);

		spawnTetrinomi();
	};

	var spawnTetrinomi = function(shape /*optional*/)
	{
		if (!shape) {
  			shape = _tetrominoGenerator.getNextTetromino();
  		}
		
		if (me.currentTetromino) {
			me.currentTetromino.unload();
		}

		me.currentTetromino = new TT.Tetromino({map: _map}, shape);
		me.currentTetromino.on("lockdown", onTetrinimoLockDown);	

		me.update();
	};

	var onTetrinimoLockDown = function(tetrinimo)
	{
		if (_isCurrentBlockDropped) {
			stopDropMode()
		}

		tetrinimo.renderToMap(_map);
		var areLinesRemoved = checkForFullLines();
		spawnTetrinomi();
		me.fire("lockdown", areLinesRemoved);
	} 

	me.dropCurrentBlock = function()
	{
		me.enableBlur();

		_isCurrentBlockDropped = true;
		_currentInterval = 0;
		me.currentTetromino .lockInterval = 0;
		me.currentTetromino .lockIntervalWhenMoved = 0;
		me.startUpdate();
	};

	var stopDropMode = function()
	{
		me.disableBlur();

		_isCurrentBlockDropped = false;
		_currentInterval = _originalInterval;
		me.startUpdate();
	};

	me.update = function()
	{
		me.currentTetromino.update();
		me.render();
	}

	var checkForFullLines = function()
	{	
		var wasFullLines = false;
		if (_removingLines == false) {
			var fullLines = _map.findFullLines();
			for(var i in fullLines)
			{
				removeLines(fullLines);
				wasFullLines = true;
				break;
			}
		}
		return wasFullLines;
	};

	var removeLines = function(lines)
	{
		_removingLines = true;
		me.fire("linesRemoved", TT.Helpers.objToArray(lines));
	
		var elementsToRemove = [];
		for (var lineNumber in lines) { 
			var lineElements = $("#stage .cell[data-y=" + lineNumber + "]");
			elementsToRemove = elementsToRemove.concat(lineElements.get());
		}

		elementsToRemove = $(elementsToRemove);

		setTimeout(function() { elementsToRemove.css("opacity", 0); }, 0);
		setTimeout(function() { elementsToRemove.css("opacity", 1); }, 50);
		setTimeout(function() { elementsToRemove.css("opacity", 0); }, 100);
		setTimeout(function() { elementsToRemove.css("opacity", 1); }, 150);
		setTimeout(function() { elementsToRemove.css("opacity", 0); }, 200);
		setTimeout(function() {
			_map.removeLines(lines);
			setTimeout(function() { elementsToRemove.css("opacity", 1); }, 110);
			_removingLines = false;
		}, 100);		
	}

	me.enableBlur = function()
	{
		$(".cell:not(.current)").css({"-webkit-transition-property": "all",
									  "-webkit-transition-duration": "0.15s"}); 
	};

	me.disableBlur = function()
	{	
		$(".cell").css({"-webkit-transition-property": "none",
						"-webkit-transition-duration": "0.02s"}); 
	};

	me.render = function()
	{
		var map = new TT.Map(_map.data);
		me.currentTetromino.renderToMap(map);
		map.renderToElement(_elmStage, _cellWidth, _cellHeight);
	}

	me.startUpdate = function()
	{
		me.stopUpdate();
		_updateIntervalRef = setInterval(me.update, _currentInterval);
		_keyUpdateIntervalRef = setInterval(keyUpdate, _keyUpdateInterval);

		me.update();
	};

	me.setInterval = function(interval)
	{
		_originalInterval = interval;
		_currentInterval = interval;
		me.startUpdate();
	}; 

	me.setKeyUpdateInterval = function(updateInterval)
	{
		_keyUpdateInterval = updateInterval;
		me.startUpdate();
	};

	me.stopUpdate = function()
	{
		clearInterval(_updateIntervalRef);
		clearInterval(_keyUpdateIntervalRef);
	};

	var onKeyDown = function(e)
	{
		_keysDown[e.keyCode] = true;

		switch(e.keyCode)
		{
			case _keyUp:
				me.currentTetromino.move(0, 0, -1);
				me.render();
				break;
			case _keyA:
				me.currentTetromino.move(0, 0, -1);
				me.render();
				break;
			case _keyS:
				me.currentTetromino.move(0, 0, 1);
				me.render();
				break;
			case _keyDown:
				_currentInterval = 20;
				me.startUpdate();
				break;
			case _keySpace:
				me.dropCurrentBlock();
				break;
			case _keyShift:
				var shapeOnHold = _hold.hold(me.currentTetromino.shape);
				spawnTetrinomi(shapeOnHold);
				break;
		}
	}

	var onKeyUp = function(e)
	{
		_keysDown[e.keyCode] = false;

		switch(e.keyCode)
		{
			case _keyDown:
				_currentInterval = _originalInterval;
				me.startUpdate();
				break;
		}
	}

	var keyUpdate = function() 
	{
		for(var keyCode in _keysDown)
		{
			if(_keysDown[keyCode] == false) continue;
			
			switch(parseInt(keyCode))
			{
				case _keyLeft:
					me.currentTetromino.move(-1, 0, 0);
					me.render();
					break;
				case _keyRight:
					me.currentTetromino.move(1, 0, 0);
					me.render();
					break;
			}
		}
	};
	
	return me;
})(TT.SmackAt || {});