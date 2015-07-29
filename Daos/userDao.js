var User = require('../routes/models/user');
var pacienteDAO = require('./pacienteDao.js');
var moongose = require('mongoose');




var cadastrar = function (req) {
    var newUser = new User();
    
    if (findByEmail(req.body.email)) {
        return false;
    }
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
        });
    }
};

var findByEmail = function (email) {
    User.find({ 'email' : email }, function (err, user) {
        if (err) throw err;
        else if (user) return true;
        else return false;
    });
};

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
            return;
        }
        if (err) throw err;
        var arrayRetorno = [new User()];
        var  cont = 0;
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
    nomeUser.find({ nome : nomepesquisa }, function (err, users) {
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
    var quantidadeDeEmails = findByEmail(req.body.email);
    if (quantidadeDeEmails > 0) {
        if (quantidadeDeEmails == 1) {
            User.findById(idUser, function (err, user) {
                if (user.email != req.body.email) {
                    callback(null);
                    return;
                }
            });
        }        
    }
    else {
        User.findById(idUser, function (err, user) {
            if (!user) {
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
}

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
module.exports.listarUsers = listarUsers;
module.exports.listarUsersNoAdm = listarUsersNoAdm;
module.exports.findByNome = findByNome;
module.exports.findById = findById;
module.exports.update = update;
module.exports.remove = remove;
module.exports.cadastrarPaciente = cadastrarPaciente;