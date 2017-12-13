angular.module("pickUpLineApp.factory", ["ngStorage"])
.factory("creds", function($localStorage){
	var creds = {
		username: $localStorage.session.user,
		token: $localStorage.session.token
	};
	return creds
})