angular.module("pickUpLineApp.controllers", ["ngStorage"])
	.controller("getPickUpLineCtrl", function($scope, $http){
		$scope.getLine = function(){
			$http.get("/api/getLines")
				.then(function(response){
					console.log(response)
					$scope.line = response.data
				})
			}
	})
	.controller("logregCtrl", function($scope, $state, $http, $localStorage){
		$scope.register = function(){
			$http.post("/api/signUp", $scope.newUser, {headers : { 'Content-Type' : 'application/json'} })
			.then(function(response){
				$scope.msg = "Sign Up Success!";
			}, function(response){
				$scope.msg = "Error signing up :("
			})
		}

		$scope.login = function(){
			$http.post("/api/login", $scope.log, {headers : { 'Content-Type' : 'application/json'} })
			.then(function(response){
				console.log(response.data)
				$localStorage.session = {user: response.data.user, token: response.data.token}
				$state.go("index")
			}, function(response){
				$scope.msg2 = "oops!"
			})
		}
	})