function masterDataContato(){
    var jsonSaveDadosUser = {
        "nome": $("#cl_nome").val(),
        "email": $("#cl_email").val(),
        "tel": $("#cl_telefone").val(),
        "empresa": $("#cl_empresa").val(),
        "mensagem": $("#cl_mensagem").val(),
    };

    var storename = 'shumi';
    var dataEntity = 'FC';

    var urlSaveDadosUser = 'http://api.vtexcrm.com.br/'+storename+'/dataentities/'+dataEntity+'/documents/';

    $.ajax({
        headers: {
            'Accept': 'application/vnd.vtex.ds.v10+json',
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(jsonSaveDadosUser),
        type: 'PATCH',
        url: urlSaveDadosUser,
        success: function (data) {
          console.log(data);
          $("div#messageSuccess").removeClass("hide");
          $("#cl_nome").val("");
          $("#cl_email").val("");
          $("#cl_telefone").val("");
          $("#cl_empresa").val("");
          $("#cl_mensagem").val("");
          alert("Mensagem Enviada com sucesso!");
        },
        error: function (data) {
          console.log(data);
          alert("Houve um erro ao enviar a mensagem. Tente novamente mais tarde");
        }
    });
}
