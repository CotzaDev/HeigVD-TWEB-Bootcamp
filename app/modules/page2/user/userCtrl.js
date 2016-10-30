(function() {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:userCtrl
	* @description
	* # userCtrl
	* Controller of the app
	*/

  	angular
		.module('user')
		.controller('UserCtrl', User);

		User.$inject = ['$scope', '$stateParams', '$location', 'UserService'];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function User($scope, $stateParams, $location, UserService) {
			/*jshint validthis: true */
			var vm = this;

			vm.goToUser = goToUser;

			$scope.vm.subtitle = 'Analysis of : ' + $stateParams.username;
			vm.loaded = false;
			vm.error = false;

			vm.languages = {
				labels: [],
				lines: [],
				options: {
					legend: {
						display: true,
						position: 'bottom',
						fullWidth: false,
						labels : {
							fontColor: '#fff'
						}
					},
					tooltips: {
			      callbacks: {
							// Show percentage instead of value on labels
			        label: function(tooltipItem, data) {
			        	var dataset = data.datasets[tooltipItem.datasetIndex];
			          var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
			            return previousValue + currentValue;
			          });
			          var currentValue = dataset.data[tooltipItem.index];
			          var precentage = Math.floor(((currentValue/total) * 100)+0.5);
			          return precentage + "%";
			        }
			      }
			    }
				}
			};

      UserService.getGithubData($stateParams.username)
      	.then(function(data) {

					vm.type = data.type;

					var topLanguages = UserService.sortProperties(data.languages).slice(0,10);
					topLanguages.forEach(function(lang){
						vm.languages.labels.push(lang[0]);
						vm.languages.lines.push(lang[1]);
					});

					vm.infos = data.infos;

					if(data.type == 'Organization') {
						vm.members = data.members;
					}

					vm.loaded = true;
      })
			.catch(function(err) {
				if(err.status == 404) {
					vm.errorMsg = "The user/organisation doesn't exist";
				}
				else {
					vm.errorMsg = "An error occurred";
				}
				vm.error = true;
				vm.loaded = true;
			});

			function goToUser(username) {
				$location.path('page2/user/' + username);
			}
		}

})();
