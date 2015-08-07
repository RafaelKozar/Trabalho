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
    
    
    ////EditarPerfil////   GET
    app.get('/editarperfil', isAdm, function (req, res) {
        res.render('editarperfil.ejs', {user : req.user});
    });
    
    
    ////EditarPerfilUser////   GET
    app.get('/editarperfiluser', isLoggedIn, function (req, res) {
        res.render('editarperfil.ejs', { user : req.user });
    });


    ////EditarPerfil//// POST
    app.post('/editarperfil', isAdm, function (req, res) {
        req.user;
        userDAO.editaPefil(req, req.user._id, function (user) {
            if (user) {
                req.session.message = "perfil editado com sucesso";
                res.redirect('/listarpacientes');
                //res.render('editarperfil.ejs', { message : "perfil editado com sucesso", user : user })
            }
        });
    });
    
    
    ////EditarPerfilUser//// POST
    app.post('/editarperfiluser', isLoggedIn, function (req, res) {
        req.user;
        userDAO.editaPefil(req, req.user._id, function (user) {
            if (user) {
                req.session.message = "perfil editado com sucesso";
                res.redirect('/listarmeuspacientes');
                //res.render('editarperfil.ejs', { message : "perfil editado com sucesso", user : user })
            }
        });
    });
        

    ///CadastrarUser////  - GET
    app.get('/cadastraruser', isAdm, function (req, res) {
        res.render('cadastraruser.ejs', { user : usersVazio });
    });
    

    ///cadastraruser//// - GET    
    app.get('/cadastraruser/:id', isAdm, function (req, res) {
        var idUser = req.params.id;
        if (idUser) {
            var user = userDAO.findById(idUser, function (user) {
                user.password = "";
                res.render('cadastraruser.ejs', { user : user });
            });
        }
    });
        
    
    ///CadastrarUser//// - POST    ///não deixar cadastrar emails já existentes
    app.post('/cadastraruser', isAdm, function (req, res) {
        var idUser = req.body.id;
        userDAO.update(req, idUser, function (user) {
            if (user) req.session.message = "Usuário editado com sucesso";
            else {
                var retorno = userDAO.cadastrar(req);
                req.session.message = "Usuário cadastrado com sucesso";
            }
            res.redirect('/listarusers'); 
        });
    });
    
    
    ///VerificarEmail///
    app.post('/verficaremailuser', function (req, res) {
        var url = req.body.url;
        url = url.split('/');
        var email = req.body.email;      
        var tamanho = url.length;
        if (tamanho == 5) {
            var idUser = url[4];
            userDAO.verificaEmail(idUser, email, function (message) {
                res.end(JSON.stringify({ message : "true" }));
            });
        } else {            
            userDAO.findByEmail(email, function (num) {
                if (num == 0)
                    res.end(JSON.stringify({ message : "true" }));                
                else
                    res.end(JSON.stringify({ message : "false" }));
            });
        }
    });
    
    
    ///VerificarEmail///
    app.post('/verficaremailuser2', function (req, res) {
        var idUser = req.body.idUser;
        var email = req.body.email;
        userDAO.verificaEmail(idUser, email, function (message) {
            req.session.message = 
            res.end(JSON.stringify({ message : message }));
        }); 
    });

    
    ///ListarUsers//// - GET
    app.get('/listarusers', isAdm, function (req, res) {
        var users = userDAO.listarUsers(function (users) {
            if (req.session.message) {
                var msg = req.session.message;
                delete req.session.message;
            }
            if (users && msg)
                res.render('listarusers.ejs', { dados : users, message : msg });
            else if (users)
                res.render('listarusers.ejs', { dados : users });
            else if (msg)
                res.render('listarusers.ejs', { dados : usersVazio, message : msg });
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
                if (msg) req.session.message = "Deletado com sucesso";
                res.redirect('/listarusers');
            });
        }
    });
    
    
    
    
    /////////Paciente/////////
    
    
    ///CadastrarPacientes//// - GET    
    app.get('/cadastrarpaciente', isLoggedIn, function (req, res) {
        roboDAO.listarRobosDisponiveis(function (robos) {
            userDAO.listarUsersNoAdm(function (users) {                
                if (robos && users)
                    res.render('cadastrarpaciente.ejs', { paciente : pacientesVazio, robos : robos, users : users });
                else if (robos)
                    res.render('cadastrarpaciente.ejs', { paciente : pacientesVazio, robos : robos, users : usersVazio });
                else if (users)
                    res.render('cadastrarpaciente.ejs', { paciente : pacientesVazio, robos : robosVazio, users : users });
                else
                    res.render('cadastrarpaciente.ejs', { paciente : pacientesVazio, robos : robosVazio, users : usersVazio });
            });
            });
    });
    

    ////CadastrarPaciente/// - GET (Atualizar Paciente)
    app.get('/cadastrarpaciente/:id', isLoggedIn, function (req, res) {                
        pacienteDAO.findById(req.params.id, function (paciente) {
            roboDAO.listarRobos(function (robos) {
                userDAO.listarUsersNoAdm(function (users) {
                    if (paciente && robos )
                        res.render('cadastrarpaciente.ejs', { paciente : paciente, robos : robos, users : users });
                    else if (robos)
                        res.render('cadastrarpaciente.ejs', { paciente : pacientesVazio, robos : robos, users : users });
                    else
                        res.render('cadastrarpaciente.ejs', { paciente : pacientesVazio, robos : robosVazio, users : users });
                });
            });
        });        
    });
    
    
    ///CadastrarPacientes//// - POST
    ///*tentar atualizar, caso não seja possível ele cadastra///
    app.post('/cadastrarpaciente', isLoggedIn, function (req, res) {
        var idPaciente = req.body.id;
        pacienteDAO.update(req, idPaciente, function (pacienteRetorno) {
            if (pacienteRetorno) {
                req.session.message = "Paciente editado com sucesso";
            } else {
                pacienteDAO.cadastrar(req);
                req.session.message = "Paciente cadastrado com sucesso";
            }
            res.redirect('/listarpacientes');
        });
    });
    
    
    
    ///ListarPacientes//// - GET
    /*Para cada paciente eu tenho um user e um robo atrelado*/
    app.get('/listarpacientes', isLoggedIn, function (req, res) {
        var pacientes = pacienteDAO.listarPacientes(req.user, function (pacientes) {
            var users = userDAO.listarUsers(function (users) { //deve listar users não adm
                if (req.session.message) {
                    var mensagem = req.session.message;
                    delete req.session.message;
                }
                if (pacientes && users && mensagem)
                    res.render('listarpacientes.ejs', { pacientes : pacientes, users : users, message : mensagem });
                else if (pacientes && users)
                    res.render('listarpacientes.ejs', { pacientes: pacientes, users : users });
                else if (pacientes && mensagem)
                    res.render('listarpacientes.ejs', { pacientes: pacientes, users : users, message : mensagem });
                else if (pacientes)
                    res.render('listarpacientes.ejs', { pacientes: pacientes, users : users });
                else if (mensagem)
                    res.render('listarpacientes.ejs', { pacientes: pacientesVazio, users : users, message : mensagem });
                else
                    res.render('listarpacientes.ejs', { pacientes: pacientesVazio, users : users});
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
        if (idPaciente) {
            var paciente = pacienteDAO.remove(idPaciente, function (msg) {
                req.session.message = "Paciente deletado com sucesso";
                res.redirect('/listarpacientes');
            });
        }
    });
    
    
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
                req.session.message = "Robo deletado com sucesso";
                res.redirect('/listarrobos');
            });
        }
    })
    
    
    ////CadastarRobo/////  -GET
    app.get('/cadastrarrobo/:id', isAdm, function (req, res) {
        var idRobo = req.params.id;
        if (idRobo) {
            var robo = roboDAO.findById(idRobo, function (robo) {
                if (robo)
                    res.render('cadastrarrobo.ejs', { robo : robo, message : "" });
                else
                    res.render('cadastrarrobo.ejs', { robo : robosVazio, message : "" });
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
        roboDAO.update(req, idRobo, function (robo) {
            if (robo) req.session.message = "Robo editado com sucesso";
            else {
                roboDAO.cadastrar(req);
                req.session.message = "Robo cadastrado com sucesso";
            }
            res.redirect('/listarrobos');
        });
        
    });
    
    
    ////ListarRobo/////  -GET
    app.get('/listarrobos', isAdm, function (req, res) {
        var robos = roboDAO.listarRobos(function (robos) {
            if (req.session.message) {
                var msg = req.session.message;
                delete req.session.message;
            }
            if (msg)
                res.render('listarrobos.ejs', { dados : robos, message : msg });
            else
                res.render('listarrobos.ejs', { dados : robos });
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
        successRedirect: '/redireciona', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
    

    app.get('/redireciona', isLoggedIn, function (req, res) {
        if (req.user.adm)
            res.redirect('/listarpacientes');
        else
            res.redirect('/listarmeuspacientes');
    });

    
    /*
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', { message: req.flash('loginMessage') });
    });
    
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    })); */
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
            res.redirect('/login');
    res.redirect('/login');
}
