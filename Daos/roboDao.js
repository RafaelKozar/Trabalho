var Robo = require('../routes/models/robo');


var cadastrar = function (req) {
    var newRobo = new Robo();    
    newRobo.nome = req.body.nome;
    newRobo.descricao = req.body.descricao
    
    //newRobo.ip = req.body.ip;
    //newRobo.ipandroid = req.body.ipandroid;
    
    newRobo.save(function (err) {
        if (err) throw err;
    });
    return 'cadastrado com sucesso';
};

var listarRobos = function (callback) {
    //var listaRobo = new Robo();    
    Robo.find({}, function (err, robos) {
        if (err) throw err;        
        callback(robos);
        //return robos;
    });
  // console.log(robos);
    //return robos;
};

var findByNome = function (nomepesquisa) {
    var nomeRobo = new Robo();
    nomeRobo.find({ nome : nomepesquisa }, function (err, robos) {
        if (err) throw err;
        return robos;
    });
};



module.exports.cadastrar = cadastrar;
module.exports.listarRobos = listarRobos;
module.exports.findByNome = findByNome;