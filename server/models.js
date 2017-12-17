 var mongoose = require("mongoose");

 var line = new mongoose.Schema({
 	author: String,
 	line: String,
 	flaggers: []
 })

 var user = new mongoose.Schema({
 	username: {type: String, required: true},
 	password: {type: String, required: true},
 	email: {type: String, required: true},
 	createdAt: String,
 	canPost: {type:Boolean,default:true},
 	postMade: {type:Number,default: 0},
 	favorites: []
 })

 module.exports ={
 	User : mongoose.model("user", user),
 	Line: mongoose.model("line", line)
 }