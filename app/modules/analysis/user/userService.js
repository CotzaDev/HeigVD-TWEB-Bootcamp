(function() {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.service:userervice
	 * @description
	 * # userService
	 * Service of the app
	 */

  	angular
		.module('user')
		.factory('UserService', User);
		// Inject your dependencies as .$inject = ['$http', 'someSevide'];
		// function Name ($http, someSevide) {...}

		User.$inject = ['$http'];

		function User ($http) {
			return {
	      getGithubData: getGithubData,
				sortProperties: sortProperties

	    };

			function getGithubData(username) {
	      return $http.get('/api/user/' + username)
	        .then(getGithubDataComplete)

				function getGithubDataComplete(response) {
		    	return response.data;
		    }
			}

			function sortProperties(obj){
			  // convert object into array
		    var sortable=[];
		    for(var key in obj)
		        if(obj.hasOwnProperty(key))
		            sortable.push([key, obj[key]]);

		    // sort items by value
		    sortable.sort(function(a, b)
		    {
		      return b[1]-a[1]; // compare numbers desc
		    });
		    return sortable;
			}
		}

})();
