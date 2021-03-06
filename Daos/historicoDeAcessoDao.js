﻿var moongose = require('mongoose');
var HistoricoAcesso = require('../routes/models/historicoDeAcesso');

var pacienteDAO = require('./pacienteDao.js');


var Paciente = require('../routes/models/paciente');
var User = require('../routes/models/user');
var Robo = require('../routes/models/robo');


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
        newHistorico.tempDiferenca = acesso.tempDiferenca;
        /*var dia = newHistorico.data.getDate()
        var mes = newHistorico.data.getMonth() + 1;
        var ano = newHistorico.data.getFullYear();
        newHistorico.dataFormatada = dia + "/" + mes + "/" + ano;
        //////        
        newHistorico.dataFormatada  não fica dentro do doc
        /////
        */
        //newHistorico.horarioDoAtendimento = newHistorico.data.getHours() + " : " + newHistorico.data.getMinutes();

        pacienteDAO.findById(acesso.idPaciente, function (paciente) {
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

var encontrarUser = function (idHistorico, callback){
    
}

var listarHistoricoDeAcessos = function (user, callback) {
    if (user.adm) {
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
    else {
        HistoricoAcesso.find({"idUser" : user._id}, function (err, historicoDeAcessos) {
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
}


var findById = function (idHistorico, callback) {

    HistoricoAcesso.findById(idHistorico, function (err, historico) {
        // if (err) callback('err');
        if (!historico) {
            callback();
            return;
        }
        callback(historico);
    });
}


var encontrarHistoricoUser = function (idUser, callback) {
    HistoricoAcesso.find({ 'idUser' : idUser }, function (err, historico) {
        if (historico) {
            callback(historico);
        }
    });
}

var atualizarNomeUserHistorico = function (user, idUser, callback) {
    HistoricoAcesso.findById(idUser, function (err, historico) {
        historico.user = user.nome;
        historico.save(function (err) {
            if (err) throw err;
            callback();
        });
    });
}

var encontrarHistoricoRobo = function (idRobo, callback) {
    HistoricoAcesso.find({ 'idRobo' : idRobo }, function (err, historico) {
        if (historico) {
            callback(historico);
        }
    });
}

var atualizarHistoricoRobo = function (robo, idHistorico, callback) {
    HistoricoAcesso.findById(idHistorico, function (err, historico) {
        historico.robo = robo.nome;
        historico.save(function (err) {
            if (err) throw err;
            callback();
        });
    });
}


var encontrarHistoricoPaciente = function (idPaciente, callback) {    
    HistoricoAcesso.find({ 'idPaciente' : idPaciente }, function (err, historico) {
        if (historico) {
            callback(historico);
        }
    });
}

var atualizarHistoricoPaciente = function (paciente, idHistorico, callback) {
    HistoricoAcesso.findById(idHistorico, function (err, historico) {
        historico.paciente = paciente.nome;
        historico.save(function (err) {
            if (err) throw err;
            callback();
        });
    });
}

module.exports.cadastrar = cadastrar;
module.exports.listarHistoricoDeAcessos = listarHistoricoDeAcessos;
module.exports.findById = findById;

module.exports.encontrarHistoricoUser = encontrarHistoricoUser;
module.exports.atualizarNomeUserHistorico = atualizarNomeUserHistorico;

module.exports.encontrarHistoricoRobo = encontrarHistoricoRobo;
module.exports.atualizarHistoricoRobo = atualizarHistoricoRobo;

module.exports.encontrarHistoricoPaciente = encontrarHistoricoPaciente;
module.exports.atualizarHistoricoPaciente = atualizarHistoricoPaciente;