$(function(){
  $('.form-newsletter input').each(function(){
    var placeHolder = $(this).attr('placeholder');
    $(this).on('focus', function(){
      $(this).attr('placeholder', '');
    });
    $(this).on('blur', function(){
      $(this).attr('placeholder', placeHolder);
    });
  });
  $('.form-newsletter').on('submit',function(e){
    e.preventDefault();
    var data = {
      "email": $(this).find("#cl_email").val(),
      "nome": $(this).find("#cl_nome").val()
    };
    var url = 'http://api.vtexcrm.com.br/shumi/dataentities/NL/documents/';
    $.ajax({
        headers: {
            'Accept': 'application/vnd.vtex.ds.v10+json',
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(data),
        type: 'PATCH',
        url: url,
        success: function (data) {
          $(this).find("#cl_email").val("");
          $(this).find("#cl_nome").val("");
          alert("E-mail cadastrado com sucesso!");
        },
        error: function (data) {
          alert("Houve um erro ao cadastrar seu e-mail. Tente novamente mais tarde");
        }
    });
  });
});