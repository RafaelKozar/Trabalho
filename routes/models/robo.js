var mongoose = require('mongoose');
ObjectId = mongoose.Types.ObjectId;

var roboScheme = mongoose.Schema({    
        nome : String,
        descricao : String,
        ip : String,
        ipAndroid : String
    });



var robo = mongoose.model('Robo', roboScheme);
module.exports = robo;