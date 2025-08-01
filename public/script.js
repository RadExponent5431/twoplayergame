// -*- coding: utf-8 -*-
const socket = io();

const btn = document.getElementById('btn');
const status = document.getElementById('status');
const scores = document.getElementById('scores');

let canClick = false;

btn.onclick = () => {
  if (!canClick) return;
  canClick = false;
  btn.disabled = true;
  btn.textContent = 'Clicked!';
  socket.emit('click');
};

socket.on('status', (msg) => {
  status.textContent = msg;
  if (msg === 'GO!') {
    btn.disabled = false;
    btn.textContent = 'Click me!';
    canClick = true;
  } else if (msg.startsWith('Player') || msg === 'Waiting for players...') {
    btn.disabled = true;
    btn.textContent = 'Wait...';
    canClick = false;
  } else {
    btn.disabled = true;
    btn.textContent = 'Wait...';
    canClick = false;
  }
});

socket.on('players', (players) => {
  let text = 'Scores:\n';
  for (const id in players) {
    text += `Player ${id.substring(0,5)}: ${players[id].score}\n`;
  }
  scores.textContent = text;
});
