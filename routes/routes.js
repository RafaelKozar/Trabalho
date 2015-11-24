var roboDAO = require('../Daos/roboDao');
var pacienteDAO = require('../Daos/pacienteDao');
var userDAO = require('../Daos/userDao');

var User = require('./models/user.js');


var pacientesVazio = undefined;
var robosVazio = undefined;
var usersVazio = undefined;
var messageVazio = undefined;





 function carregarotas (app, passport) {
    
    app.get('/', isLoggedIn, function (req, res) {
        res.redirect('/login')
    });
    
    app.get('/adm', isAdm, function (req, res) {
        res.render('adm');
    });
    
    app.get('/user', isLoggedIn, function (req, res) {
        res.render('user');
    });
    
    app.get('/camera/:id', function (req, res) {        
        res.render('camera.ejs');
    });   
    
    app.post('verificarrobo/:id', function (req, res) { 
        var idRobo = req.params.id;
        roboDAO.findById(idRobo, function (robo) {
            if (robo.atendente) {                
                res.json(0);
            }
            else if (robo == null) {
                res.json(-1);
            }
            else {
                roboDAO.atualizarPaciente(idRobo, function () {
                    res.json(1);
                });
            }
        });
    });
    
    
    //// Usuário /////
    
    ////EditarPerfilUser////   GET
    app.get('/editarperfiluser', isLoggedIn, function (req, res) {
        res.render('editarperfiluser.ejs', { user : req.user });
    });
    
    ////EditarPerfil////   GET
    app.get('/editarperfil', isAdm, function (req, res) {
        res.render('editarperfil.ejs', {user : req.user});
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
                if (user) {
                    user.password = "";
                    res.render('cadastraruser.ejs', { user : user });
                }
                else {

                }
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
                if (retorno)
                    req.session.message = "Usuário cadastrado com sucesso";
                else
                    req.session.message = "Este email já existe";
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
                res.end(JSON.stringify({ message : message }));
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
    
    
    ///VerificarNome///
    app.post('/verificarnome', function (req, res) {
        var url = req.body.url;
        url = url.split('/');
        var nome = req.body.nome;
        var tamanho = url.length;
        if (tamanho == 5) {
            var idRobo = url[4];
            roboDAO.verificarNome(idRobo, nome, function (message) {
                res.end(JSON.stringify({ message : message }));
            });
        } else {
            roboDAO.findByNome(nome, function (num) {
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
    app.get('/cadastrarpaciente', isAdm, function (req, res) {
        roboDAO.listarRobosDisponiveis(function (robos) {
            userDAO.listarUsersNoAdm(function (users) {                
                if (robos)
                    res.render('cadastrarpaciente.ejs', { paciente : pacientesVazio, robos : robos, users : users, user : req.user });
                else
                    res.render('cadastrarpaciente.ejs', { paciente : pacientesVazio, robos : robosVazio, users : users, user : req.user });   
            });
        });
    });
    

    ////CadastrarPaciente/// - GET (Atualizar Paciente)
    app.get('/cadastrarpaciente/:id', isAdm, function (req, res) {                
        pacienteDAO.findById(req.params.id, function (paciente) {
            roboDAO.listarRobosDisponiveis(function (robos) {
                userDAO.listarUsersNoAdm(function (users) {
                    if (robos && paciente && users)
                        res.render('cadastrarpaciente.ejs', { paciente : paciente, robos : robos, users : users, user : req.user });
                    else if (robos && users)
                        res.render('cadastrarpaciente.ejs', { paciente : paciente, robos : robos, users : users, user : req.user });
                    else if (paciente && users)
                        res.render('cadastrarpaciente.ejs', { paciente : paciente, robos : robosVazio, users : users, user : req.user });
                    else if (paciente && robos)
                        res.render('cadastrarpaciente.ejs', { paciente : paciente, robos : robosVazio, users : usersVazio, user : req.user });

                    else if (paciente)
                        res.render('cadastrarpaciente.ejs', { paciente : paciente, robos : robosVazio, users : usersVazio, user : req.user });
                    else if (users)
                        res.render('cadastrarpaciente.ejs', { paciente : pacientesVazio, robos : robosVazio, users : users, user : req.user });
                    else if (robos)
                        res.render('cadastrarpaciente.ejs', { paciente : pacientesVazio, robos : robos, users : usersVazio, user : req.user });

                    else
                        res.render('cadastrarpaciente.ejs', { paciente : pacientesVazio, robos : robosVazio, users : usersVazio, user : req.user });                    
                });
            });
        });        
    });
    
    
    ///CadastrarPacientes//// - POST
    ///*tentar atualizar, caso não seja possível ele cadastra///
    app.post('/cadastrarpaciente', isLoggedIn, function (req, res) {
        var idPaciente = req.body.id;
        
        if (idPaciente && idPaciente != "0") {
            pacienteDAO.update(req, idPaciente, function (pacienteRetorno) {
                if (pacienteRetorno) req.session.message = "Paciente editado com sucesso";
            });        
        }else {
            pacienteDAO.cadastrar(req);
            req.session.message = "Paciente cadastrado com sucesso";
        }
            if (req.user.adm)
                res.redirect('/listarpacientes');
            else
                res.redirect('listarmeuspacientes');        
    });
    
    
    ///ListarPacientes//// - GET
    /*Para cada paciente eu tenho um user e um robo atrelado*/
    app.get('/listarpacientes', isAdm, function (req, res) {
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
                    res.render('listarrobos.ejs', { robo : robosVazio, message : "" });
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
    

    app.post('/listarrobosandroid', function (req, res) {        
        var robos = roboDAO.listarRobos(function (robos) {            
            res.json(robos);
        });
    });
    
    app.post('/verificarrobo', function (req, res) {
        var idRobo = req.params.idRobo;
        roboDAO.getStatus(idRobo, function (status) {
            if (status == 1)
                res.send("SIM");
            else
                res.send("NAO");
        });
    });
    
    app.post('/desconectarobo', function (req, res){
        var idRobo = req.params.idRobo;
        roboDAO.setStatus(idRobo);
    })
    
    
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
            res.redirect('/adm');
        else
            res.redirect('/user');
            /// Aqui o user faz referência ao usuário comum///
    });
    
    app.get('/adm', isAdm, function (req, res) {
        res.render('adm.ejs');
    });

    
    app.get('/')
    
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', { message: req.flash('loginMessage') });
    });
    
    
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    })); 

/*    app.get('/testar', function (req, res) {
        var red = roboDAO.listarRobosDisponiveis(function (robos) {
            
            res.redirect('/login');
        });
    });*/
};

module.exports = carregarotas;

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






/*app.get('/index2', function (req, res) {
        res.render('index2');
    });*/

    /*  app.get('/camera2/:id', function (req, res) {
        res.render('camera2.ejs');
    });*/

    /*app.get('/camera5', function (req, res) {
        res.render('camera5.ejs');
    });*/ 

    ////EditarPerfil////   GET
    /*app.get('/editarperfil', isAdm, function (req, res) {
        res.render('editarperfil.ejs', {user : req.user});
    });
    
    
    ////EditarPerfilUser////   GET
    app.get('/editarperfiluser', isLoggedIn, function (req, res) {
        res.render('editarperfiluser.ejs', { user : req.user });
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
    }); */

    ///AtualizarUsers//// - GET    SERÁ  DEPRECIADO
   /* app.get('/atualizaruser/:id', isAdm, function (req, res) {
        var idUser = req.params.id;
        if (idUser) {
            var user = userDAO.findById(idUser, function (user) {
                res.render('atualizaruser.ejs', { user : user });
            });
        }
    }); */

   
    //* Teste com Android **/

    /*app.post('/testeandroid', function (req, res) {
        console.log("cheguei");
        pacienteDAO.testeAndroid(function (pacientes) {
            res.json({ user: 'Tobi' });
        });
    });

    app.get('/testeandroid', function (req, res) {
        pacienteDAO.testeAndroid(function (pacientes) {
            res.json({ user: 'Tobi' });
        });
    }); */

    ////////SERÁ DEPRECIADO//////
   /* app.get('/atualizarpaciente/:id', isAdm, function (req, res) {
        
        var idPaciente = req.params.id;
        if (idPaciente) {
            var paciente = pacienteDAO.findById(idPaciente, function (paciente) {
                var robo = roboDAO.listarRobos(function (robo) {
                    if (paciente && robo) res.render('atualizarpaciente.ejs', { paciente : paciente, robo : robo });
                    else res.render('atualizarpaciente.ejs', { paciente : pacientesVazio, robo : robosVazio });
                });
            });
        }
    }); */