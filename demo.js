var express = require('express');
var bodyParser = require('body-parser');
var https = require("https");
var MongoClient = require("mongodb").MongoClient;

var header = {"X-Apptweak-Key": "QS5NiFFrLERBRML_ptL208cJoWc"};
var db;

var options = {
	hostname: "api.apptweak.com",
	port: 443,
	path: "/ios/categories/6014/top.JSON",
	"rejectUnauthorized": false,
	method:"GET",
	headers: header
};

var app = express();

app.use(express.static('static'));

var data;

app.get('/api/bugs', function(req,res){
	db.collection("data").find().toArray(function(err,docs) {
		res.json(data.content); 
	});
});

app.get('/api/insert', function(req,res){
	db.collection("data").insertMany(data.content, function(err,result) {
		res.json(data.content); 
		console.log(result);
	});
});



var req = https.request(options, function(res) {
 var responseBody =""; 
 console.log("Response from server started."); 
 console.log(`Server Status: ${res.statusCode}`); 
 console.log("Response Headers: %j", res.headers);
 res.setEncoding("UTF-8"); 

 res.on("data", function(chunk) {
 	responseBody += chunk; });

 res.on("end", function(){
 	/*
 	fs.writeFile("george-washington.html", responseBody, 
 		function(err){
 			if(err){throw err; } 
 			console.log("File Downloaded"); 
 		}); */
 		data = JSON.parse(responseBody);
 });
});

req.on("error", function(err) {
	console.log(`problem with request: ${err.message}`);
});

req.end();


app.use(bodyParser.json());

app.post('/api/bugs/', function(req, res) {
	console.log("Req body:", req.body);
	var newBug = req.body;
	newBug.id = bugData.length + 1;
	bugData.push(newBug);
	res.json(newBug);
});

MongoClient.connect('mongodb://localhost/mobile', function(err, dbConnection) {
  db = dbConnection;
  var server = app.listen(3000, function() {
	  var port = server.address().port;
	  console.log("Started server at port", port);
  });
});