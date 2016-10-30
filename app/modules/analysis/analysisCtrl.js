(function() {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:analysisCtrl
	* @description
	* # analysisCtrl
	* Controller of the app
	*/

  	angular
		.module('analysis')
		.controller('AnalysisCtrl', Analysis);

		Analysis.$inject = ['$scope', '$location'];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function Analysis($scope, $location) {
			/*jshint validthis: true */
			var vm = this;
			vm.title = 'GitHub Analysis';
			vm.subtitle = 'Analyse data from a GitHub repository, user or organization';

			vm.error = false;
			vm.input = null;
			vm.type = 'repo';

			vm.runAnalysis = runAnalysis;

			$scope.$watch('vm.type', function(current, original) {
				switch(current) {
					case 'repo':
						vm.inputLabel = 'Github repository url';
						break;
					case 'usr':
						vm.inputLabel = 'Github repository url, username or organization';
						break;
				}
			});

			function runAnalysis() {
				vm.error = false;
				
				if(!vm.input) {
					vm.error = true;
					vm.errorMsg = 'You have to enter a repository, user or organisation';
					return;
				}

				var ghInfo = gh(vm.input);

				switch(vm.type) {
					case 'repo':
						if (ghInfo) {
							$location.path('analysis/repo/' + ghInfo.user + '/' + ghInfo.repo);
						}
						else {
							vm.error = true;
							vm.errorMsg = 'Not a valid GitHub URL';
						}
						break;
					case 'usr':
						if (ghInfo) {
							var user = ghInfo.user;
						}
						else {
							var user = vm.input;
						}

						if(user.indexOf("http://") <= -1 && user.indexOf("https://") <= -1){
							$location.path('analysis/user/' + user);
						}
						else {
							vm.error = true;
							vm.errorMsg = 'Not a valid GitHub URL';
						}
						break;
				}
			}
		}

})();
