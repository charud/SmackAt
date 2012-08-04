/*global require,module */
if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(function(require) {
	"use strict";
	
	var me = function()
	{
	};

	me.prototype.add = function(a, b) { 
		return a + b;
	};

	return me;
});
