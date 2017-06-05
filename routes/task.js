// requires
var express = require('express');
var router = express.Router();
var pg = require('pg');
// object to send to db
var config = {
  database: 'toDoDb',
  host: 'localhost',
  port: 5432,
  max: 12
};
var pool = new pg.Pool( config );

// requests
// request to get task from client and send to db
router.post('/', function(req, res) {
  console.log(req.body); // new task object from client
  pool.connect( function( err , connection , done ){
    if (err){
      console.log('error in connection', err);
      done();
      res.send( 400 );
      }
    else {
      connection.query("INSERT INTO to_do_table (task) VALUES($1)", [req.body.task]);
      // previous syntax:
      // ("INSERT INTO to_do_table (task) VALUES('" + req.body.task + "')")

      console.log('task successfully stored in db and added to DOM');
      done();
      res.send('task successfully stored in db and added to DOM');
    } // end if statement
}); // end pool connect
}); //end post

//request to retrieve task list from db to send to client
router.get('/', function(req, res) {
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
router.delete('/', function(req, res) {
  console.log('deleting task from db');
  pool.connect( function( err , connection , done ){
    if (err){
      console.log('error in connection', err);
      done();
      res.send( 400 );
      }
    else {
      console.log(req.body);
      connection.query("DELETE FROM to_do_table WHERE id = $1", [req.body.delete]);
      console.log('task successfully deleted from db');
      done();
      res.send('task successfully deleted from db');
    } // end if statement
}); // end pool connect
}); // end post)

//request to change task status based on checkbox click
router.put('/', function(req,res) {
  console.log('changing task status', req.body);
  pool.connect(function(err, connection, done){
    if (err){
      console.log('error in connection', err);
      done();
      res.send( 400 );
      }
    else {
      console.log(req.body);
      connection.query("UPDATE to_do_table SET complete = $1 WHERE id = $2", [req.body.complete, req.body.status]);
      // .then(function(response){
      //   console.log('checkbox: ', response);
      // });
      // "UPDATE to_do_table SET complete = 'complete' WHERE(task = '" + req.body.status + "')")
      console.log('task status changed in db');
      done();
      res.send('task status changed in db');
    } // end if statement
  }); // end pool connect
}); // end post

module.exports = router;
