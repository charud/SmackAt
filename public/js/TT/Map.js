var TT = TT || {};

TT.Map = function(data)
{
	var me = {};
	me.data = [];

	me.init = function()
	{
		if (data) {
			me.data = TT.Helpers.cloneArray(data);
		} else {
			me.generate(10, 20);
		}
	};

	me.generate = function(width, height)
	{
		for (var y = 0; y < height; y++) {
			me.data[y] = [];
			for (var x = 0; x < width; x++) {
				me.data[y][x] = 0;
			}
		}
	};

	me.get = function(x, y)
	{
		if (!me.data[y]) return null;
		return me.data[y][x];
	};

	me.set = function(x, y, value)
	{
		if (me.data[y]) {
			me.data[y][x] = value;
		}
	};

	me.getWidth = function()
	{
		if(me.data[0]) {
			return me.data[0].length;
		} else {
			return 0;
		}
	};

	me.getHeight = function()
	{
		return me.data.length;
	};

	me.renderToElement = function(toElement, cellWidth, cellHeight)
	{
		var cells = toElement.children();

		var hasMapSizeChanged = me.getWidth() != toElement.attr("data-map-width") || me.getHeight() != toElement.attr("data-map-height");
		if (hasMapSizeChanged) {
			createCellElements(toElement, cellWidth, cellHeight);
		}

		for (var i = 0; i < cells.size(); i ++)
		{
			var cell = $(cells[i]);
			var x = cell.attr("data-x");
			var y = cell.attr("data-y");
			var className = "cell type-" + me.get(x, y);
			cell.get(0).className = "cell type-" + me.get(x, y);
		}
	};

	var createCellElements = function(inElement, cellWidth, cellHeight)
	{
		inElement.attr("data-map-width", me.getWidth());
		inElement.attr("data-map-height", me.getHeight());

		inElement.empty();
		me.foreachCell(function(x, y, data) {
			var elmCell = new $("<div>");
			elmCell.addClass("cell");
			elmCell.addClass("type-" + data);
			
			elmCell.get(0).style.left = x * cellWidth;
			elmCell.get(0).style.top = y * cellHeight;

			elmCell.attr("data-x", x);
			elmCell.attr("data-y", y);
			inElement.append(elmCell);
		});
	};

	me.foreachCell = function(func)
	{
		for (var y in me.data) {
			for (var x in me.data[y]) {
				func(parseInt(x), parseInt(y), me.data[y][x]);
			}
		}
	};

	me.findFullLines = function()
	{
		var fullLines = {};
		for (var y in me.data) {
			var fullLine = true;
			for(var x in me.data[y]) {
				if(me.data[y][x] == 0) {
					fullLine = false;
				}	
			}
			if(fullLine == true) {
				fullLines[y] = true;
			}
		}		

		return fullLines;
	};
	
	me.removeLines = function(lines)
	{
		// Set map data to 0 for those cells that are located at the lines contained in the line array
		for (var lineNumber in lines) {
			for (var y = lineNumber; y >= 1; y--) {
				for (var x in me.data[y]) {
					me.data[y][x]=me.data[y-1][x];
				}
			}
		}
	};

	/**
	 * Will find the smallest rectangle than can be created around content inside the map and then clip the map
	 * Useful if a Tetromino with empty space should be centered for presentation in Hold, Next etc.
	 * @return {[type]} [description]
	 */
	me.getCropped = function()
	{
		var smallestX = 9999999;
		var smallestY = 9999999;
		var biggestX = 0;
		var biggestY = 0;
		me.foreachCell(function(x, y, data) {
			if (data != 0) {
			 	if (x < smallestX) smallestX = x;
				if (y < smallestY) smallestY = y;
				if (x > biggestX) biggestX = x;
				if (y > biggestY) biggestY = y;
			}
		});

		var croppedData = [];
		var newY = 0;
		var newX = 0;
		for (var y = smallestY; y <= biggestY; y++) {
			croppedData[newY] = [];
			newX = 0;
			for (var x = smallestX; x <= biggestX; x++) {
				croppedData[newY][newX] = me.data[y][x];
				newX++;
			}
			newY++;
		}

		return new TT.Map(croppedData);
	}

	me.init();
	return me;
};