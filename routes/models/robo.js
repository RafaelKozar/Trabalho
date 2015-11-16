var mongoose = require('mongoose');


var roboScheme = mongoose.Schema({    
        nome : String,
        descricao : String,
        atendente : Boolean
    });

var robo = mongoose.model('Robo', roboScheme);
module.exports = robo;