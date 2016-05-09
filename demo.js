var express = require('express');
var bodyParser = require('body-parser');
var https = require("https");
var MongoClient = require("mongodb").MongoClient;

//Information for the REST call
var header = {"X-Apptweak-Key": "QS5NiFFrLERBRML_ptL208cJoWc"};
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
var db;

//Route to display the information on the table -> filtering is work in progress
app.get('/api/bugs', function(req,res){
	console.log("Query string", req.query);
	var filter = {};
	if(req.query.priority)
		filter.priority = req.query.priority;
	if(req.query.status)
		filter.status = req.query.status;

	db.collection("data").find(filter).toArray(function(err,docs) {
		res.json(docs); 
	});
});

//Route to insert data to our DB, temporary workaround
app.get('/api/insert', function(req,res){
	db.collection("data").insertMany(data.content, function(err,result) {
		//We insert the content portion of our JSON data and display it
		res.json(data.content); 
		console.log(result);
	});
});

app.use(bodyParser.json());

//Making the https restful request
var req = https.request(options, function(res) {
 var responseBody =""; 
 console.log("Response from server started."); 
 console.log(`Server Status: ${res.statusCode}`); 
 console.log("Response Headers: %j", res.headers);
 res.setEncoding("UTF-8"); 
 //retrieve the data in chunks
 res.on("data", function(chunk) {
 	responseBody += chunk; });

 res.on("end", function(){
 	//Once completed we parse the data in JSON format
 	data = JSON.parse(responseBody);
 });
});

req.on("error", function(err) {
	console.log(`problem with request: ${err.message}`);
});

req.end();


//POST request from demo -> Not in use currently
app.post('/api/bugs/', function(req, res) {
	console.log("Req body:", req.body);
	var newBug = req.body;
	newBug.id = bugData.length + 1;
	bugData.push(newBug);
	res.json(newBug);
});

//We conntect to the database once we run this file
MongoClient.connect('mongodb://localhost/mobile', function(err, dbConnection) {
  db = dbConnection;
  var server = app.listen(3000, function() {
	  var port = server.address().port;
	  console.log("Started server at port", port);
  });
});