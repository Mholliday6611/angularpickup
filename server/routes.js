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

	app.post("/api/pickup", function(req, res){
		if(req.user){
			var name = req.user.name
			return name
		}
		new Line({
			author: name || "Unknown",
			line: req.body.line
		}).save(function(err){
			if(err){
				res.send("Ooops!")
			}else{
				res.send("Thanks for Your Contribution!")
			}
		})
	}),
	app.put("/api/favorite/:id",function(req, res){
		User.findByIdAndUpdate(req.query.id, {$addToSet: {"favorites":req.body.favorite}},{new:true}, function(err,doc){
            console.log(doc);
            if(err){
                res.send("update fail");
            }else {
                res.send("update success");
            }
        })
	}),
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