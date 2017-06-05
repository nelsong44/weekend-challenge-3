// requires
var express = require( 'express' );
var app = express();
var path = require( 'path' );
var bodyParser = require( 'body-parser' );
var port = 8000;
// require routes
var index = require('./routes/index');
var task = require('./routes/task');

// required in routes files: (not needed in server.js if in routes files)
// var pg = require('pg');
// object to send to db
// var config = {
//   database: 'toDoDb',
//   host: 'localhost',
//   port: 5432, // default localhost for postgresql db
//   max: 12
// };
// var pool = new pg.Pool( config );

// uses
app.use(express.static( 'public' ) );
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/task', task);

// listen
app.listen( port,  function(){
  console.log('server up on ' + port);
});

// base url
app.get('/', function(req, res){
  console.log('connected');
  res.sendFile( path.resolve( 'public/views/index.html' ) );
});
