var historicoDeAcessoDAO = require('../Daos/historicoDeAcessoDao');
var atendiemntoDAO = require('../Daos/atendimentoDao');
var HistoricoDeAcesso = require('../routes/models/historicoDeAcesso.js');
var Atendimento = require('../routes/models/atendimento.js');



function rotashistorico(app, passport) {
    var historicoDeAcessoVazio = undefined;
    var atendimentoVazio = undefined;
    
      
    /////cadastarhistoricodeacesso/////----POST
    app.post('/cadastrarhistoricodeacesso', isLoggedIn, function (req, res) {        
        HistoricoDeAcesso.data = req.body.data;
        HistoricoDeAcesso.tempIncial = req.body.tempInical;
        HistoricoDeAcesso.tempFinal = req.body.tempFinal
        HistoricoDeAcesso.tempDiferenca = req.body.tempDiferenca;
        HistoricoDeAcesso.nota = req.body.nota;
        HistoricoDeAcesso.idUser = req.user._id;
        HistoricoDeAcesso.user = req.user.nome;
        
        var url = req.body.url;
        url = url.split('/');
        HistoricoDeAcesso.idPaciente = url[4];
        if (HistoricoDeAcesso.idPaciente) {
            historicoDeAcessoDAO.cadastrar(HistoricoDeAcesso, function (message) {
                res.send(JSON.stringify({ message : message }));
            });
        }
    });

    
    /////cadastraratendimento/////----POST
    app.post('/cadastraratendimento', isLoggedIn, function (req, res) {
        Atendimento.tipoAtendimento = req.body.tipoAtendimento;
        Atendimento.atendimentoTexto = req.body.atendimento;
        Atendimento.data = req.body.data;
        var url = req.body.url;
        url = url.split('/');
        Atendimento.idUser = req.user._id;
        Atendimento.user = req.user.nome;        

        Atendimento.idPaciente = url[4];
        if (Atendimento.idPaciente) {
            atendiemntoDAO.cadastar(Atendimento, function (message) {
                if (message) res.send(JSON.stringify({ message : message }));
            });
        }
    });
    
    
    /////cadastraratendimento/////----POST
    app.post('/cadastraratendimento', isLoggedIn, function (req, res) {
        Atendimento.tipoAtendimento = req.body.tipoAtendimento;
        Atendimento.atendimentoTexto = req.body.atendimento;
        Atendimento.data = req.body.data;
        req.url;
        var url = req.body.url;
        url = url.split('/');
        Atendimento.idUser = req.user._id;
        Atendimento.user = req.user.nome;
        
        Atendimento.idPaciente = url[4];
        if (Atendimento.idPaciente) {
            atendiemntoDAO.cadastar(Atendimento, function (message) {
                if (req.body.adm)
                    res.redirect('listarpacientes');
                else
                    res.redirect('/listarmeuspacientes');
            });
        }
    });
    
    /////listarhistorico/////----GET
    app.get('/historicos', isLoggedIn, function (req, res) {        
        historicoDeAcessoDAO.listarHistoricoDeAcessos(req.user, function (historicos) {
            if (historicos) {
                for (var i = 0; i < historicos.length; i++) {
                    var dia = historicos[i].data.getDate();
                    var mes = historicos[i].data.getMonth() + 1;
                    var ano = historicos[i].data.getFullYear();
                    
                    historicos[i].dataFormatada = dia + "/" + mes + "/" + ano;
                }
                res.render('historicos.ejs', { historicos : historicos, user : req.user  });
            }
            else res.render('historicos.ejs', { historicos : historicoDeAcessoVazio, user : req.user });
        });
    });

    
    /////listarhistorico/////----GET
    app.get('/atendimentos', isLoggedIn,  function (req, res) {
        atendiemntoDAO.listarAtendimentos(req.user, function (atendimentos) {
            if (atendimentos) {
                for (var i = 0; i < atendimentos.length; i++) {
                    var dia = atendimentos[i].data.getDate();
                    var mes = atendimentos[i].data.getMonth() + 1;
                    var ano = atendimentos[i].data.getFullYear();
                    
                    var hora = atendimentos[i].data.getHours();
                    var minuto = atendimentos[i].data.getMinutes();
                    
                    atendimentos[i].dataFormatada = dia + "/" + mes + "/" + ano;
                    atendimentos[i].horarioDoAtendimento = hora + " : " + minuto;
                }
                res.render('atendimentos.ejs', { atendimentos : atendimentos, user : req.user });
            }
            else res.render('atendimentos.ejs', { atendimentos : atendimentosAcessoVazio, user : req.user });
        });
    });
    
    
    /////atendimentos/////----GET
    app.get('/atendimento/:id', isLoggedIn, function (req, res) {
        var idAtendimento = req.params.id;        
        atendiemntoDAO.findById(idAtendimento, function (atendimento){
            if (atendimento) {
                var dia = atendimento.data.getDate()
                var mes = atendimento.data.getMonth() + 1;
                var ano = atendimento.data.getFullYear();
                var hora = atendimento.data.getHours();
                var minuto = atendimento.data.getMinutes();
                atendimento.dataFormatada = dia + "/" + mes + "/" + ano;
                atendimento.horarioDoAtendimento = hora + " : " + minuto;
                res.render('atendimento.ejs', { atendimento : atendimento, user : req.user });
            }
            else res.render('atendimento.ejs', { atendimento : atendimentoVazio, user : req.user });
        })
    });
    
    
    /////historico/////----GET
    app.get('/historico/:id', isLoggedIn, function (req, res) {
        var idHistorico = req.params.id;
        historicoDeAcessoDAO.findById(idHistorico, function (historico) {
            if (historico) {
                var dia = historico.data.getDate()
                var mes = historico.data.getMonth() + 1;
                var ano = historico.data.getFullYear();
                historico.dataFormatada = dia + "/" + mes + "/" + ano;
                res.render('historico.ejs', { historico : historico, user : req.user });
            }
            else res.render('historico.ejs', { historico : historicoDeAcessoVazio, user : req.user});
        })
    });

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();    
    res.redirect('/login');
}

module.exports = rotashistorico;

function isAdm(req, res, next) {
    if (req.isAuthenticated())
        if (req.user.adm)
            return next();
        else
            res.redirect('/login');
    res.redirect('/login');
}