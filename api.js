// var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database('data/monitor');

var Pool = require('pg').Pool;

var config = {
  //host: 'localhost',
  user: 'pavan',
  password: 'pavan',
  database: 'monitor',
};

process.on('unhandledRejection', function(e) {
  console.log(e.message, e.stack)
})

var pool = new Pool(config)


//pool.query("DROP TABLE IF EXISTS counts");
pool.query("CREATE TABLE IF NOT EXISTS counts (id SERIAL, username TEXT, totalCount INTEGER DEFAULT 1)");

var express = require('express');
var restapi = express();
var bodyParser = require('body-parser');
restapi.use( bodyParser.json() );       // to support JSON-encoded bodies
restapi.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// To fetch the list of notes from the sqlite database
restapi.get('/list', function(req, res){
  console.log("list api called");
	var result;
	pool.query("SELECT * FROM counts", function(err, rows) {
      //console.log(JSON.stringify(rows));
	  res.end(JSON.stringify(rows.rows));
    });
});

restapi.get('/', function(req, res){
  console.log("update api called");
  pool.query("UPDATE counts SET totalCount = totalCount + 1 WHERE username = $1", [req.query.username], function(err, affectedRows){
      if (err) console.log(err);
      if(!affectedRows.rowCount){
        pool.query("INSERT into counts(username, totalCount) values($1, 1)", [req.query.username], function(err){
          if (err) console.log(err);
        });
      }
    });
    res.json({ "status" : "done" });
});

restapi.get('/ca701625c04e4b73f8f761fa69b8dde7', function(req, res){
  console.log("delete api called");
    pool.query("DELETE FROM counts WHERE username = $1", [req.query.username], function(err, affectedRows){
      console.log(err);
    });
    res.json({ "status" : "done" });
});

var server_port = process.env.PORT || 8080
var server_ip_address = process.env.IP || '127.0.0.1'
 
restapi.listen(server_port, function () {
  console.log( "Listening on " + server_ip_address + ", port " + server_port )
});