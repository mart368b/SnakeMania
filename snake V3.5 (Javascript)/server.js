var express = require('express');
var app = express();
var path = require('path');
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.redirect('index.html');
});

// Starting server
var game_server = require('./private/js/game_server.js');
game_server.run(io);

http.listen(3000, function(){
  console.log('listening on *:3000');
});