const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var request = require('request')
var mongoose = require('mongoose');
var router = require('./router');
var User = require('../db/userSchema');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var GOOGLE_CLIENT_ID = require('../auth-config.js').GOOGLE_CLIENT_ID;
var GOOGLE_CLIENT_SECRET = require('../auth-config.js').GOOGLE_CLIENT_SECRET;

const app = express();

// initialize socket
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(bodyParser());

// set headers to allow cross-origin requests

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

//initialize express-session and passport

app.use(session({ secret: 'leopard cat' }));
app.use(passport.initialize());
app.use(passport.session());

//serialize & deserialize user

passport.serializeUser(function(user, done) {
  console.log('SERIALIZE', user)
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  console.log('DESERIALIZE', id)
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Use the GoogleStrategy within Passport.
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
},
function(token, tokenSecret, profile, done) {
  console.log('profile', profile);
  console.log('email', profile.emails[0].value);
  User.find({ google_id: profile.id }, (err, user) => {
    console.log('user from google strategy', user);
    if (user.length === 0) {
      User.create({google_id: profile.id, displayName: profile.displayName, image: profile._json.image.url, email: profile.emails[0].value, created_sessions: [], accessible_sessions: [], comments: []}, (err, user) => {
        if (err) {
          console.log('error in insert user', err);
        } else {
          console.log('user saved!');
          console.log('user from google strategy', user);
          return done(err, user);
        }
      })
    } else{
      return done(err, user[0]);
    }
  });
}
));

// GET /auth/google

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

// GET /auth/google/callback
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    console.log('req.user in google auth callback function', req.user);
    console.log('SESSION', req.session.passport.user);
    res.redirect('/', 200, req.user);
  });

// send user to front end based on session

app.get ('/getUser', function(req, res) {
  console.log(req.session);
  User.find({ _id: req.session.passport.user }, (err, user) => {
    if (err) {
      console.log('error in getUser route', err);
    } else {
      console.log('get user success!', user)
      res.json(user);
    }
  })
});

// check for session for react router

app.get('/authenticate', function(req, res) {
  console.log('in authenticate route', req.session.passport.user);
  if(req.session.passport.user) {
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
})

// logout route
app.get('/logout', function(req, res){
  console.log('LOGOUT')
  req.logout();
  res.redirect('/login');
});

// implement express router

app.use('/', router);

// transpile and serve all static files using webpack

app.use('/static', express.static(path.join(__dirname, '../client/public')));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

//socket test

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('new comment', function(data){
    console.log('data received by socket', data)
    io.sockets.emit('socket comment', data);
  })
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


server.listen(3000, function () {
  console.log('Listening on port 3000');
})

exports.io = io;
