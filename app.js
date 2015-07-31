
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


var fs = require('fs');
var cv = require('cloudcv-backend');
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

var filters = {};

filters.histogram = function (image, callback) {
    try {
        
        cv.analyzeImage(image, function (error, result) {
            if (error) {
                
                return;
            }
            
            callback(null, result.histogram);
        });
    }
    catch (e) {
        console.error(e);
        
        callback(null);
    }
};

filters.dominantColors = function (image, callback) {
    
    try {
        console.log("entramos na func");
        cv.analyzeImage(image, function (error, result) {
            if (error) {
                console.log(error);
                console.log("analyze");
                return;
            }
            
            callback(null, result.intensity);
            console.log(result.intensity);
        });
    }
    catch (e) {
        console.error(e);
        
        callback(e);
    }
};



function handleApiRequest(filter, url) {
    
    console.log("API request", filter, url);
    
    // Construct request data
    var requestSettings = {
        method: 'GET',
        url: url,
        encoding: null
    };
    
    var handler = filters[filter];
    console.log(typeof handler);
    
    if (typeof handler !== 'function') {
        //res.end();
        console.log("!=funct");
    }
    else {
        var key = filter + url;
        
        myCache.get(key, function (err, value) {
            console.log(value);
            if (!err && value[key]) {
                //res.setHeader("Content-Type", "application/json");
                //res.send(value[key]);
                console.log("vish");
                console.log(value[key]);
            }
            else {
                console.log("11");
                request(requestSettings, 
                    function (error, response, body) {
                    console.log("22");
                    if (!error && response.statusCode == 200) {
                        console.log("33");
                        console.log(body);
                        handler(body, function (error, cachedResponse) {
                            console.log("34");
                            //  if (!error)
                            //      myCache.set(key, cachedResponse);
                            console.log("44");
                            //res.setHeader("Content-Type", "application/json");
                            //res.write(JSON.stringify(cachedResponse));
                            //res.end();
                        });
                    }
                    else {
                        console.log("Error loading " + url);
                        // res.end();
                    }
                });
            }
        });


    }
};

//io.sockets.on('conectar', function (socket){
//    socket
//};

var visitas = 0;

io.sockets.on('connection', function (socket) {
    visitas++;
    // Envia o total de visitas para o novo usuário.
    socket.emit('visits', visitas);
    // Envia o total de visitas para os demais usuários.
    socket.broadcast.emit('visits', visitas);
    
    socket.on('enviar', function (img) {
        data = img.replace(/^data:image\/png;base64,/, '');
        
        var filePath = '../public/images/test.png';
        
        fs.writeFile(filePath, data, 'base64', function (err) {
            if (err) {
                console.log('! Error saving PNG: ' + err);
            } else {
                console.log('> PNG file saved to: ' + filePath);
            }
        });
        
        
        handleApiRequest("dominantColors", "http://localhost:3000/images/test.png");
            
    });
    
    socket.on('disconnect', function () {
        visitas--;
        // Atualiza o total de visitas para os demais usuários.
        socket.broadcast.emit('message', visitas);
    });
});
