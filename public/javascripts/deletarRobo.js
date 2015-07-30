$(".btdeletar").click(function () {
    var $row = $(this).closest("tr");
    var $id = $row.find(".btdeletar").val();
    var $nome = $row.find(".nome").text();
    
    var r = confirm("Tem certeza que deseja deletar o Robo: " + $nome);
    if (r == true) {
        window.location.href = './deletarrobo/' + $id;
    } else { }
});