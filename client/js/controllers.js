angular.module("pickUpLineApp.controllers", ["ngStorage","pickUpLineApp.factory"])
	.controller("getPickUpLineCtrl", function($scope,$rootScope, $http, creds, $localStorage){
		if(creds()== null){
			$rootScope.currentUser = null
		}else{
			$rootScope.currentUser = creds().username
		}
		$scope.getLine = function(){
			$http.get("/api/getLines")
				.then(function(response){
					console.log(response)
					$scope.line = response.data
				})
			}
		$scope.favorite = function(){
			console.log(creds())
			$http.put("/api/favorite", {favorite: $scope.line.line}, {headers: {'Content-Type' : 'application/json', 'Authorization' : "bearer " + creds().token} } )
			.then(function(response){
				console.log("cool")
			}).catch(function(response){
				console.log(response)
			})
		}
		$scope.submitLine = function(){
			$http.post("/api/pickup", $scope.newLine, {headers: {'Content-Type' : 'application/json', 'Authorization' : "bearer " + creds().token} })
			.then(function(response){
				$scope.msg = response.data
				$scope.newLine.line = ""
			})
		}
		$scope.flag = function(){
			$http.put("/api/flag", {id:$scope.line._id}, {headers: {'Content-Type' : 'application/json', 'Authorization' : "bearer " + creds().token} } )
			.then(function(response){
				console.log(response.data)
			}).catch(function(response){
				console.log(response.data)
			})
		}
	})
	.controller("navCtrl", function($scope,$rootScope, $localStorage, creds){

		$scope.logout = function(){
			delete $localStorage.session
			$rootScope.currentUser = null
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
				if(response.data.message == "ok"){
					console.log(response.data)
					$localStorage.session = {user: response.data.user, token: response.data.token}
					$state.go("index")
				}else{
					$scope.msg2 = response.data.msg
				}	
			}).catch(function(response){
				$scope.msg2 = "oops!"
			})
		}
	})

	.controller("faveCtrl", function($scope, $http, creds){
		$http.get("/api/getFavorites", {headers : {'Content-Type' : 'application/json', 'Authorization' : "bearer " + creds().token}})
		.then(function(response){
			$scope.faves = response.data.favorites
		}).catch(function(response){
			console.log("You suck")
		})
	})