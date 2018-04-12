const express = require('express')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
const session = require('express-session');
const sharedsession = require('express-socket.io-session');

var routes = [
  {
    location: '/',
    name: 'home',
    baseFile: 'index',
  },
  {
    location: '/test',
    name: 'home',
    baseFile: 'index',
  },
];

const router = {
  init: function(){
    router.settings();
    app.use(session({ secret: 'dipsaus', cookie: { maxAge: 60000 }}));
    for(let i = 0; i < routes.length; i++){
      if(routes[i].baseFile){
        app.get(routes[i].location, function(req, res){
          var routePath = routes[i].baseFile + '.ejs';
          res.render(routePath, {data: routes[i].data});
        });
      }
      else{
        //no result page, creat 404
      }
    }
  },
  settings: function(){
    //use static files served from public folder
    app.use(express.static('public'))
    //user view engine ejs
    app.set('view engine', 'ejs');
    //get views from src/views folder
    app.set('views', 'src/views');
    app.use(session({
      secret: 'dipsaus',
      proxy: true,
      resave: true,
      saveUninitialized: true
    }));

  },
};

let userObj = [];
let userNames = [];
io.use(sharedsession(session));

io.on('connection', function(socket){
  console.log(socket.handshake.session);
  let id = socket.id;
  io.emit('connected', userObj);
  socket.on('log in', function(user){
    let double = false;
    let obj = {
      id: id,
      name: user
    };
    for(let i =  0; i < userObj.length; i++){
      if(id === userObj[i].id){
        let name = userObj[i].name;
        var index = userNames.indexOf(name);
        if(index > -1){
          userNames.splice(index, 1);
        }
        userObj[i].name = user;
        double = true;
      }
    }
    if(!double){
      userObj.push(obj);
    }
    userNames.push(user);
    io.emit('connected', userObj);
  });
  socket.on('disconnect', function(){
    for(let i =  0; i < userObj.length; i++){
      if(userObj[i].id === id){
        let name = userObj[i].name;
        var index = userNames.indexOf(name);
        if(index > -1){
          userNames.splice(index, 1);
        }
        userObj.splice(i, 1);
      }
    }
    io.emit('connected', userObj);
  });
});



http.listen(3004, function () {
   console.log('server is running on port 3004')
});


module.exports = router;
