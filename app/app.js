(function() {
	'use strict';

	/**
	 * @ngdoc index
	 * @name app
	 * @description
	 * # app
	 *
	 * Main modules of the application.
	 */

	angular.module('bootcamp-app', [
		'ngResource',
		'ngAria',
		 'ui.bootstrap',
		'ngCookies',
		'ngAnimate',
		'ngTouch',
		'ngSanitize',
		'ui.router',
		'chart.js',
		'home',
		'analysis',
			'repo',
			'user',
		'history',
	]);

})();
