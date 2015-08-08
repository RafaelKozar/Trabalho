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
        var cont = 0; 
        var user = new User();
        user.adm = true;
        
        pacienteDAO.listarPacientes(user, function (pacientes) {            
            var numRobos = robos.length - 1;
            var numPacientes = pacientes.length - 1;
            for (var i = 0; i <= numRobos; i++) {                

                for (var j = 0; j <= numPacientes; j++) {                    
                    
                    if (robos[i]._id == pacientes[j].idRobo) {
                        break;                        
                    }
                    else if (j == numPacientes) {
                        robosRetorno[cont] = robos[i];
                        cont++;
                    }
                }             
            }
            if (numPacientes == -1) {
                callback(robos);
                return;
            }
            else
                callback(robosRetorno);
        });
    });
}


/*var carregaRobosDisponiveis = function (robos, pacientes, robosRetorno, crob, cpac, crobRet) {
    if (crob == robos.length && pacientes.length == capc)
        return robosRetorno;
    else if ()
};*/

var testeRecursivo = function () {
    for (var j = 0; j < 5; j++) {
        for (var i = 0; i < 3; i++) {
            if (recursiva(i)) break;
        }
    }
    return "testou";
};

var recursiva = function (i){
    if (i == 3)
        return true;
    else
        return recursiva(++i);
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
module.exports.testeRecursivo = testeRecursivo; 