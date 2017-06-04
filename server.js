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
      var taskIntoDb = connection.query("INSERT INTO to_do_table (task) VALUES ('" + req.body.task + "')");
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
      //retrieve task list from db and send to client
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

//request to retrieve task from client to delete from db
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
      var deleteFromDb = connection.query("DELETE FROM to_do_table WHERE(task = '" + req.body.delete + "')");
      console.log('task successfully deleted from db');
      done();
      res.send('task successfully deleted from db');
    } // end if statement
}); // end pool connect
}); // end post

// if(checbox) {
// UPDATE todotable WHERE complete = 'null' VALUES(true);

//------------------------------------------------------------------
//app.gets and app.posts to access route files

// Here are the specific components for the challenge:
//
// Create a front end experience (e.g. a form) that allows a user to create a Task.
// When the Task is created, it should be stored inside of a database.
// Whenever a Task is created, the front end should refresh to show all tasks that need to be completed.
// Each Task should have an option to "Complete" or "Delete".
// When a Task is complete, its visual representation should change on the front end. For example, the background of the task container could change from gray to green. The complete option should be checked off. Each of these are accomplished in CSS, but will need to hook into logic to know whether or not the task is complete.
// Whether or not a Task is complete should also be stored in the database.
// Deleting a Task should remove it both from the front end as well as the database.
