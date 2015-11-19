var Robo = require('../routes/models/robo');
var User = require('../routes/models/user');
var pacienteDAO = require('./pacienteDao.js');
var historicoDAO = require('./historicoDeAcessoDao.js');
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
        if (!robos || robos.length == 0) {
            callback(0);
            return;
        }
        if (err) throw err;
        else if (robos instanceof Array){
            callback(robos.length);
            return;
        }
        else if (robos) {
            callback(1)
            return
        }            
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
            else {
                if (robosRetorno[0].nome)
                    callback(robosRetorno);
                else {                    
                    callback(null);
                }
            }
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
            pacienteDAO.encontrarRobosPaciente(robo._id.toString(), function (pacientes) {
                for (var i = 0; i < pacientes.length; i++)
                    pacienteDAO.atualizarNomeRobo(robo, pacientes[i]._id.toString(), function () { });
            });
            historicoDAO.encontrarHistoricoRobo(robo._id.toString(), function (historicos) {
                for (var k = 0; k < historicos.length; k++)
                    historicoDAO.atualizarHistoricoRobo(robo, historicos[k]._id.toString(), function () { });
            });
            if (err) throw err;
        });
        
        callback(robo);
    });
}

var atualizarPaciente = function(idRobo, callback) {
    Robo.findById(idRobo, function (err, robo) {
        robo.paciente = true;
        robo.save(function (err) {
            if (err) throw err;
            callback();
        });
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


var verificarNome = function (idRobo, nome, callback) {
    Robo.find({ 'nome' : nome }, function (err, robo) {
        if (!robo || robo.length == 0) {
            callback("true");
            return;
        }
        
        if (err) throw err;
        else if (robo instanceof Array && robo.length > 1) {
            callback("false");
            return;
        }

        ///Entra aqui caso exista 1 email igual e verifica se é o nome de outro robo
        else if (robo.length > 0) {
            Robo.findById(idRobo, function (err, robo2) {
                if (robo2.nome != robo[0].nome) {
                    callback("false");
                    return;
                }
                else if (robo2.nome == robo[0].nome) {
                    callback("true");
                    return;
                }
            });
        }
    });
}

var getStatus = function (idRobo, callback){
    Robo.findById(idRobo, function (err, robo) {
        if (!robo.status || robo.status == null) {
            robo.status = true;
            robo.save(function (err) {
                if (err) throw err;
                callback(1);
            });            
        }            
        else
            callback(-1);
    });
}

var setStatus = function (idRobo){
    Robo.findById(idRobo, function (err, robo) {
        robo.status = false;
        robo.save(function (err) {
            if (err) throw err;            
        });            
    });
}

module.exports.getStatus = getStatus;
module.exports.setStatus = setStatus;
module.exports.cadastrar = cadastrar;
module.exports.listarRobos = listarRobos;
module.exports.listarRobosDisponiveis = listarRobosDisponiveis;
module.exports.findByNome = findByNome;
module.exports.findById = findById;
module.exports.update = update;
module.exports.remove = remove;
module.exports.verificarNome = verificarNome;
module.exports.testeRecursivo = testeRecursivo;
module.exports.atualizarPaciente = atualizarPaciente;