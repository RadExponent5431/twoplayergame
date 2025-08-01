// -*- coding: utf-8 -*-
const socket = io();

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let players = {};
let myId = null;

socket.on('connect', () => {
  myId = socket.id;
});

socket.on('players', (serverPlayers) => {
  players = serverPlayers;
  draw();
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const id in players) {
    const p = players[id];
    ctx.fillStyle = (id === myId) ? 'darkred' : 'red';
    ctx.fillRect(p.x, p.y, 50, 50);
  }
}

// Tastatursteuerung mit WASD
window.addEventListener('keydown', (e) => {
  if (['w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
    e.preventDefault();
    socket.emit('move', e.key.toLowerCase());
  }
});
