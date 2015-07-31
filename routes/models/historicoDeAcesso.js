var moongose = require('mongoose');

var historicoDeAcessoSchema = moongose.Schema({
    idRobo : String,
    robo : String,
    idUser : String,
    user : String,
    idPacinte : String,
    paciente : String,
    numeroDoAcesso : Number,
    tempInicial : Number,
    tempFinal : Number,
    tempDiferenca : Number,
    nota : String,    
    data : Date 
})

var historicoDeAcesso = moongose.model('HistoricoDeAcesso', historicoDeAcessoSchema);
module.exports = historicoDeAcesso;