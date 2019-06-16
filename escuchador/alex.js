var express = require('express');
var app = express();

var net = require('net');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var os = require('os');
var inter;

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
  for (var k2 in interfaces[k]) {
    var address = interfaces[k][k2];
    if (address.family === 'IPv4' && !address.internal) {
      addresses.push(address.address);
    }
  }
}


var HOST = 'localhost'; //'192.168.1.81';
var PORT = 4000;
server.listen(5000);

var web_sockets = [];

var messages = [
  {
    message: 'U2FsdGVkX19u71GAqe0SZS6mPYH7NaO3f0WI7p8VvoZteDJFL+gqk6UCnzi2KITK7QtaYRjOztDBtN6XPIe2dfqMOoUb90Mvrg3Wl+D8+eg=',
    idUser: 'Aveno',
    idLobby: 1
  }
]


app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


app.get('/messages', (req, resp) => {
  resp.send(messages)    
})


io.on('connection', function (socket) {
  web_sockets.push(socket)
  console.log("entre")

  socket.on('reconection', function (data) {
    io.emit('reconectUser');
  })

  socket.on('getMessages', function (data) {
    topicMessages = []
    messages.forEach(element => {
      if (element.idLobby === data.idLobby) {
        topicMessages.push = element
      }
    });
    io.emit('allMessages', topicMessages);
  })

  socket.on('message', function (data) {
    let newMessage = {
      message: data.message,
      idLobby: data.idLobby,
      idUser: data.idUser
    }
    messages.push(newMessage)
    io.emit('new-message', newMessage)
    console.log(messages)

  })

  socket.on('disconnect', function () {
    var idx = web_sockets.indexOf(socket);

    if (idx != -1) {
      web_sockets.splice(idx, 1);

    }
  });



  socket.on('end', function () {

  });

  socket.on('error', function () {

  });

  socket.on('timeout', function () {

  });

  socket.on('close', function () {

  });

});

io.on('error', function (err) {
  console.error(err)
});




net.createServer(function (sock) {
  console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
  sock.on('data', function (data) {
  });
}).listen(PORT, HOST)



