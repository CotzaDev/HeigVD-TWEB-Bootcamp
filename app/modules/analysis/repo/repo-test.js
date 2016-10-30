(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.test:analysisTest
	 * @description
	 * # analysisTest
	 * Test of the app
	 */

	describe('repo test', function () {
		var controller = null, $scope = null;

		beforeEach(function () {
			module('bootcamp-app');
		});

		beforeEach(inject(function ($controller, $rootScope) {
			$scope = $rootScope.$new();
			controller = $controller('RepoCtrl', {
				$scope: $scope
			});
		}));

		it('Should controller must be defined', function () {
			expect(controller).toBeDefined();
		});

	});
})();
