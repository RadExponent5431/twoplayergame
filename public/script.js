// -*- coding: utf-8 -*-
const socket = io();
const btn = document.getElementById('btn');
const output = document.getElementById('output');

btn.onclick = () => {
  socket.emit('increase');
};

socket.on('players', (players) => {
  output.textContent = JSON.stringify(players, null, 2);
});
