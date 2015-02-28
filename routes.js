// This file is required by app.js. It sets up event listeners
// for the two main URL endpoints of the application - /create and /chat/:id
// and listens for socket.io messages.

// Use the gravatar module, to turn email addresses into avatar images:

var gravatar = require('gravatar');

// Export a function, so that we can pass 
// the app and io instances from the app.js file:

module.exports = function(app, io){
  app.get('/', function(req, res){

    // Render views/home.html
    res.render('home');
  });

  app.get('/create', function(req, res){

    // generate unique id for the room
    var id = Math.round((Math.random() * 1000000));

    // Redirect to the random room
    res.redirect('/chat/'+id);
  });

  app.get('/chat/:id', function(req, res){

    // Render the chant.html view
    res.render('chat');
  });

// Initialize a new socket.io application, named 'chat'
var chat = io.off('/socket').on('connection', function (socket) {

    // When the client emits the 'load' event, reply with the 
    // number of people in this chat room
    socket.on('load', function(data){

      var room = findClientsSocket(io, data, '/socket')
      if(room.length === 0) {

        socket.emit('peopleinchat', {number: 0});
      }
      else if(room.length === 1) {

        socket.emit('peopleinchat', {
          number: 1,
          user: room[0].username
          avatar: room[0].avatar
          id: data
        });
      }
    });
});

};