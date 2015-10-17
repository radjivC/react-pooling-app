var express = require('express');
var _ = require('underscore');
var app = express();

var connections = [];
var title = "Untitled Presentation";
var audience = [];
var speaker = {};


app.use(express.static('./public'));
app.use(express.static('./node_modules/bootstrap/dist'));

var server = app.listen(3000);
var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){

  socket.once('disconnect', function(){

    var member = _.findWhere(audience, {id : this.id });

    if (member){
      audience.splice(audience.indexOf(member), 1);
      io.sockets.emit('audience', audience);
      console.log("Left: %s (%s audience member)", member.name, audience.length );
    }

    connections.splice(connections.indexOf(socket), 1);
    socket.disconnect();
    console.log("Disconnect socket: %s socket remaining.", connections.length);
  });

  socket.on('join', function(payload){
    var newMember ={
      id:this.id,
      name: payload.name,
      type: 'member'
    };
    this.emit('joined', newMember);
    audience.push(newMember);
    io.sockets.emit('audience', audience);
    console.log("Audience Joined: %s", payload.name);
  });

  socket.on('start', function(payload){
    speaker.name =payload.name;
    speaker.id = this.id;
    speaker.type = 'speaker';
    this.emit('joined',speaker);
    console.log("Presentation started '%s' by  %s", title, speaker.name);
  });

  socket.emit('welcome', {
    title: title
  });

  connections.push(socket);
  console.log("connected: %s sockets", connections.length);
});

console.log("Polling server is runing at 'http://localhost:3000'");
