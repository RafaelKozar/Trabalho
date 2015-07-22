var User = require('../routes/models/user');
var moongose = require('mongoose');




var cadastrar = function (req) {
    var newUser = new User();
    
    if (findByEmail(req.body.email)) {
        return "Este email já sendo utilizado";
    }
    else {
        newUser.nome = req.body.nome;
        newUser.email = req.body.email;        
        newUser.telefone = req.body.telefone
        newUser.especializacao = req.body.especializacao
        newUser.adm = req.body.administrador;
        newUser.password = newUser.generateHash(req.body.password);
        
        
        newUser.save(function (err) {
            if (err) throw err;
            return 'cadastrado efetuado com sucesso';
        });        
    }
};

var findByEmail =  function (email) {
    User.find({ 'email' : email }, function (err, user) {
        if (err) throw err;
        else if (user) return true;
        else return false;
    });
};

var listarUsers = function (callback) {
    User.find({}, function (err, users) {
        if (err) throw err;
        callback(users);
    });
};

var findByNome = function (nomepesquisa) {
    var nomeUser = new User();
    nomeUser.find({ nome : nomepesquisa }, function (err, users) {
        if (err) throw err;
        return users;
    });
};

var findById = function (idUser, callback) {
    
    User.findById(idUser, function (err, user) {
        if (err) callback('err');
        callback(user);
    });
}

var update = function (req, idUser, callback) {
    if (findByEmail(req.body.email)) {
        return "Este email já sendo utilizado";
    }
    else {
        User.findById(idUser, function (err, user) {
            if (err) throw err;
            user.nome = req.body.nome;
            user.email = req.body.email;
            user.password = req.body.password;
            user.telefone = req.body.telefone;
            user.adm = req.body.adm;
            user.user = req.body.user;
            
            user.save(function (err) {
                if (err) throw err;
            });
            
            callback(user);
        });
    }
}

var remove = function (idUser, callback) {
    User.findById(idUser, function (err, user) {
        if (err) throw err;
        user.remove(function (err) {
            if (err) throw err;
        });
        callback("deletado com sucesso");
    });
}


module.exports.cadastrar = cadastrar;
module.exports.listarUsers = listarUsers;
module.exports.findByNome = findByNome;
module.exports.findById = findById;
module.exports.update = update;
module.exports.remove = remove;