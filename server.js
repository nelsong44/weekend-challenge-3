// requires
var express = require( 'express' );
var app = express();
// var index = require('./routes/index');
var path = require( 'path' );
var bodyParser = require( 'body-parser' );
var pg = require('pg');
var port = 8000;
// object to send to db
var config = {
  database: 'toDoDb',
  host: 'localhost',
  port: 5432, // default localhost for postgresql db
  max: 12
};
var pool = new pg.Pool( config );

// uses
app.use(express.static( 'public' ) );
app.use(bodyParser.urlencoded( { extended: true } ) );
// app.use(bodyParser.json());

// listen
app.listen( port,  function(){
  console.log('server up on ' + port);
});

// base url
app.get('/', function(req, res){
  console.log('connected');
  res.sendFile( path.resolve( 'public/views/index.html' ) );
});

// request to get task from client and send to db
app.post('/newTask', function(req, res) {
  console.log(req.body); // new task object from client
  pool.connect( function( err , connection , done ){
    if (err){
      console.log('error in connection', err);
      done();
      res.send( 400 );
      }
    else {
      connection.query("INSERT INTO to_do_table (task) VALUES($1)", [req.body.task]);

      // ("INSERT INTO to_do_table (task) VALUES('" + req.body.task + "')")

      console.log('task successfully stored in db and added to DOM');
      done();
      res.send('task successfully stored in db and added to DOM');
    } // end if statement
}); // end pool connect
}); //end post

//request to retrieve task list from db to send to client
app.get('/taskList', function(req, res) {
  console.log('connected with db');
    var taskArray = [];
  pool.connect( function( err , connection , done ){
    if (err){
      console.log('error in connection', err);
      done();
      res.send( 400 );
    }
    else {
      var taskData = connection.query('SELECT * FROM to_do_table');
      // push info from db into array
      taskData.on( 'row', function(row){
        taskArray.push(row);
      }); // end push
      taskData.on( 'end', function(){
        done();
        res.send(taskArray);
      }); // end
    } // end if statement
  }); // end pool connect
}); // end get

//request to delete task from db
app.post('/deleteTask', function(req, res) {
  console.log('deleting task from db');
  pool.connect( function( err , connection , done ){
    if (err){
      console.log('error in connection', err);
      done();
      res.send( 400 );
      }
    else {
      console.log(req.body);
      connection.query("DELETE FROM to_do_table WHERE task = $1", [req.body.delete]);
      console.log('task successfully deleted from db');
      done();
      res.send('task successfully deleted from db');
    } // end if statement
}); // end pool connect
}); // end post

//request to change status of task
app.post('/changeStatus', function(req,res) {
  console.log('changing task status');
  pool.connect(function(err, connection, done){
    if (err){
      console.log('error in connection', err);
      done();
      res.send( 400 );
      }
    else {
      console.log(req.body);
      connection.query("UPDATE to_do_table SET complete = $1 WHERE task = $2", ['complete', req.body.status]);
      // "UPDATE to_do_table SET complete = 'complete' WHERE(task = '" + req.body.status + "')")
      console.log('task status changed in db');
      done();
      res.send('task status changed in db');
    } // end if statement
  }); // end pool connect
}); // end post
