angular.module("pickUpLineApp.factory", ["ngStorage"])
.factory("creds", function($localStorage){
	var creds = function(){
		if($localStorage.session){
			return {
				username: $localStorage.session.user,
				token: $localStorage.session.token,
				loggedIn: true
			}
		}else{
			return {
				loggedIn:false
			}
		}
		
	};
	return creds
})