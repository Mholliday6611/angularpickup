var express = require('express')
var path = require("path");
var app = express();
var bcrypt = require("bcrypt-nodejs");

var jwt = require("jsonwebtoken")
var passport = require("passport")
var passportJWT = require("passport-jwt")

var mongoose = require("mongoose")
var bodyParser = require("body-parser");
var routes = require("./server/routes");
var toks = require("./server/auth/passport-token")
var schedule = require("node-schedule")

app.use("/client", express.static(path.join(__dirname, "./client")));
app.use("/templates", express.static(path.join(__dirname, "./client/templates")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

toks(passport)
routes(app, passport)
app.listen(process.env.PORT || 8080)
mongoose.connect("mongodb://localhost/pickupline");
// mongoose.connect(process.env.DB_URL);