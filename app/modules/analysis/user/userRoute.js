'use strict';

/**
 * @ngdoc function
 * @name app.route:userRoute
 * @description
 * # userRoute
 * Route of the app
 */

angular.module('user')
	.config(['$stateProvider', function ($stateProvider) {

		$stateProvider
			.state('home.analysis.user', {
				url:'/user/:username',
				templateUrl: 'app/modules/analysis/user/user.html',
				controller: 'UserCtrl',
				controllerAs: 'vm'
			});


	}]);
