
var express = require('express');

var mongoose = require('mongoose');
var flash = require('connect-flash');
var passport = require('passport');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

mongoose.connect(configDB.url);
require('./config/passport')(passport); // pass passport for configuration
var pacienteDAO = require('./Daos/pacienteDao');

var fs = require('fs');
//var cv = require('cloudcv-backend');
var request = require('request');
var NodeCache = require("node-cache");
var myCache = new NodeCache();

var http = require('http');
var path = require('path');

var appSet = express();
var util = require('util');



var io = require('socket.io');
var server = require('http').createServer(appSet);
//var api = require('./routes/api.js');
//var routes = require('./routes');

appSet.set('views', __dirname + '/views');
//appSet.engine('html', require('ejs').renderFile);
appSet.set('view engine', 'ejs'); // set up ejs for templating

/*appSet.set('view engine', 'html');
appSet.set('view options', { pretty: true });*/

appSet.use(morgan('dev'));
appSet.use(cookieParser());
appSet.use(bodyParser.json()); // get information from html forms
appSet.use(bodyParser.urlencoded({ extended: true }));

appSet.use(express.favicon());
//appSet.use(express.logger('dev'));

//appSet.use(express.bodyParser());
appSet.use(session({ secret: '2089' }));//sesion secret
appSet.use(passport.initialize());
appSet.use(passport.session()); // persistent login sessions
appSet.use(flash()); // use connect-flash for flash messages stored in session

require('./routes/routes.js')(appSet, passport); // load our routes and pass in our app and fully configured passport
require('./routes/routesAtendente.js')(appSet, passport);
require('./routes/routesHistorico.js')(appSet, passport); 

//appSet.use(express.methodOverride());
//appSet.use(appSet.router);
appSet.use(express.static(path.join(__dirname, 'public')));



/*appSet.get('/', function (req, res)
{   
    handleApiRequest("dominantColors", "http://104.131.163.197:3000/images/test.png");
    res.render('index');
});

appSet.get('/login', function (req, res) {
    res.render('login');
})

appSet.get('/adm', function (req, res) {
    res.render('adm');
})

appSet.get('/cadastrouserrobo', function (req, res) {
    res.render('cadastrouserrobo');
})

appSet.get('/imagem', function (req, res) {    
    res.render('imagem');
});

*/

server.listen(3000);
io = io.listen(server);

/* Peer Server */
var ip = require('ip');
var port = 9000;

var PeerServer = require('peer').PeerServer;
var server = new PeerServer({ port: port, allow_discovery: true });

server.on('connection', function (id) {
    console.log('new connection with id ' + id);
});

server.on('disconnect', function (id) {
    console.log('disconnect with id ' + id);
});

console.log('peer server running on ' + ip.address() + ':' + port);

var global;

var visitas = 0;

io.sockets.on('connection', function (socket) {    
    
    socket.on('cima', function (url) {
        var val = url.split('/');
        var idPaciente = val[val.length - 1];
        pacienteDAO.findById(idPaciente, function (paciente) {
            console.log("cima");
        });
    });
    
    socket.on('baixo', function (url) {
        var val = url.split('/');
        var idPaciente = val[val.length - 1];
        pacienteDAO.findById(idPaciente, function (paciente) {
            console.log("baixo");
        });
                                    
    });
    
    socket.on('direita', function (url) {
        var val = url.split('/');
        var idPaciente = val[val.length - 1];
        pacienteDAO.findById(idPaciente, function (paciente) {
            console.log("direita");
        });
                                            
    });
    
    socket.on('esquerda', function (url) {
        var val = url.split('/');
        var idPaciente = val[val.length - 1];
        pacienteDAO.findById(idPaciente, function (paciente) {
            console.log("esquerda");
        });                                            
    });
        
    socket.on('disconnect', function () {
                
    });
});
