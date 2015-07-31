var moongose = require('mongoose');
var HistoricoAcesso = require('../routes/models/historicoDeAcesso');

var pacienteDAO = require('./pacienteDao.js');


var cadastrar = function (acesso, callback) {
    var newHistorico = new HistoricoAcesso();
    buscarCont(function (numberAcesso) {
                
        newHistorico.data = acesso.data;
        newHistorico.tempInicial = acesso.tempInicial;
        newHistorico.tempFinal = acesso.tempFinal;
        newHistorico.numeroDoAcesso = numberAcesso + 1;        
        newHistorico.nota = acesso.nota;
        newHistorico.idUser = acesso.idUser;
        newHistorico.user = acesso.user;
        newHistorico.idPaciente = acesso.idPaciente;
        pacienteDAO.findById(newHistorico.idPaciente, function (paciente) {
            newHistorico.paciente = paciente.nome;
            newHistorico.idRobo = paciente.idRobo;
            newHistorico.robo = paciente.robo;
            newHistorico.save(function (err) {
                if (err) throw err;
                callback("acesso registrado com sucesso");
            });
        });
    });
}

    
var buscarCont = function (callback) {
    HistoricoAcesso.find({}, function (err, historicoDeAcessos) {
        if (!historicoDeAcessos) {
            callback(0);
            return 0;
        }
        else if (err) throw err;
        else {
            callback(historicoDeAcessos.length);
            return historicoDeAcessos.length;
        }
    });
};

var listarHistoricoDeAcessos = function (callback) {
    HistoricoAcesso.find({}, function (err, historicoDeAcessos) {
        if (!historicoDeAcessos) {
            callback(null);
            return;
        }
        else if (err) throw err;
        else {
            callback(historicoDeAcessos);
            return;
        }
    });
}


var findById = function (idc, callback) {    
    HistoricoAcesso.findById(idHistorico, function (err, historico) {
        // if (err) callback('err');
        if (!historico) {
            callback();
            return;
        }
        callback(historico);
    });
}   

module.exports.cadastrar = cadastrar;
module.exports.listarHistoricoDeAcessos = listarHistoricoDeAcessos;
module.exports.findById = findById;