var Robo = require('../routes/models/robo');
var User = require('../routes/models/user');
var pacienteDAO = require('./pacienteDao.js')
var moongose = require('mongoose');
var promise = require('q');



var cadastrar = function (req) {
    var newRobo = new Robo();
    newRobo.nome = req.body.nome;
    newRobo.descricao = req.body.descricao
    
    //newRobo.ip = req.body.ip;
    //newRobo.ipandroid = req.body.ipandroid;
    
    newRobo.save(function (err) {
        if (err) throw err;
    });
    return 'cadastrado com sucesso';
};

var listarRobos = function (callback) {
    Robo.find({}, function (err, robos) {
        if (!robos) {
            callback(null);
            return;
        }
        if (err) throw err;
        callback(robos);
    });
};

var listarRobosSemPaciente = function (callback) {
    Robo.find({}, function (err, robos) {
        if (!robos) {
            callback(null);
            return;
        }
        if (err) throw err;
         

        //callback(robos);
    });
};

var findByNome = function (nomepesquisa) {
    var nomeRobo = new Robo();
    nomeRobo.find({ nome : nomepesquisa }, function (err, robos) {
        if (!robos) {
            callback(null);
            return;
        }
        if (err) throw err;
        return robos;
    });
};


var listarRobosDisponiveis = function (callback) {
    Robo.find({}, function (err, robos) {
        if (!robos) {
            callback(null);
            return;
        }
        if (err) throw err;
        var robosRetorno = [new Robo()];
        var cont = 0; var insere = 1;
        var user = new User();
        user.adm = true;
        callback(robos);
        //pacienteDAO.listarPacientes(user, function (pacientes) {
            /*for (var i = 0; i < robos.length; i++) {
                robosRetorno.push(robos[i]); //insere = 1;
                cont++;
                for (var j = 0; j < pacientes.legth; j++) {
                    if (robos[i]._id == pacientes[j].idRobo) {
                        insere = 0;
                        robosRetorno.splice(cont, 1);
                        cont--;
                        break;
                    }
                }
                /*if (insere == 1) {
                    robosRetorno[cont] = robos[i];
                    cont++;
                }*/
            //}
            //callback(robosRetorno);
       // });
    });
}


var findById = function (idRobo, callback) {
    
    Robo.findById(idRobo, function (err, robo) {
        if (!robo) {
            callback(null);
            return;
        }
        if (err) throw err;
        if (robo)
            callback(robo);
    });
}

var update = function (req, idRobo, callback) {
    Robo.findById(idRobo, function (err, robo) {
        if (!robo) {
            callback(null);
            return;
        }
        if (err) throw err;
        robo.nome = req.body.nome;
        robo.descricao = req.body.descricao
        
        console.log(robo._id);
        robo.save(function (err) {
            if (err) throw err;
        });
        
        callback(robo);
    });
}

var remove = function (idRobo, callback) {
    Robo.findById(idRobo, function (err, robo) {
        if (!robo) {
            callback(null);
            return;
        }
        if (err) throw err;
        pacienteDAO.deleteRoboRelacionado(idRobo, function () {
            robo.remove(function (err) {
                if (err) throw err;
            });
            callback("deletado com sucesso");
        });
    });
}


module.exports.cadastrar = cadastrar;
module.exports.listarRobos = listarRobos;
module.exports.listarRobosDisponiveis = listarRobosDisponiveis;
module.exports.findByNome = findByNome;
module.exports.findById = findById;
module.exports.update = update;
module.exports.remove = remove;