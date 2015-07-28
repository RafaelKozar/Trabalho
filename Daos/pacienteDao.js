var Paciente = require('../routes/models/paciente');
var RoboDAO = require('./roboDao.js');
var UserDAO = require('./userDao.js');
var moongose = require('mongoose');




var cadastrar = function (req) {
    var newPaciente = new Paciente();
    
    newPaciente.nome = req.body.nome;
    //newPaciente.foto = req.body.foto;   transformar imagem em string
    newPaciente.telefone = req.body.telefone;
    newPaciente.quadro = req.body.quadro;
    newPaciente.idRobo = req.body.idRobo;
    
    if (!req.user.adm || req.user.adm == 'undefined') {
        newPaciente.idAtendente = req.user._id;
    }
    
    
    if (newPaciente.idRobo) {
        RoboDAO.findById(newPaciente.idRobo, function (robo) {
            newPaciente.save(function (err, pacienteCadastrado) {
                if (err) throw err;
                req.user.pacientes = pacienteCadastrado._id;
                ///cadastramos o id do paciente no atendente, quando o mesmo não é adm///
                if(pacienteCadastrado.idAtendente) UserDAO.cadastrarPaciente(req.user);
                return 'cadastrado com sucesso';
            });
        });
    } else {
        newPaciente.save(function (err, pacienteCadastrado) {
            if (err) throw err;
            req.user.pacientes = pacienteCadastrado._id;
            if (pacienteCadastrado.idAtendente) UserDAO.cadastrarPaciente(req.user);
            return 'cadastrado com sucesso';
        });
    }
};


var listarPacientes = function (user, callback) {
    if (!user.adm) {
        Paciente.find({ idAtendente : user._id }, function (err, pacientes) {
            if (err) throw err;
            callback(pacientes)
        });
    }

    else {
        Paciente.find({}, function (err, pacientes) {
            if (err) throw err;
            callback(pacientes);
        });
    }
};


var findByNome = function (nomepesquisa) {
    var nomePaciente = new Paciente();
    nomePaciente.find({ nome : nomepesquisa }, function (err, pacientes) {
        if (err) throw err;
        return pacientes;
    });
};


var findById = function (idPaciente, callback) {
    
    Paciente.findById(idPaciente, function (err, paciente) {
        if (!paciente) callback(null);
        callback(paciente);
    });
}


var update = function (req, idPaciente, callback) {
    Paciente.findById(idPaciente, function (err, paciente) {
        if (!paciente) callback(null);
        //if (err) throw err;
        paciente.nome = req.body.nome;
        paciente.id = req.body.id;
        paciente.foto = req.body.foto;
        paciente.telefone = req.body.telefone;
        paciente.quadro = req.body.quadro;
        paciente.idRobo = req.body.idRobo;
        ////Pega o nome do robo////
        if (paciente.idRobo) {
            RoboDAO.findById(paciente.idRobo, function (robo) {
                paciente.robo = robo.nome;
                paciente.save(function (err) {
                    if (err) throw err;
                });
                callback(paciente);
            });
        } else {
            paciente.save(function (err) {
                if (err) throw err;
            });
            callback(paciente);
        }
    });
}

var updateRoboRelacionado = function (idPaciente, idRobo, callback){
    Paciente.findById(idPaciente, function (err, paciente) {
        if (err) throw err;
        paciente.idRobo = idRobo;
        RoboDAO.findById(idRobo, function (robo) {
            paciente.robo = robo.nome
            paciente.save(function (err) {
                if (err) throw err;
                callback(paciente)
            });
        });
    });
}


var remove = function (idPaciente, callback) {
    Paciente.findById(idPaciente, function (err, paciente) {
        if (err) throw err;
        paciente.remove(function (err) {
            if (err) throw err;
        });
        callback("deletado com sucesso");
    });
}


var deleteRoboRelacionado = function (idRobo, callback){
    Paciente.find({ 'idRobo' : idRobo }, function (err, pacientes) {
        //if (err) throw err;
        for (var i = 0; pacientes.length(); i++) {
            pacientes[i].idRobo = 'undefined';
            pacientes[i].robo   = 'undefined';
            pacientes[i].save(function (err) {
                if (err) throw err;
            });
        }
        callback("robo deletado");
    })
}


module.exports.cadastrar = cadastrar;
module.exports.listarPacientes = listarPacientes;
module.exports.findByNome = findByNome;
module.exports.findById = findById;
module.exports.update = update;
module.exports.updateRoboRelacionado = updateRoboRelacionado;
module.exports.deleteRoboRelacionado = deleteRoboRelacionado;
module.exports.remove = remove;