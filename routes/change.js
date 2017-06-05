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
router.post('/changeStatus', function(req,res) {
  console.log('changing task status');
  pool.connect(function(err, connection, done){
    if (err){
      console.log('error in connection', err);
      done();
      res.send( 400 );
      }
    else {
      console.log(req.body);
      connection.query("UPDATE to_do_table SET complete = $1 WHERE task = $2", [req.body.complete, req.body.status]);
      // "UPDATE to_do_table SET complete = 'complete' WHERE(task = '" + req.body.status + "')")
      console.log('task status changed in db');
      done();
      res.send('task status changed in db');
    } // end if statement
  }); // end pool connect
}); // end post

module.exports = router;
