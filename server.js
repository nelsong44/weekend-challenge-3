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
var task = require('./routes/task');
var change = require('./routes/change');
var erase = require('./routes/erase');

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
app.post('/newTask', task);

//request to retrieve task list from db to send to client
app.get('/taskList', task);

//request to delete task from db
app.post('/eraseTask', erase);

//request to change status of task
app.post('/changeStatus', change);
