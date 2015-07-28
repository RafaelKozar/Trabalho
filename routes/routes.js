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
    
    //// Usuário /////
    
    ///CadastrarUser////  - GET
    app.get('/cadastraruser', isAdm, function (req, res) {
        res.render('cadastraruser.ejs', { user : usersVazio });
    });
    
    ///AtualizarUsers//// - GET    SERÁ  DEPRECIADO
    app.get('/cadastraruser/:id', isAdm, function (req, res) {
        var idUser = req.params.id;
        if (idUser) {
            var user = userDAO.findById(idUser, function (user) {
                res.render('cadastraruser.ejs', { user : user });
            });
        }
    });
    
    
    ///CadastrarUser//// - POST    ///não deixar cadastrar emails já existentes
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
    
    
    ///AtualizarUsers//// - GET    SERÁ  DEPRECIADO
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
    
    
    ////CadastrarPaciente/// - GET
    app.get('/cadastrarpaciente/:id', function (req, res) {
        
        pacienteDAO.findById(req.params.id, function (paciente) {
            roboDAO.listarRobos(function (robos) {
                if (paciente && robos)
                    res.render('cadastrarpaciente.ejs', { paciente : paciente, robos : robos });
                else if(robos)
                    res.render('cadastrarpaciente.ejs', { paciente : pacientesVazio, robos : robos });
                else
                    res.render('cadastrarpaciente.ejs', { paciente : pacientesVazio, robos : robosVazio });
            });
        });
        
    });
    
    
    ///CadastrarPacientes//// - POST
    ///*tentar atualizar, caso não seja possível ele cadastra///
    app.post('/cadastrarpaciente', isLoggedIn, function (req, res) {
        var idPaciente = req.body.id;
        var paciente;
        pacienteDAO.update(req, idPaciente, function (pacienteRetorno) {
            pacienteDAO.listarPacientes(req.user, function (pacientesRetorno) {
                if (pacienteRetorno && pacientesRetorno)
                    res.render('listarpacientes.ejs', { message : "Paciente editado com sucesso", pacientes : pacientesRetorno });                
                else {
                    var retorno = pacienteDAO.cadastrar(req);
                    if (pacientesRetorno)
                        res.render('listarpacientes.ejs', { message : "Paciente cadastrado com sucesso", pacientes : pacientesRetorno });
                    else
                        res.render('listarpacientes.ejs', { message : "Paciente cadastrado com sucesso", pacientes : pacientesVazio });
                }
            });
        });
    });
    
    app.post
    
    ///ListarPacientes//// - GET
    /*Para cada paciente eu tenho um user e um robo atrelado*/
    app.get('/listarpacientes', isLoggedIn, function (req, res) {
        var pacientes = pacienteDAO.listarPacientes(req.user, function (pacientes) {
            var users = userDAO.listarUsers(function (users) { //deve listar users não adm
                if (pacientes && users)
                    res.render('listarpacientes.ejs', { pacientes : pacientes, users : users });
                else if (pacientes)
                    res.render('listarpacientes.ejs', { pacientes: pacientes, users : usersVazio });
                else
                    res.render('listarpacientes.ejs', { pacientes: pacientesVazio, users : usersVazio });
            });
        });
    });
    
    
    ////////SERÁ DEPRECIADO//////
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
    
    
    ////AtualizarRobo/////  -GET    ///SERÁ DEPRECIADO
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
               res.render('/listarrobos', {message : "deletado com sucesso"});               
            });
        }
    })
    
    
    ////CadastarRobo/////  -GET
    app.get('/cadastrarrobo/:id', isAdm, function (req, res) {
        var idRobo = req.params.id;
        if (idRobo) {
            var robo = roboDAO.findById(idRobo, function (robo) {
                
                if (robo) res.render('atualizarrobo.ejs', { robo : robo, message : "" });
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
