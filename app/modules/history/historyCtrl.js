(function() {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:historyCtrl
	* @description
	* # historyCtrl
	* Controller of the app
	*/

  	angular
		.module('history')
		.controller('HistoryCtrl', History);

		History.$inject = ['$scope', '$location', 'HistoryService'];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function History($scope, $location, HistoryService) {
			/*jshint validthis: true */
			var vm = this;
			vm.title = 'History';
			vm.subtitle = 'View the last 25 analysis requests made on our service';

			vm.onlyIP = '';

			vm.convertDate = convertDate;
			vm.goToAnalyse = goToAnalyse;

			$scope.$watch('vm.onlyIP', function(current, original) {
				vm.error = false;
				vm.loaded = false;

				HistoryService.getHistoryData(current != '' ? true : false)
	      	.then(function(data) {

						vm.history = data;
						vm.loaded = true;
	      	})
					.catch(function(err) {
						vm.errorMsg = "An error occurred";
						vm.error = true;
						vm.loaded = true;
				});
			});

			function convertDate(date) {
				return new Date(date).toLocaleString("en-us");
			}

			function goToAnalyse(type, value) {
				$location.path(type == 'Repo' ? 'analysis/repo/' + value : 'analysis/user/' + value);
			}

		}

})();
