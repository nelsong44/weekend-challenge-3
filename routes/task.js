// requires
var express = require('express');
var router = express.Router();
var pg = require('pg');
// object to send to db
var config = {
  database: 'toDoDb',
  host: 'localhost',
  port: 5432, // default localhost for postgresql db
  max: 12
};
var pool = new pg.Pool( config );

// requests
// request to get task from client and send to db
router.post('/newTask', function(req, res) {
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
router.get('/taskList', function(req, res) {
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

module.exports = router;
