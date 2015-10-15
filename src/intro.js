(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define("cssr",factory);
	} else {
		root.cssr = factory();
	}
}(this, function () {
	'use strict';
