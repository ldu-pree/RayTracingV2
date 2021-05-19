var express = require('express');
var app = express();
var config = require('./backend/config.json');
var port = 3000;

// our router
var main = require('./routeHandlers/main');
app.use('/', main);

// start the server
app.listen(port, function() {
  console.log(config.PF.green+"App started on port: "+String(port).rainbow);
});