const fs = require('fs');
const express = require('express');
const http = require('http');
const https = require('https');
const socketIo = require('socket.io');
const cors = require('cors');


const privateKey = fs.readFileSync('private.key', 'utf8');
const certificate = fs.readFileSync('certificate.crt', 'utf8');

const credentials = { key: privateKey, cert: certificate };

const app = express();
const server = https.createServer(credentials, app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.static('public'));


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join', (room) => {
    socket.join(room);
    const roomSize = io.sockets.adapter.rooms.get(room)?.size || 0;

    console.log(roomSize);
    if (roomSize === 1) {
      console.log("Created and ready");
      socket.emit('created', room);
      io.to(room).emit('ready');
      console.log("Ready");
    } else if (roomSize === 2) {
      io.to(room).emit('ready');
    } else {
      socket.leave(room);
      socket.emit('full', room);
    }

    socket.on('offer', (data) => {
      socket.to(room).emit('offer', data);
    });

    socket.on('answer', (data) => {
      socket.to(room).emit('answer', data);
    });

    socket.on('candidate', (data) => {
      socket.to(room).emit('candidate', data);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
      socket.leave(room);
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



// server.js
// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
//
// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);
//
// app.use(express.static('public'));
//
// let readyUsers = [];
//
// io.on('connection', (socket) => {
//   console.log('a user connected');
//
//   socket.on('ready', () => {
//     console.log('User ready');
//     readyUsers.push(socket.id);
//
//     // When there are at least two users ready, notify them
//     if (readyUsers.length >= 2) {
//       io.to(readyUsers[0]).emit('ready');
//       io.to(readyUsers[1]).emit('ready');
//       readyUsers = []; // Reset the ready users list
//     }
//   });
//
//   socket.on('offer', (data) => {
//     console.log('Offer received');
//     socket.broadcast.emit('offer', data);
//   });
//
//   socket.on('answer', (data) => {
//     console.log('Answer received');
//     socket.broadcast.emit('answer', data);
//   });
//
//   socket.on('candidate', (data) => {
//     console.log('Candidate received');
//     socket.broadcast.emit('candidate', data);
//   });
//
//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//     readyUsers = readyUsers.filter(id => id !== socket.id); // Remove the disconnected user from the ready list
//   });
// });
//
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
//



// // server.js
// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
//
// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);
//
// app.use(express.static('public'));
//
// io.on('connection', (socket) => {
//   console.log('a user connected');
//
//   socket.on('offer', (data) => {
//     socket.broadcast.emit('offer', data);
//   });
//
//   socket.on('answer', (data) => {
//     socket.broadcast.emit('answer', data);
//   });
//
//   socket.on('candidate', (data) => {
//     socket.broadcast.emit('candidate', data);
//   });
//
//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });
// });
//
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
