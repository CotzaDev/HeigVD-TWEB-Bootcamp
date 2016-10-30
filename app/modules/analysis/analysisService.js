(function() {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.service:analysisService
	 * @description
	 * # analysisService
	 * Service of the app
	 */

  	angular
		.module('analysis')
		.factory('AnalysisService', Analysis);
		// Inject your dependencies as .$inject = ['$http', 'someSevide'];
		// function Name ($http, someSevide) {...}

		Analysis.$inject = ['$http'];

		function Analysis ($http) {

		}

})();
