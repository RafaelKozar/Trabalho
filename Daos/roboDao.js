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

var findById = function (idRobo, callback){
    
    Robo.findById(idRobo, function (err, robo) {
        if (err) throw err;
        callback(robo);
    });
}

String.prototype.toObjectId = function () {
    var ObjectId = (require('mongoose').Types.ObjectId);
    return new ObjectId(this.toString());
};


module.exports.cadastrar = cadastrar;
module.exports.listarRobos = listarRobos;
module.exports.findByNome = findByNome;
module.exports.findById = findById;