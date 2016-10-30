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
		.module('repo')
		.controller('RepoCtrl', Repo);

		Repo.$inject = ['$scope', '$stateParams', 'RepoService'];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function Repo($scope, $stateParams, RepoService) {
			/*jshint validthis: true */
			var vm = this;
			$scope.vm.subtitle = 'Analysis of ' + $stateParams.user + '\'s ' + $stateParams.name + ' repository';
			vm.loaded = false;
			vm.error = false;

			vm.repo = {
				labels: [],
				commits: [[], []],
				series: ['All', 'Owner']
			};

			vm.languages = {
				labels: [],
				lines: [],
				options: {
					legend: {
						display: true,
						position: 'bottom',
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

			vm.contributors = {
				labels: [],
				commits: [],
				adds: [],
				deletes: []
			};

      RepoService.getGithubData($stateParams.user, $stateParams.name)
      	.then(function(data) {
					data.commits.forEach(function(cMonth){
						vm.repo.labels.push(cMonth.month);
						vm.repo.commits[0].push(parseInt(cMonth.all));
						vm.repo.commits[1].push(parseInt(cMonth.owner));
					});

					for(var lang in data.languages){
						vm.languages.labels.push(lang);
						vm.languages.lines.push(data.languages[lang]);
					}

					vm.stats = data.stats;

					data.contributors.forEach(function(contr) {
						vm.contributors.labels.push(contr.name);
						vm.contributors.commits.push(contr.commit);
						vm.contributors.adds.push(contr.add);
						vm.contributors.deletes.push(contr.delete);

						vm.loaded = true;
					});
      })
			.catch(function(err) {
				console.log(err);
				if(err.status == 404) {
					vm.errorMsg = "The repo doesn't exist";
				}
				else {
					vm.errorMsg = "An error occurred";
				}
				vm.error = true;
				vm.loaded = true;
			});
		}

})();
