$(document).ready(function () {    
    $.get('/getrobos', function (data) {
        $('#results').html(data);
    });
});