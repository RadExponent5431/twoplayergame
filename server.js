const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

let players = {};

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  // Player joins
  players[socket.id] = { score: 0 };
  io.emit('players', players);

  socket.on('increase', () => {
    if (players[socket.id]) players[socket.id].score += 1;
    io.emit('players', players);
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    delete players[socket.id];
    io.emit('players', players);
  });
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
