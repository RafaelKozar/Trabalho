// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var atendimentoSchema = mongoose.Schema( {
    idPaciente : String,
    paciente : String,
    idUser : String,
    user : String,
    data : Date,
    dataFormatada : String,
    horarioDoAtendimento : String,
    atendimentoTexto : String,    
    tipoAtendimento : String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Atendimento', atendimentoSchema);

