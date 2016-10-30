(function() {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.service:analysisService
	 * @description
	 * # analysisService
	 * Service of the app
	 */

  	angular
		.module('repo')
		.factory('RepoService', Repo);
		// Inject your dependencies as .$inject = ['$http', 'someSevide'];
		// function Name ($http, someSevide) {...}

		Repo.$inject = ['$http'];

		function Repo ($http) {
			return {
	      getGithubData: getGithubData
	    };

			function getGithubData(user, repo) {
	      return $http.get('/api/repo/' + user + '/' + repo)
	        .then(getGithubDataComplete)

				function getGithubDataComplete(response) {
		    	return response.data;
		    }
			}
		}

})();
