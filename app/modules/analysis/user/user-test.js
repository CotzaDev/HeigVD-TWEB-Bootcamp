(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.test:userTest
	 * @description
	 * # userTest
	 * Test of the app
	 */

	describe('user test', function () {
		var controller = null, $scope = null;

		beforeEach(function () {
			module('bootcamp-app');
		});

		beforeEach(inject(function ($controller, $rootScope) {
			$scope = $rootScope.$new();
			controller = $controller('UserCtrl', {
				$scope: $scope
			});
		}));

		it('Should controller must be defined', function () {
			expect(controller).toBeDefined();
		});

	});
})();
