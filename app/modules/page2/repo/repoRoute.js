'use strict';

/**
 * @ngdoc function
 * @name app.route:repoRoute
 * @description
 * # repoRoute
 * Route of the app
 */

angular.module('repo')
	.config(['$stateProvider', function ($stateProvider) {

		$stateProvider
			.state('home.page2.repo', {
				url:'/repo/:user/:name',
				templateUrl: 'app/modules/page2/repo/repo.html',
				controller: 'RepoCtrl',
				controllerAs: 'vm'
			});


	}]);
