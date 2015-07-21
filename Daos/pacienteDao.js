var Paciente = require('../routes/models/paciente');
var RoboDAO = require('./roboDao.js');
var moongose = require('mongoose');




var cadastrar = function (req) {
    var newPaciente = new Paciente();

    newPaciente.nome = req.body.nome;
    //newPaciente.foto = req.body.foto;   transformar imagem em string
    newPaciente.telefone = req.body.telefone;
    newPaciente.quadro = req.body.quadro;
    newPaciente.idRobo = req.body.idRobo;
    
    ////Pega o nome do robo////
    RoboDAO.findById(newPaciente.idRobo, function (robo) {
        newPaciente.robo = robo;
        newPaciente.save(function (err) {
            if (err) throw err;
        });
        return 'cadastrado com sucesso';
    });       
};

var listarPacientes = function (callback) {
    Paciente.find({}, function (err, pacientes) {
        if (err) throw err;
        callback(pacientes);
    });
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
        if (err) throw err;
        callback(paciente);
    });
}

var update = function (req, idPaciente, callback) {
    Paciente.findById(idPaciente, function (err, paciente) {
        if (err) throw err;
        paciente.nome = req.body.nome;
        paciente.foto = req.body.foto;
        paciente.telefone = req.body.telefone;
        paciente.quadro = req.body.quadro;
        paciente.idRobo = req.body.idRobo;
        ////Pega o nome do robo////
        RoboDAO.findById(paciente.idRobo, function (robo) {
            paciente.robo = robo.nome;
            paciente.save(function (err) {
                if (err) throw err;
            });
            callback(paciente);
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


module.exports.cadastrar = cadastrar;
module.exports.listarPacientes = listarPacientes;
module.exports.findByNome = findByNome;
module.exports.findById = findById;
module.exports.update = update;
module.exports.remove = remove;