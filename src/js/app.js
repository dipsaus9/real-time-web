var socket = io();

var main = document.querySelector('main');
var you = '';
if(main.classList.contains('home')){
  var form = document.querySelector('form');
  var input = document.querySelector('input[type="text"]');

  socket.on('connected', function(id){
    let userNames = [];
    let users = [];
    for(let i = 0; i < id.length; i++){
      userNames.push(id[i].name);
      users.push(id);
    }
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(input.value !== '' && input.value.length > 4){
        let index = userNames.indexOf(input.value);
        if(index > -1){
          console.log('gebruikers naam bestaat al');
        }
        else{
          socket.emit('log in', input.value);
          let selection = document.querySelector('.loged-in');
          var login = document.querySelector('.login');
          login.classList.add('inactive');
          selection.classList.add('active');
          you = input.value;
        }
      }
      else{
        console.log('voer een andere naam in');
      }
    });

    let ul = document.querySelector('.list');
    ul.innerHTML = '';
    for(let i = 0; i < id.length; i++){
      let list = document.createElement('li');
      let listText = document.createTextNode(id[i].name);
      let listButton = document.createElement('button');
      let listButtonText = document.createTextNode('Stuur een buzzer naar');
      listButton.appendChild(listButtonText);
      list.appendChild(listButton);
      list.addEventListener('click', function(){
        socket.emit('buzzer', id[i].name);
      });
      list.appendChild(listText);
      ul.appendChild(list);
    }
  });
  var audio = new Audio('/img/buzzer.mp3');
  socket.on('buzzer', function(id){
    if(id === you){
      console.log('whhaaah');
      document.body.classList.add('buzz');
      audio.play();
      setTimeout(function(){
        document.body.classList.remove('buzz');
      }, 500);
    }
  });
}
