'use strict';

/**
 * @ngdoc function
 * @name app.route:historyRoute
 * @description
 * # historyRoute
 * Route of the app
 */

angular.module('history')
	.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
			.state('home.history', {
				url:'/history',
				templateUrl: 'app/modules/history/history.html',
				controller: 'HistoryCtrl',
				controllerAs: 'vm'
			});

		
	}]);
