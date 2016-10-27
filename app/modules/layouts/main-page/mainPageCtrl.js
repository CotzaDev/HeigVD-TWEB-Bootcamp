(function () {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:LayoutCtrl
	* @description
	* # LayoutCtrl
	* Controller of the app
	*/

	angular
		.module('bootcamp-app')
		.controller('LayoutCtrl', Layout);

	Layout.$inject = ['$cookies', '$state'];

	/*
	* recommend
	* Using function declarations
	* and bindable members up top.
	*/

	function Layout($cookies, $state) {
		/*jshint validthis: true */
		var vm = this;
	}

})();
