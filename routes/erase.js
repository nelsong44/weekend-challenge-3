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

// requires
router.post('/eraseTask', function(req, res) {
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
}); // end post)

module.exports = router;
