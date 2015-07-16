var mongoose = require('mongoose');

var roboScheme = mongoose.Schema({
    local            : {
        nome : String,
        descricao : String,
        ip : String,
        ipAndroid : String
    }});



var robo = mongoose.model('Robo', roboScheme);
module.exports = robo;