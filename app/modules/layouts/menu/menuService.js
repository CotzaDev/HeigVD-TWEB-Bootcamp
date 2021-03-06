(function() {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.service:menuService
	 * @description
	 * # menuService
	 * Service of the app
	 */

	angular
		.module('bootcamp-app')
		.factory('MenuService', Menu);
	// Inject your dependencies as .$inject = ['$http', 'someSevide'];
	// function Name ($http, someSevide) {...}

	Menu.$inject = ['$http'];

	function Menu($http) {

		var menu = [

			{
				link: 'analysis',
				name: 'GitHub Analysis'
			},

			{
				link: 'history',
				name: 'History'
			}

		];

		return {
			listMenu: function() {
				return menu;
			}
		}

	}

})();
