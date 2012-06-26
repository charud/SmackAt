(function() {
	
	$.ajaxSetup({
	  cache: true
	});

	$(document).ajaxError(function(e, xhr, settings, exception) {
	    console.log("Error in ", settings.url, "\n", exception.message, "\n", exception.stack);
	});

	var assets = $.when(
		load("TT.SmackAt"),
		load("TT.Shapes.ShapeMixin"),
		load("TT.Shapes.Block"),
		load("TT.Shapes.Line"),
		load("TT.Shapes.S"),
		load("TT.Shapes.Z"),
		load("TT.Shapes.L"),
		load("TT.Shapes.J"),
		load("TT.Shapes.T"),
		load("TT.Mixin.Event"),
		load("TT.Tetromino"),
		load("TT.TetrominoGenerator"),
		load("TT.Map"),
		load("TT.Hold"),
		load("TT.ScoreCounter"),
		load("TT.Helpers")
	);

	assets.done(function() {
		TT.SmackAt.init();
		TT.SmackAt.setInterval(500);
		TT.SmackAt.setKeyUpdateInterval(70);
		TT.SmackAt.startUpdate();
	})

	assets.fail(function(a, b) {
		console.log("Error on load:", b);
	});

	function load(module) {
		var path = module.replace(/\./g, '/');
		return $.getScript("js/" + path + ".js");
	}

}());