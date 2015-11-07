var User = require('../routes/models/user');
var pacienteDAO = require('./pacienteDao.js');
var moongose = require('mongoose');




var cadastrar = function (req) {
    var newUser = new User();    
    
    findByEmail(req.body.email, function (quantidade) {
        if (quantidade > 0) return false;
        else {
            newUser.nome = req.body.nome;
            newUser.email = req.body.email;
            newUser.telefone = req.body.telefone;
            newUser.especializacao = req.body.especializacao;
            
            if (req.body.administrador == true)
                newUser.adm = true;
            else
                newUser.adm = false;
            newUser.password = newUser.generateHash(req.body.password);
            
            
            newUser.save(function (err) {
                if (err) throw err;
                return 'cadastrado efetuado com sucesso';
            })
        };
    });
};

var findByEmail = function (email, callback) {
    User.find({ 'email' : email }, function (err, user) {
        if (!user) {
            callback(0);
            return;
        }
        if (err) throw err;
        else if (user instanceof Array) {
            callback(user.length);
            return;
        }
        else if (user) {
            callback(1);
            return;
        }
        
    });
};


var verificaEmail = function (idUser, email, callback) {
    User.find({ 'email' : email }, function (err, user) {
        if (!user || user.length == 0) {
            callback("true");
            return;
        }
        
        if (err) throw err;
        else if (user instanceof Array && user.length > 1) {
            callback("false");
            return;
        }

        ///Entra aqui caso exista 1 email igual para outro usuário 
        else if (user.length > 0) {
            User.findById(idUser, function (err, user2) {
                if (user2.email != user[0].email) {
                    callback("false");
                    return;
                }
                else if (user2.email == user[0].email) {
                    callback("true");
                    return;
                }
            });
        }
    });
}

var listarUsers = function (callback) {
    User.find({}, function (err, users) {
        if (!users) {
            callback(null);
            return;
        }
        if (err) throw err;
        callback(users);
    });
};


var listarUsersNoAdm = function (callback) {
    
    User.find({}, function (err, users) {
        if (!users) {
            callback(null);
            //return;
        }
        if (err) throw err;
        var arrayRetorno = [new User()];
        var cont = 0;
        for (var i = 0; i < users.length; i++) {
            if (!users[i].adm) {
                arrayRetorno[cont] = users[i];
                cont++;
            }
        }
        callback(arrayRetorno);
    });
};

var findByNome = function (nomepesquisa) {
    var nomeUser = new User();
    nomeUser.find({ 'nome' : nomepesquisa }, function (err, users) {
        if (err) throw err;
        else if (users) return users.length;
        else return 0;
    });
};

var findById = function (idUser, callback) {
    
    User.findById(idUser, function (err, user) {
        // if (err) callback('err');
        if (!user) {
            callback();
            return;
        }
        callback(user);
    });
}


var update = function (req, idUser, callback) {
    findByEmail(req.body.email, function (quantidadeDeEmails) {
        if (quantidadeDeEmails <= 1) {
            User.findById(idUser, function (err, user) {
                if (!user) {
                    callback(null);
                    return;
                }
                if (user.email != req.body.email && quantidadeDeEmails == 1) {
                    ///No caso para um email encontrado que é de outro user
                    callback(null);
                    return;
                }
                
                user.nome = req.body.nome;
                user.email = req.body.email;
                user.password = req.body.password;
                user.telefone = req.body.telefone;
                if (req.body.adm)
                    user.adm = true;
                else
                    user.adm = false;
                
                if (req.body.senha)
                    user.password = user.generateHash(req.body.password);
                
                
                user.save(function (err) {
                    if (err) throw err;
                });
                
                callback(user);
            });
        }
        else {
            callback(null);
            return 0;
        }
        
    });
};


var editaPefil = function (req, idUser, callback) {
    findByEmail(req.body.email, function (quantidadeDeEmails) {
        if (quantidadeDeEmails <= 1) {
            User.findById(idUser, function (err, user) {
                if (!user) {
                    callback(null);
                    return;
                }
                if (user.email != req.body.email && quantidadeDeEmails == 1) {
                    ///No caso para um email encontrado que é de outro user
                    callback(null);
                    return;
                }
                
                user.nome = req.body.nome;
                user.email = req.body.email;
                user.telefone = req.body.telefone;
                user.especializacao = req.body.especializacao;
                
                if (req.body.senha)
                    user.password = user.generateHash(req.body.password);
                
                
                user.save(function (err) {
                    if (err) throw err;
                    callback("editado com sucesso");
                });
                
                
            });
        }
        else {
            callback(null);
            return 0;
        }
        
    });
};


var cadastrarPaciente = function (user) {
    User.findById(user._id, function (err, resultUser) {
        if (!resultUser) {
            callback(null);
            return;
        }
        if (err) throw err;
        resultUser.pacientes = user.pacientes;
        resultUser.save(function (err) {
            if (err) throw err;
        });
    });
}

var remove = function (idUser, callback) {
    User.findById(idUser, function (err, user) {
        if (!user) {
            callback(null);
            return;
        }
        if (err) throw err;
        pacienteDAO.deleteAtendenteRelacionado(idUser, function () {
            user.remove(function (err) {
                if (err) throw err;
            });
            callback("deletado com sucesso");
        });
    });
}


module.exports.cadastrar = cadastrar;
module.exports.editaPefil = editaPefil;
module.exports.listarUsers = listarUsers;
module.exports.listarUsersNoAdm = listarUsersNoAdm;
module.exports.findByNome = findByNome;
module.exports.findById = findById;
module.exports.findByEmail = findByEmail;
module.exports.update = update;
module.exports.remove = remove;
module.exports.verificaEmail = verificaEmail;
module.exports.cadastrarPaciente = cadastrarPaciente;