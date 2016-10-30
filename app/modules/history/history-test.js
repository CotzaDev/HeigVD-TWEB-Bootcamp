(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.test:historyTest
	 * @description
	 * # historyTest
	 * Test of the app
	 */

	describe('history test', function () {
		var controller = null, $scope = null;

		beforeEach(function () {
			module('bootcamp-app');
		});

		beforeEach(inject(function ($controller, $rootScope) {
			$scope = $rootScope.$new();
			controller = $controller('HistoryCtrl', {
				$scope: $scope
			});
		}));

		it('Should controller must be defined', function () {
			expect(controller).toBeDefined();
		});

	});
})();
