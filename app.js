
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




var server = require('http').createServer(appSet);
var io = require('socket.io')(server);
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


var usernames = {};
var numUsers = 0;

io.on('connection', function (socket) {
    
    console.log("conectou");
    
	//0 parar, 1 frente, 2 direita, 3 esquerda, 4 para atraz
    
    socket.on('enviar', function (commando) {
        console.log("huahauah");
    });
    
    
    socket.on('conectar', function (url) {
        var valor = url.split('/');
        var idPaciente = valor[valor.length - 1];
        pacienteDAO.findById(idPaciente, function (paciente) {
            socket.broadcast.emit(paciente.idRobo, {idPaciente : idPaciente});
        });
    });
    
    
    socket.on('msgPaciente', function (param){
        var idPaciente = param("idPaciente");
        var msg = param("mensagem");
        socket.broadcast.emit('msgToAtendente' + idPaciente, msg);
    })
    
    socket.on('msgAtendente', function (url, msg) {
        var valor = url.split('/');
        var idPaciente = valor[valor.length - 1];
        console.log(msg);
        pacienteDAO.findById(idPaciente, function (paciente) {
            var varmsg = paciente.idRobo + "mensagem";
            socket.broadcast.emit(varmsg, msg);
        });
    });

    socket.on('cima', function (url) {
        socket.broadcast.emit('vai');
        var val = url.split('/');
        var idPaciente = val[val.length - 1];		
        pacienteDAO.findById(idPaciente, function (paciente) {
            console.log('cima');            
            enviar(paciente.idRobo, { comando : 1, idRobo : paciente.idRobo });
        });
    });
    
    function enviar(idRobo, data){
        socket.broadcast.emit(idRobo, data); 
    }
    
    socket.on('baixo', function (url) {
        var val = url.split('/');
        var idPaciente = val[val.length - 1];		
        pacienteDAO.findById(idPaciente, function (paciente) {
            console.log('baixo');
            enviar(paciente.idRobo, { comando : 3, idRobo : paciente.idRobo }); 
        });
                                    
    });
    
    socket.on('direita', function (url) {
        var val = url.split('/');
        var idPaciente = val[val.length - 1];		
        pacienteDAO.findById(idPaciente, function (paciente) {
            console.log("direita");
            enviar(paciente.idRobo, { comando : 2, idRobo : paciente.idRobo });
        });
                                            
    });
    
    socket.on('esquerda', function (url) {
        var val = url.split('/');
        var idPaciente = val[val.length - 1];		
        pacienteDAO.findById(idPaciente, function (paciente) {            
            console.log("esquerda");
            enviar(paciente.idRobo, { comando : 3, idRobo : paciente.idRobo });
        });
    });
	
	socket.on('parar', function(url){
        var val = url.split('/');
        var idPaciente = val[val.length - 1];
        pacienteDAO.findById(idPaciente, function (paciente) {
            console.log("parar");
            enviar(paciente.idRobo, { comando : 0, idRobo : paciente.idRobo });
        });
    });
    
    socket.on('disconnect', function () {
                
    });
});