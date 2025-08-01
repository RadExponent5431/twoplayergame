// -*- coding: utf-8 -*-
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

let players = {}; // { socketId: { x, y } }

function randomPosition() {
  return {
    x: Math.floor(Math.random() * 400) + 50,
    y: Math.floor(Math.random() * 300) + 50,
  };
}

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  players[socket.id] = randomPosition();
  io.emit('players', players);

  socket.on('move', (direction) => {
    if (!players[socket.id]) return;
    const speed = 5;
    switch (direction) {
      case 'w': players[socket.id].y -= speed; break;
      case 'a': players[socket.id].x -= speed; break;
      case 's': players[socket.id].y += speed; break;
      case 'd': players[socket.id].x += speed; break;
    }
    // Begrenze Positionen auf Spielfeld (0..500, 0..400)
    players[socket.id].x = Math.max(0, Math.min(550, players[socket.id].x));
    players[socket.id].y = Math.max(0, Math.min(400, players[socket.id].y));

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
