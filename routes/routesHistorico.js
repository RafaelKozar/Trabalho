var historicoDeAcessoDAO = require('../Daos/historicoDeAcessoDao');
var atendiemntoDAO = require('../Daos/atendimentoDao');
var HistoricoDeAcesso = require('../routes/models/historicoDeAcesso.js');
var Atendimento = require('../routes/models/atendimento.js');



module.exports = function (app, passport) {
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

    
    /////listarhistorico/////----GET
    app.get('/historicos', function (req, res) {        
        historicoDeAcessoDAO.listarHistoricoDeAcessos(function (historicos) {
            if (historicos) {
                for (var i = 0; i < historicos.length; i++) {
                    var dia = historicos[i].data.getDate();
                    var mes = historicos[i].data.getMonth() + 1;
                    var ano = historicos[i].data.getFullYear();
                    
                    historico.dataFormatada = dia + "/" + mes + "/" + ano;
                }
                res.render('historicos.ejs', { historicos : historicos });
            }
            else res.render('historicos.ejs', { historicos : historicoDeAcessoVazio});
        });
    });

    
    /////listarhistorico/////----GET
    app.get('/atendimentos', function (req, res) {
        atendiemntoDAO.listarAtendimentos(function (atendimentos) {
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
                res.render('atendimentos.ejs', { atendimentos : atendimentos });
            }
            else res.render('atendimentos.ejs', { atendimentos : atendimentosAcessoVazio });
        });
    });
    
    
    /////atendimentos/////----GET
    app.get('/atendimento/:id', function (req, res) {
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
                res.render('atendimento.ejs', { atendimento : atendimento });
            }
            else res.render('atendimento.ejs', { atendimento : atendimentoVazio });
        })
    });


    /////historico/////----GET
    app.get('/historico/:id', function (req, res) {
        var idHistorico = req.params.id;
        historicoDeAcessoDAO.findById(idHistorico, function (historico) {
            if (historico) {
                var dia = historico.data.getDate()
                var mes = historico.data.getMonth() + 1;
                var ano = historico.data.getFullYear();
                historico.dataFormatada = dia + "/" + mes + "/" + ano;
                res.render('historico.ejs', { historico : historico });
            }
            else res.render('historico.ejs', { historico : historicoDeAcessoVazio});
        })
    });

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();    
    res.redirect('/login');
}