﻿var User = require('./models/user.js');
var userDAO = require('../Daos/userDao');
var roboDAO = require('../Daos/roboDao');
var pacienteDAO = require('../Daos/pacienteDao');
var peer = require('../config/main.js');

var pacientesVazio = undefined;
var messageVazio = undefined;

function carregarotasatendente (app, passport) {
    
    ///acessa a camera do paciente/// get
    app.get('/acessarpaciente/:id', isLoggedIn, function (req, res) {
        var idPaciente = req.params.id;
        pacienteDAO.findById(idPaciente, function (paciente) {
            if (paciente.idRobo != null && paciente.idRobo != "")
                res.render('acessarpaciente.ejs', { user : req.user });
            else
                res.render('cadastraratendimento.ejs', { user : req.user });
        })
        
    });
    
    
    ///setar o id para poder conectar camera peerToPeer/// get
    app.get('/conectacam', isLoggedIn, function (req, res) {
        var val = req.query.url.split('/');
        var idPaciente = val[val.length];
        pacienteDAO.findById(idPaciente, function (paciente) {
            var returnJsonObj;
            returnJsonObj = {
                idRobo: paciente.idRobo,
                idPaciente: idPaciente,                
                idUser: req.user.id
            };
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(returnJsonObj);
        });
    });
    
    app.post('/conectacam', isLoggedIn, function (req, res) {
        var param = req.body.parametro;
        var url = param.split('/');
        var idPaciente = url[url.length - 1];
        pacienteDAO.findById(idPaciente, function (paciente) {
            var returnJsonObj;
            returnJsonObj = {
                idRobo: paciente.idRobo,
                robo: paciente.robo,
                idUser: req.user.id
            };
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(returnJsonObj));
        });
    });
    
    app.get('/indexuser', function (req, res) {
        res.render('indexuser.ejs');
    });
    
    app.get('/camera3', function (req, res) {
        res.render('camera3.ejs');
    });
    
    app.get('/searching', function (req, res) {
        res.render('searching.ejs');
    });
    
    app.get('/listarmeuspacientes', isLoggedIn, function (req, res) {
        pacienteDAO.listarPacientes(req.user, function (pacientes) {
            if (req.session.message) {
                var message = req.session.message;
                delete req.session.message;
            }
            if (pacientes && message)
                res.render('listarmeuspacientes.ejs', { pacientes : pacientes, message : message });
            else if (pacientes)
                res.render('listarmeuspacientes.ejs', { pacientes : pacientes, message : messageVazio });
            else if (message)
                res.render('listarmeuspacientes.ejs', { pacientes : pacientesVazio, message : message });
            else
                res.render('listarmeuspacientes.ejs', { pacientes : pacientesVazio, message : messageVazio });
        });
        
    })
    
    app.get('/usercadastrarpaciente', isLoggedIn, function (req, res) {
        res.render('usercadastrarpaciente.ejs');
    });
    
    app.get('/camera4', function (req, res) {
        res.render('camera4.ejs');
    });
    
      
    app.post('/getrobos', isLoggedIn, function (req, res) {
        roboDAO.listarRobos(function (robos) {
            res.send(JSON.stringify(robos));
        })
    });
    
    app.post('/getpaciente', isLoggedIn, function (req, res) {
        var param = req.body.url;
        var idPaciente = param[param.length - 1];
        pacienteDAO.findById(idPaciente, function (user) {
            res.send(JSON.stringify(user));
        });
    });
    
    app.post('/getpacientes', isLoggedIn, isLoggedIn, function (req, res) {
        pacienteDAO.listarPacientes(req.user, function (pacientes) {
            res.send(JSON.stringify(pacientes));
        });
    });
    
    
    app.get('/testandr', function (req, res) { 
        res.render('testandr.ejs');
    });

    
    app.post('/getuser', function (req, res) {
        var param = req.body.url;
        var idPaciente = param[param.length - 1];
        pacienteDAO.findById(idPaciente, function (user) {
            res.send(JSON.stringify(user));
        });
    });
    
};

module.exports = carregarotasatendente;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    
    res.redirect('/login');
}


/* var url = req.body.message.split("/");
        var idPaciente = url.slice(-1);
        pacienteDAO.findById(idPaciente, function (paciente) {
            
            var returnJsonObj;
            returnJsonObj = {
                idRobo: paciente.idRobo,
                idUser: req.user.id
            };
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(returnJsonObj));
        
        });*/       