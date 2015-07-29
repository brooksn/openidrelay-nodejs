/**
 * Module dependencies.
 */

console.log("starting node with express");

var express = require('express');
var openidmethods = require('./openidmethods');
var static = require('serve-static');
//var methodOverride = require('method-override');

//var app = module.exports = express.createServer();
var app = express();

// Configuration

app.set('view engine', 'ejs');
app.use(require('body-parser')());
app.use(require('cookie-parser')());
app.use(require('express-session')({secret: '1234', resave: false, saveUninitialized: true}));
app.use(static(__dirname+'/public'));

/*
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});
*/

// Routes
app.get('/', function(req, res) {
    res.render('index', {
        title: 'Home',
        authenticated: req.session.auth,
        username: req.session.authname
    });
});

app.get('/login', function(req, res) {
    res.render('login', {
        title: 'Login'
    });
});

app.get('/logout', function(req, res) {
    req.session.auth = false;
    res.writeHead(302, {
        Location: '/'
    });
    res.end();
});

app.get('/membersonly', function(req, res) {
    if (req.session.auth) {
        res.render('membersonly', {
            title: "Members Only",
            username: req.session.authname
        });
    }
    else {
        res.writeHead(302, {
            Location: '/login'
        });
        res.end();
    }

});

app.get('/about', function(req,res){
   res.render('about', {title: 'About'}); 
});

app.get('/authenticate', openidmethods.authenticate);

app.get('/verify', openidmethods.verify);
var port = process.env.port || process.env.PORT || 3000;

app.listen(port);

/*
// Only listen on $ node app.js
if (!module.parent) {
    //app.listen(process.env.PORT);
    //console.log("Express server listening on port %d", app.address().port);
}
*/