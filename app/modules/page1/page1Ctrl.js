(function() {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:page1Ctrl
	* @description
	* # page1Ctrl
	* Controller of the app
	*/

  	angular
		.module('page1')
		.controller('Page1Ctrl', Page1);

		Page1.$inject = [];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function Page1() {
			/*jshint validthis: true */
			var vm = this;
			vm.title = 'Page 1';
			vm.subtitle = 'This is the page 1';

			vm.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  vm.series = ['Series A', 'Series B'];

  vm.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];

		}

})();
