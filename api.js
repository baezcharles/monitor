var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/monitor');

// Initialization
db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS counts (id INTEGER PRIMARY KEY ASC, username TEXT, totalCount INTEGER DEFAULT 1)");
	//db.run("INSERT INTO counts (id, username, totalCount) VALUES (?, ?, ?)", 0, "pavan", 1);
});
var express = require('express');
var restapi = express();
var bodyParser = require('body-parser');
restapi.use( bodyParser.json() );       // to support JSON-encoded bodies
restapi.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// To fetch the list of notes from the sqlite database
restapi.get('/list', function(req, res){
	var result;
	db.all("SELECT * FROM counts", function(err, rows) {
      //console.log(JSON.stringify(rows));
	  res.end(JSON.stringify(rows));
    });
    /*db.each("SELECT * FROM notes", function(err, row){
        //console.log(row.id + ": " + row.title + ": " + row.note);
		console.log(row);
		res.json(row);
		//result += '{ "id" : "' + row.id + '", "title" : "' + row.title + '", "note" : "' + row.note + '"},';
    });*/
	//result = '[' + result + ']';
	//console.log(result);
	//res.json(result);
});

//To display number of requests received
restapi.get('/', function(req, res){
    db.run("UPDATE counts SET totalCount = totalCount + 1 WHERE username = ?", req.query.username, function(err, affectedRows){
      if(!this.changes){
        db.run("INSERT into counts(username, totalCount) values(?, 1)", req.query.username);
      };
    });
    res.json({ "status" : "done" });
});

restapi.listen(8080);