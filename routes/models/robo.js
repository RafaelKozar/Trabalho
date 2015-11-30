var mongoose = require('mongoose');


var roboScheme = mongoose.Schema({    
        nome : String,
        descricao : String,        
    });

var robo = mongoose.model('Robo', roboScheme);
module.exports = robo;