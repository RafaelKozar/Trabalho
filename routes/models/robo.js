var mongoose = require('mongoose');

var roboScheme = mongoose.Schema({    
        nome : String,
        descricao : String,
        ip : String,
        ipAndroid : String
    });



var robo = mongoose.model('Robo', roboScheme);
module.exports = robo;