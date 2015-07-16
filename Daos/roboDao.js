var Robo = require('../routes/models/robo');


var cadastrar = function (req) {
    var newRobo = new Robo();
    newRobo.local.nome = req.body.nome;
    newRobo.local.descricao = req.body.descricao
    
    //newRobo.local.ip = req.body.ip;
    //newRobo.local.ipandroid = req.body.ipandroid;
    
    newRobo.save(function (err) {
        if (err) throw err;
    });
    return 'cadastrado com sucesso';
};

module.exports.cadastrar = cadastrar;