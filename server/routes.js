var auth = require('./auth/local-signup')
var db = require("./models")
var path = require("path")
var bcrypt = require("bcrypt-nodejs");
var jwt = require('jsonwebtoken');
Line = db.Line
User = db.User

module.exports = function(app, passport){
	app.get("/", function(req,res){
		res.sendFile(path.join(__dirname, "../client/index.html"))
	}),

	app.post("/api/signUp", function(req,res){
		auth({
            name: req.body.username,
            pass: req.body.password,
            email: req.body.email
        },function(data){
            if(data.success){
                res.json({
                    "success": "All good"
                });
            }else {
                res.json({
                    "success": "Not Good"
                });
            }
        })
	}),

	app.post("/api/login", function(req,res){
		User.findOne({ username: req.body.username}, function(err,user) {
			if(err){
				res.json({msg: "Error"});
			}
			if (!user) {
				res.json({msg: "user doesnt exist"});
			}
			if (!bcrypt.compareSync(req.body.password, user.password)){
				res.json({msg: "incorrect username/password"});
			}
			if (user && bcrypt.compareSync(req.body.password, user.password)){
				var payload = {id: user.id};
				var token = jwt.sign(payload, process.env.pickupToken)
				res.json({message: "ok",user:user.username, token: token})
			}
		});
	}),
	app.post("/authenticate", passport.authenticate('jwt', { session: false }), function(req, res){
		res.send(req.user)
	}),

	app.post("/api/pickup", passport.authenticate('jwt', {session:false}), function(req, res){
		console.log(req.body.line)
		new Line({
			author: req.user.username || " ",
			line: req.body.line
		}).save(function(err){
			if(err){
				res.send("Ooops! You need to sign in")
			}else{
				res.send("Thanks for Your Contribution!")
			}
		})
	}),
	app.put("/api/flag", passport.authenticate('jwt', {session:false}), function(req, res){
		console.log(req.body)
		Line.findOne({_id : req.body.id},function(err,line){
			for(i=0;i<line.flaggers.length;i++){
				if(line.flaggers[i]==req.user.id){
					res.json({msg: "Already flagged"})
					return
				}
			};
			line.update({$addToSet: {"flaggers": req.user.id}}).exec(function(err, result){
				res.send("You flagged it!")
			})
			
		})
	}),
	app.put("/api/favorite", passport.authenticate('jwt', {session:false}), function(req, res){
		User.findByIdAndUpdate(req.user.id, {$addToSet: {"favorites":req.body.favorite}},{new:true}, function(err,doc){
			if(err){
				res.send("Update failed")
			}else {
				res.send("update success")
			}
		})
	}),
	// app.put("/api/favorite",function(req, res){
	// 	jwt.verify(req.get("token"),process.env.pickupToken, function(err,decoded){
	// 		if(err){
	// 			res.send("oops!")
	// 		}else{
	// 			User.findByIdAndUpdate(decoded.id, {$addToSet: {"favorites":req.body.favorite}},{new:true}, function(err,doc){
	// 				console.log(doc);
	// 				if(err){
	// 					res.send("update fail");
	// 				}else {
	// 					res.send("update success");
	// 				}
	// 			})
	// 		}
	// 	})
	// }),
	app.get("/api/getLines", function(req,res){
		Line.count({}, function(err, count){
			var random = Math.floor(Math.random() * count)

			Line.findOne().skip(random).exec(
				function(err,result){
					console.log(result)
					res.send(result)
				})
		})

	})
}