angular.module("pickUpLineApp", ["ui.router", "pickUpLineApp.controllers","ngStorage"])
	.config(function($stateProvider, $urlRouterProvider){
		$stateProvider
			.state("index", {
				url:"/",
				templateUrl: "/templates/home.html",
				controller: "getPickUpLineCtrl"
			})
			.state("logreg", {
				url:"/logreg",
				templateUrl: "/templates/logreg.html",
				controller: "logregCtrl"
			})

			$urlRouterProvider.otherwise("/")
	})