/* Copyright (c) 2012 Charlie Rudenstål */
/*global require,module,console */

if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(function(require) {
	"use strict";

	var MyMath = require("Helpers/MathLib");

	var math = new MyMath();
	console.log(math.add(2, 9));

});