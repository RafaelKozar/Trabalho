// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var pacienteSchema = mongoose.Schema( {
    nome : String,       
    foto : String,
    telefone : String,
    quadro : String,
    robo : String,
    idAtendente : String,
    atendente : String,
    isTablet : String,
    idRobo : String      
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Paciente', pacienteSchema);

