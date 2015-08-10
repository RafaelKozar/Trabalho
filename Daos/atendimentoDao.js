var Atendimento = require('../routes/models/atendimento.js');
var pacienteDAO = require('./pacienteDao.js');
var moongose = require('mongoose');

var cadastrar = function (atendimento, callback){
    var newAtendimento = new Atendimento();
    newAtendimento.idPaciente = atendimento.idPaciente;
    newAtendimento.data = atendimento.data;
    newAtendimento.atendimentoTexto = atendimento.atendimentoTexto;    
    newAtendimento.tipoAtendimento = atendimento.tipoAtendimento;
    newAtendimento.idUser = atendimento.idUser;
    newAtendimento.user = atendimento.user;
    /*  //////
    newAtendimento.dataFormatada = newAtendimento.data.getDate() + "/" + newAtendimento.data.getMonth() + 1 + "/" + newAtendimento.data.getFullYear();
    newAtendimento.horarioDoAtendimento = newAtendimento.data.getHours() + " : " + newAtendimento.data.getMinutes();
    */
    pacienteDAO.findById(newAtendimento.idPaciente, function (paciente) {
        newAtendimento.paciente = paciente.nome;        
        newAtendimento.save(function (err) {
            if (err) throw err;
            callback("Atendimento realizado com sucesso");
            return;
        });
    });
}

var listarAtendimentos = function (user, callback){
    if (user.adm) {
        Atendimento.find({}, function (err, atendimentos) {
            if (!atendimentos) {
                callback(null);
                return;
            }
            else if (err) throw err;
            else {
                callback(atendimentos);
                return;
            }
        });
    } else {
        Atendimento.find({"idUser" : user._id}, function (err, atendimentos) {
            if (!atendimentos) {
                callback(null);
                return;
            }
            else if (err) throw err;
            else {
                callback(atendimentos);
                return;
            }
        });
    }
}


var findById = function (idAtendimento, callback) 
{
    
    Atendimento.findById(idAtendimento, function (err, atendimento) {
        // if (err) callback('err');
        if (!atendimento) {
            callback();
            return;
        }
        callback(atendimento);
    });
}

module.exports.cadastar = cadastrar;
module.exports.listarAtendimentos = listarAtendimentos;
module.exports.findById = findById;
