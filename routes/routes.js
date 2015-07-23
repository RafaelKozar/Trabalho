var roboDAO = require('../Daos/roboDao');
var pacienteDAO = require('../Daos/pacienteDao');
var userDAO = require('../Daos/userDao');

var User = require('./models/user.js');


var pacientesVazio = undefined;
var robosVazio = undefined;
var usersVazio = undefined;
var messageVazio = undefined;



module.exports = function (app, passport) {
    
    app.get('/', isLoggedIn, function (req, res) {
        res.render('index');
    });
    
    app.get('/adm', function (req, res) {
        res.render('adm');
    });
    
    
    app.get('/camera', function (req, res) {
        res.render('camera.ejs');
    });
    
    //// Usu�rio /////
    
    ///CadastrarUser////  - GET
    app.get('/cadastraruser', isAdm, function (req, res) {
        res.render('cadastraruser.ejs', { user : usersVazio });
    });
    
    ///AtualizarUsers//// - GET    SER�  DEPRECIADO
    app.get('/cadastraruser/:id', isAdm, function (req, res) {        
        var idUser = req.params.id;
        if (idUser) {
            var user = userDAO.findById(idUser, function (user) {
                res.render('cadastraruser.ejs', { user : user });
            });
        }        
    });
    
    
    ///CadastrarUser//// - POST    ///n�o deixar cadastrar emails j� existentes
    app.post('/cadastraruser', isAdm, function (req, res) {
        var idUser = req.body.id;
        if (idUser) {
            var retorno = userDAO.update(req, idUser, function (user) {
                res.redirect('/listarusers');
            });
        }
        else {
            var retorno = userDAO.cadastrar(req);
            res.redirect('/listarusers');
        }
    });
    
    
    ///ListarUsers//// - GET
    app.get('/listarusers', isAdm, function (req, res) {
        var users = userDAO.listarUsersNoAdm(function (users) {
            if (users)
                res.render('listarusers.ejs', { dados : users });
            else
                res.render('listarusers.ejs', { dados : usersVazio });
        });
    });
    
    
    ///AtualizarUsers//// - GET    SER�  DEPRECIADO
    app.get('/atualizaruser/:id', isAdm, function (req, res) {
        var idUser = req.params.id;
        if (idUser) {
            var user = userDAO.findById(idUser, function (user) {
                res.render('atualizaruser.ejs', { user : user });
            });
        }
    });
    
    
    ///DeletarUsers//// - GET
    app.get('/deletaruser/:id', isAdm, function (req, res) {
        var idUser = req.params.id;
        if (idUser) {
            var user = userDAO.remove(idUser, function (msg) {
                res.redirect('/listarusers');
            });
        }
    })
    
    
    
    
    /////////Paciente/////////
    
    
    ///CadastrarPacientes//// - GET
    /*app.get('/cadastrarpaciente', isLoggedIn, function (req, res) {
        var robos = roboDAO.listarRobos(function (robos) {
            if (robos)
                res.render('cadastrarpaciente.ejs', { robos : robos, paciente : pacientesVazio });
            else
                res.render('cadastrarpaciente.ejs', { robos : robosVazio, paciente : pacientesVazio });
        });
    });*/
    app.get('/cadastrarpaciente', function (req, res) {
        //  res.render('cadastrarpaciente.ejs', { robos : robosVazio, paciente : pacientesVazio });
        //ver se aparece robos
        var robos = roboDAO.listarRobos(function (robos) {
            res.render('cadastrarpaciente.ejs', { paciente : pacientesVazio, robos : robos });
            /*if (robos)
                res.render('cadastrarpaciente.ejs', { robos : robos, paciente : pacientesVazio });
            else
                res.render('cadastrarpaciente.ejs', { robos : robosVazio, paciente : pacientesVazio });*/
        });
    });
    
    
    ///CadastrarPacientes//// - POST
    app.post('/cadastrarpaciente', isLoggedIn, function (req, res) {        
        //Devo enviar junto req.user
        if (idPaciente) {
            var retorno = pacienteDAO.update(req, idPaciente, function (paciente) {
                res.redirect('/listarpacientes');
            });
        }
        else {
            var retorno = pacienteDAO.cadastrar(req);
            res.redirect('/listarpacientes');
        }
    });
    
    
    ////CdastrarPaciente///
    app.get('/cadastrarpaciente/:id', isAdm, function (req, res) {        
        var idPaciente = req.params.id;
        if (idPaciente) {
            var paciente = pacienteDAO.findiById(idPaciente, function (paciente) {
                var robo = roboDAO.listarRobos(function (robo) {
                    if (paciente && robo) res.render('atualizarpaciente.ejs', { paciente : paciente, robos : robo });
                    else res.render('atualizarpaciente.ejs', { paciente : pacientesVazio, robos : robosVazio });
                });
                              
            });
        }
    });
    
    ///ListarPacientes//// - GET
    /*Para cada paciente eu tenho um user e um robo atrelado*/
    app.get('/listarpacientes', isLoggedIn, function (req, res) {
        var pacientes = pacienteDAO.listarPacientes(req.user, function (pacientes) {
                var users = userDAO.listarUsers(function (users) { //deve listar users n�o adm
                    if (pacientes && users)
                        res.render('listarpacientes.ejs', { pacientes : pacientes, users : users });
                    else if (pacientes)
                        res.render('listarpacientes.ejs', { pacientes: pacientes, users : usersVazio });
                    else
                        res.render('listarpacientes.ejs', { pacientes: pacientesVazio, users : usersVazio });
                });           
        });
    });
    
    
    ////////SER� DEPRECIADO//////
    app.get('/atualizarpaciente/:id', isAdm, function (req, res) {
        
        var idPaciente = req.params.id;
        if (idPaciente) {
            var paciente = pacienteDAO.findById(idPaciente, function (paciente) {
                var robo = roboDAO.listarRobos(function (robo) {
                    if (paciente && robo) res.render('atualizarpaciente.ejs', { paciente : paciente, robo : robo });
                    else res.render('atualizarpaciente.ejs', { paciente : pacientesVazio, robo : robosVazio });
                });                              
            });
        }
    });
    
    app.get('/deletarpaciente/:id', isLoggedIn, function (req, res) {
        var idPaciente = req.params.id;
        //if idRobo call methods to get robo
        if (idPaciente) {
            var paciente = pacienteDAO.remove(idPaciente, function (msg) {
                if (msg) res.redirect('/listarpacientes');
                else res.redirect('/listarpacientes');                
            });
        }
    })
    
    
    //////////Robo//////////
    
    
    ////AtualizarRobo/////  -GET    ///SER� DEPRECIADO
    app.get('/atualizarrobo/:id', isAdm, function (req, res) {
        
        var idRobo = req.params.id;
        if (idRobo) {
            var robo = roboDAO.findById(idRobo, function (robo) {
                if (robo) res.render('atualizarrobo.ejs', { robo : robo, message : "" });
                else {
                    var robo = [{ nome : "nao" }];
                    if (robo) res.render('atualizarrobo.ejs', { robo : robo, message : "" });
                }
            });
        }
    });
    
    
    ////DeletarRobo/////  -GET
    app.get('/deletarrobo/:id', isAdm, function (req, res) {
        var idRobo = req.params.id;
        if (idRobo) {
            var robo = roboDAO.remove(idRobo, function (msg) {
                if (msg) res.redirect('/listarrobos');
                else {
                    var robo = [{ nome : "nao" }];
                    res.redirect('/listarrobos');
                }
            });
        }
    })
    
    
    ////CadastarRobo/////  -GET
    app.get('/cadastrarrobo/:id', isAdm, function (req, res) {
        var idRobo = req.params.id;
        if (idRobo) {
            var robo = roboDAO.findById(idRobo, function (robo) {
                if (robo == 'err') res.render('cadastrarrobo.ejs', { message : req.flash('message', 'robo n�o encontrado'), robo : robosVazio });
                else if (robo) res.render('atualizarrobo.ejs', { robo : robo, message : "" });
                else res.render('atualizarrobo.ejs', { robo : robosVazio, message : "" });
            });
        } else res.render('cadastrarrobo.ejs', { message : "", robo : robosVazio });
    });
    
    
    ////CadastarRobo/////  -GET
    app.get('/cadastrarrobo', isAdm, function (req, res) {
        res.render('cadastrarrobo.ejs', { message : "", robo : robosVazio });
    });
    
    
    ////CadastarRobo/////  -POST
    app.post('/cadastrarrobo', isAdm, function (req, res) {
        var idRobo = req.body.id;
        if (idRobo) {
            roboDAO.update(req, idRobo, function (robo) {
                res.redirect('/listarrobos');
            });
        }
        else {
            var retorno = roboDAO.cadastrar(req);
            console.log(retorno);
            res.redirect('/listarrobos');
        }
    });
    
    
    ////ListarRobo/////  -GET
    app.get('/listarrobos', isAdm, function (req, res) {
        var robos = roboDAO.listarRobos(function (robos) {
            res.render('listarrobos.ejs', { dados : robos })
        });
    });
    
    
    //// LOGOUT /////
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/login');
    });
    

    app.get('/login', function (req, res) {
        res.render('login', { message: req.flash('loginMessage') });
    });
    

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/listarpacientes', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
    
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    
    res.redirect('/login');
}

function isAdm(req, res, next) {
    if (req.isAuthenticated())
        if (req.user.adm)
            return next();
        else
            res.redirect('/index');
    res.redirect('/login');
}
