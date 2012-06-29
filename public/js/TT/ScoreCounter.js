var TT = TT || {};

TT.ScoreCounter = function()
{
	var me = {};
	var _score = 0;
	var _elmScoreFlash;
	var _elmScore;
	var _elmLines;
	var _linesRemovedInARowCounter = 0;
	var _backToBackTetrisCounter = 0;
	var _lineCounter = 0;

	var _currentPlayer = TT.Container.create("CurrentPlayer");

	me.init = function()
	{
		_elmScore = $("#score");
		_elmLines = $("#lines");
		_elmScore.text("0");
		
		_elmScoreFlash = $("#scoreFlash");

		TT.SmackAt.on("linesRemoved", onLinesRemoved);
		TT.SmackAt.on("lockdown", me.onLockdown);
	};

	var onLinesRemoved = function(lines)
	{
		_linesRemovedInARowCounter++;

		var flashMessage = "";
		var flashMessage2 = null;
		var flashMessage3 = null;
		var pointsAward = 0;
		
		if(lines.length == 1) { pointsAward = 50; } 
		if(lines.length == 2) { pointsAward = 150; }  
		if(lines.length == 3) { pointsAward = 300; } 
		if(lines.length == 4) { 
			_backToBackTetrisCounter++;
			if (_backToBackTetrisCounter >= 2) {
				if(_backToBackTetrisCounter == 3) flashMessage3 = "Good! ";
				if(_backToBackTetrisCounter == 4) flashMessage3 = "Dude! ";
				if(_backToBackTetrisCounter == 5) flashMessage3 = "Keep em' coming! ";
				if(_backToBackTetrisCounter == 6) flashMessage3 = "Way to go! ";
				if(_backToBackTetrisCounter == 7) flashMessage3 = "Awesome! ";
				if(_backToBackTetrisCounter == 8) flashMessage3 = "Amazing! ";
				if(_backToBackTetrisCounter == 9) flashMessage3 = "Stunning ";
				if(_backToBackTetrisCounter == 10) flashMessage3 = "Incredible";
				if(_backToBackTetrisCounter >= 11) flashMessage3 = "Masterful";
				flashMessage = "Back to Back Tetris ";
				pointsAward = Math.floor(750 * ((100 + (_backToBackTetrisCounter-2)*30) / 100)); // = 1.0, 1.3, 1.6, 1.9. 1.3 for each back to back tetris
			} else {
				pointsAward = 500; 
				flashMessage = "Tetris "; 
			}
		} else {
			_backToBackTetrisCounter = 0;
		}

		if(_linesRemovedInARowCounter == 2) { pointsAward *= 1.5; flashMessage2 = "Double "; }
		if(_linesRemovedInARowCounter == 3) { pointsAward *= 2; flashMessage2 = "Tripple "; }
		if(_linesRemovedInARowCounter == 4) { pointsAward *= 3; flashMessage2 = "Supercombo"; }
		if(_linesRemovedInARowCounter == 5) { pointsAward *= 5; flashMessage2 = "Monstercombo "; }
		if(_linesRemovedInARowCounter == 6) { pointsAward *= 9; flashMessage2 = "Awesome"; }
		if(_linesRemovedInARowCounter == 7) { pointsAward *= 15; flashMessage2 = "Incredible"; }
		if(_linesRemovedInARowCounter == 8) { pointsAward *= 20; flashMessage2 = "Masterful "; }
		if(_linesRemovedInARowCounter >= 9) { pointsAward *= 30; flashMessage2 = "Ridiculous"; }
		
		flashMessage += pointsAward + "p"; 
		flash(flashMessage, lines[lines.length-1].key*10);

		if(flashMessage2) {
			setTimeout(function(){ flash(flashMessage2, 100); }, 500);
		}

		if(flashMessage3) {
			setTimeout(function(){ flash(flashMessage3, 120); }, 800);
		}

		me.raiseScore(Math.floor(pointsAward));
		me.raiseLines(lines.length);
	};

	me.onLockdown = function(areLinesRemoved)
	{
		if (areLinesRemoved == false) {
			_linesRemovedInARowCounter = 0;
		}
	};

	me.raiseScore = function(points)
	{
		_score += points;
		_currentPlayer.setScore(_score);
		_elmScore.text(_score);
	};

	me.raiseLines = function(lineCount)
	{
		_lineCounter += lineCount;
		_elmLines.text(_lineCounter);
	};

	var flash = function(message, yCoordinate)
	{
		var elmPoints = $("<div>");
		elmPoints.addClass("points");
		elmPoints.text(message);
		_elmScoreFlash.append(elmPoints);
		
		yCoordinate = yCoordinate || 190;
		
		elmPoints.css({top: yCoordinate - 40});
		elmPoints.animate({top: yCoordinate + "px", opacity: "1"}, 200, function() {
			elmPoints.animate({top: "0px", opacity: "0"}, 1300, function() {
				elmPoints.remove();
				elmPoints = null;
			});
		});
	};

	me.getScore = function()
	{
		return _score;
	};

	me.init();
	return me;
};