var bcrypt = require("bcrypt-nodejs");
var User = require("../models").User;

	module.exports = function(user, callback){
		new User({
			username: user.name,
			password: bcrypt.hashSync(user.pass),
			email: user.email,
			createdAt: new Date().toLocaleDateString()
		}).save(function(err){
			if(err){
				callback({
					"success": false,
					"reason": "Failed to save user"
				});
			} else {
				callback({
					"success": true,
					"reason": "Saved user"
				});
			}
		});
	}