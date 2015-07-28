var paciente;
$(document).ready(function () {
    var location = document.location.href;
    var url = location.split('/');
    var messaga = $('#message').val;    
    if (url.length == 5) {
        var param = { url: url };
        $.post('/getpaciente', param, function (data) {
            paciente = JSON.parse(data);
            $('#nome').val(paciente.nome);
            $('#telefone').val(paciente.telefone);
            $('#quadro').html(paciente.quadro);
            $('#id').val(paciente._id);
        });
    }     
});

