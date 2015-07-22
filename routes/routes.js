var roboDAO = require('../Daos/roboDao');
var pacienteDAO = require('../Daos/pacienteDao');
var userDAO = require('../Daos/userDao');



var pacientesVazio = [{ nome : "" }];
var robosVazio = [{ nome : "nao" }];
var usersVazio = [{ nome : "---" }];

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
    
    
    app.get('/cadastraruser', isLoggedIn, function (req, res) {
        res.render('cadastraruser.ejs');
    });
    
    app.post('/cadastraruser', isLoggedIn, function (req, res) {
        var idUser = req.body.id;
        //if idUser call methods to get user
        if (idUser) {
            var retorno = userDAO.update(req, idUser, function (user) {
                res.redirect('listarusers');
            });
        }
        else {
            console.log(req.body.especializacao);
            var retorno = userDAO.cadastrar(req);
            res.redirect('/listarusers');
        }
    });
    
    app.get('/listarusers', isLoggedIn, function (req, res) {
        var users = userDAO.listarUsers(function (users) {
            if (users)
                res.render('listarusers.ejs', { dados : users })
            else
                res.render('listarusers.ejs', { dados : usersVazio })
        });
    });
    
    app.get('/atualizaruser/:id', function (req, res) {
        
        var idUser = req.params.id;
        //if idUser call methods to get user
        if (idUser) {
            var user = userDAO.findById(idUser, function (user) {
                var robo = roboDAO.listarRobos(function (robo) {
                    if (user && robo) res.render('atualizaruser.ejs', { user : user, robo : robo });
                    else res.render('atualizaruser.ejs', { user : usersVazio, robo : robosVazio });
                });
                              
            });
        }
    });
    
    app.get('/deletaruser/:id', isLoggedIn, function (req, res) {
        var idUser = req.params.id;
        //if idRobo call methods to get robo
        if (idUser) {
            var user = userDAO.remove(idUser, function (msg) {
                if (msg) res.redirect('/listarusers');
                else res.redirect('/listarusers');
                
            });
        }
    })
    
    
    
    
    /////Paciente/////
    
    app.get('/cadastrarpaciente', isLoggedIn, function (req, res) {
        var robos = roboDAO.listarRobos(function (robos) {
            if (robos)
                res.render('cadastrarpaciente.ejs', { dados : robos, message : req.flash('message', "") });
            else
                res.render('cadastrarpaciente.ejs', { dados : robosVazio, message : req.flash('message', "") });
        });
    });
    
    app.post('/cadastrarpaciente', isLoggedIn, function (req, res) {
        var idPaciente = req.body.id;
        //if idPaciente call methods to get paciente
        if (idPaciente) {
            var retorno = pacienteDAO.update(req, idPaciente, function (paciente) {
                res.redirect('listarpacientes');
               // res.render('cadastrarpaciente.ejs', { message : req.flash('message', retorno), paciente : paciente});
               //redirect para lista de de pacientes
            });
        }
        else {
            var retorno = pacienteDAO.cadastrar(req);
            res.redirect('listarpacientes');
            //res.render('cadastrarpaciente.ejs', { message : req.flash('message', retorno), paciente : paciente });
            //redirect para lista de de pacientes
        }
    
    });
    
    app.get('/listarpacientes', isLoggedIn, function (req, res) {
        var pacientes = pacienteDAO.listarPacientes(function (pacientes) {
            var users = userDAO.listarUsers(function (paciente) {
                if (pacientes && users)
                    res.render('listarpacientes.ejs', { dados : pacientes, users : users });
                else if (pacientes)
                    res.render('listarpacientes.ejs', { dados : pacientes, users : usersVazio });
                else
                    res.render('listarpacientes.ejs', { dados : pacientesVazio, users : usersVazio });
            });
        });
    });
    
    app.get('/atualizarpaciente/:id', function (req, res) {
        
        var idPaciente = req.params.id;
        //if idPaciente call methods to get paciente
        if (idPaciente) {
            var paciente = pacienteDAO.findById(idPaciente, function (paciente) {
                //   res.render('atualizarpaciente', { paciente : paciente }); //, robo : [{ nome : "nao", _id : "jui9943fs" }]});
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
    
    /*     /*    */
    /////Robo//////    
    
    app.get('/atualizarrobo/:id', function (req, res) {
        
        var idRobo = req.params.id;
        //if idRobo call methods to get robo
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
    
    app.get('/deletarrobo/:id', function (req, res) {
        var idRobo = req.params.id;
        //if idRobo call methods to get robo
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
    
    app.get('/cadastrarrobo', function (req, res) {
        var robo = [{ _id : "nao" }];
        res.render('cadastrarrobo.ejs', { message : "", robo : robo });
    });
    
    app.post('/cadastrarrobo', function (req, res) {
        var idRobo = req.body.id;
        //if idRobo call methods to get robo
        if (idRobo) {
            var robo = [{ _id : "nao" }];
            var retorno = roboDAO.update(req, idRobo, function (robo) {
                res.render('cadastrarrobo.ejs', { message : req.flash('message', retorno), robo : robo });
            });
        }
        else {
            var robo = [{ _id : "nao" }];
            var retorno = roboDAO.cadastrar(req);
            console.log(retorno);
            res.render('cadastrarrobo.ejs', { message : req.flash('message', retorno), robo : robo });
        }
    });
    
    /*app.post('/cadastrarrobo/:id', function (req, res) {
        var idRobo = req.params.id;
        //if idRobo call methods to get robo
        if (idRobo) {
            var retorno = roboDAO.update(idRobo);
            res.send({message : retorno});
        }
    });*/
    
    app.get('/listarrobos', function (req, res) {
        var robos = roboDAO.listarRobos(function (robos) {
            res.render('listarrobos.ejs', { dados : robos })
        });
    });
    
    app.get('/signup', function (req, res) {
        res.render('signup', { message: req.flash('signupMessage') });
    });
    
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
    
    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/login');
    });
    
    // show the login form
    app.get('/login', function (req, res) {
        res.render('login', { message: req.flash('loginMessage') });
    });
    
    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
    
    
    
    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function (req, res) {
        var user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save(function (err) {
            res.redirect('/login');
        });
    });


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    
    res.redirect('/login');
}
