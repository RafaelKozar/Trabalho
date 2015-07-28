var Robo = require('../routes/models/robo');
var pacienteDAO = require('./pacienteDao.js')
var moongose = require('mongoose');





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
    Robo.find({}, function (err, robos) {
        if (err) throw err;        
        callback(robos);  
    });  
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
        if (robo)
            callback(robo);        
    });
}

var update = function (req, idRobo, callback){
    Robo.findById(idRobo, function (err, robo) {
        if (err) throw err;        
        robo.nome = req.body.nome;
        robo.descricao = req.body.descricao
        
        console.log(robo._id);
        robo.save(function (err) {
            if (err) throw err;
        });
        
        callback(robo);
    });
}

var remove = function (idRobo, callback) {
    Robo.findById(idRobo, function (err, robo) {
        if (err) throw err;
        pacienteDAO.deleteRoboRelacionado(idRobo, function () {
            robo.remove(function (err) {
                if (err) throw err;
            });
            callback("deletado com sucesso");
        });
    });
}


module.exports.cadastrar = cadastrar;
module.exports.listarRobos = listarRobos;
module.exports.findByNome = findByNome;
module.exports.findById = findById;
module.exports.update = update;
module.exports.remove = remove;