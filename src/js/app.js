var socket = io();

var form = document.querySelector('form');
var input = document.querySelector('input[type="text"]');

form.addEventListener('submit', function(e){
  e.preventDefault();
  socket.emit('chat message', input.value);
  input.value = '';
});

socket.on('chat message', function(msg){
  console.log(msg);
});
