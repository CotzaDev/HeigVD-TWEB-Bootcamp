(function() {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:page2Ctrl
	* @description
	* # page2Ctrl
	* Controller of the app
	*/

  	angular
		.module('page2')
		.controller('Page2Ctrl', Page2);

		Page2.$inject = ['$scope', '$location'];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function Page2($scope, $location) {
			/*jshint validthis: true */
			var vm = this;
			vm.title = 'Graph with github datas';
			vm.subtitle = 'A nice graph';

			vm.input = null;
			vm.type = 'repo';

			vm.runAnalysis = runAnalysis;

			$scope.$watch('vm.type', function(current, original) {
				switch(current) {
					case 'repo':
						vm.inputLabel = 'Github repository url';
						break;
					case 'usr':
						vm.inputLabel = 'Github repository url, username or organistion';
						break;
				}
			});

			function runAnalysis() {
				if(!vm.input) {
					return;
				}

				var ghInfo = gh(vm.input);

				switch(vm.type) {
					case 'repo':
						if (ghInfo) {
							$location.path('page2/repo/' + ghInfo.user + '/' + ghInfo.repo);
						}
						break;
					case 'usr':
						if (ghInfo) {
							var user = ghInfo.user;
						}
						else {
							var user = vm.input;
						}
						$location.path('page2/user/' + user);
						break;
				}
			}
		}

})();
