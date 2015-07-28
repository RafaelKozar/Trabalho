$(document).ready(function () {    
    $.post('/getpacientes', function (data) {
        var pacientes = JSON.parse(data);        
       /* $('#lista > tbody > linha').each(pacientes, function (index, value)
        {
                $('#nome').html(value);
                $('#telefone').html(value);
                $('#robo').html(value);
        }); */
        for (var i = 0; i < pacientes.length; i++) {
            $('#lista > tbody > linha > nome').html(paciente[i].nome);
            $('#lista > tbody > linha > telefone').html(paciente[i].telefone);
            $('#lista > tbody > linha > robo').html(paciente[i].robo);            
        }
    });

    

});

