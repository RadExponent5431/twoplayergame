// -*- coding: utf-8 -*-
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

let players = {};
let gameStarted = false;
let currentRoundActive = false;
let winner = null;

function startRound() {
  currentRoundActive = false;
  winner = null;
  io.emit('status', 'Waiting for next round...');
  // Zufällige Wartezeit zwischen 2-5 Sekunden bis "GO"
  const delay = 2000 + Math.random() * 3000;
  setTimeout(() => {
    if (!gameStarted) return;
    currentRoundActive = true;
    io.emit('status', 'GO!');
  }, delay);
}

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  players[socket.id] = { score: 0 };
  io.emit('players', players);

  if (!gameStarted && Object.keys(players).length >= 2) {
    gameStarted = true;
    io.emit('status', 'Game starting soon...');
    setTimeout(startRound, 3000);
  }

  socket.on('click', () => {
    if (!currentRoundActive || winner) return;
    // Wer zuerst klickt bekommt Punkt
    winner = socket.id;
    players[winner].score += 1;
    io.emit('status', `Player ${winner.substring(0, 5)} wins the round!`);
    io.emit('players', players);
    currentRoundActive = false;

    if (players[winner].score >= 5) {
      io.emit('status', `Player ${winner.substring(0, 5)} wins the game! 🎉`);
      gameStarted = false;
      // Reset nach 5 Sekunden
      setTimeout(() => {
        for (const id in players) players[id].score = 0;
        io.emit('players', players);
        io.emit('status', 'New game starting...');
        gameStarted = true;
        setTimeout(startRound, 3000);
      }, 5000);
    } else {
      // Neue Runde nach 3 Sekunden
      setTimeout(startRound, 3000);
    }
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    delete players[socket.id];
    io.emit('players', players);
    if (Object.keys(players).length < 2) {
      gameStarted = false;
      io.emit('status', 'Waiting for more players...');
    }
  });
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
