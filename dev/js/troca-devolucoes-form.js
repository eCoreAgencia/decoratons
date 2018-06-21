var sendFormDecoratons = {
  storeName: 'decoratons',
  dataEntity: 'TD',
  urlAPI: function(props) {
    var url = '//api.vtexcrm.com.br/' + props.storeName +
      '/dataentities/' + props.dataEntity + '/documents/';

    if (props.docId) {
      url += '/' + props.docId + '/' + props.field + '/attachments';
    }

    return url;
  },
  getData(props) {

    var data = {};
    var prefix = "#cl_";

    props.input.forEach(function(v) {
      if (v !== 'nPedido') {
        data[v] = $(prefix + v).val();
      } else {
      data['pedido'] = $(prefix + v).val();
      }
    });

    props.select.forEach(function(v) {
      data[v] = $("select[name='"+v+"'] option:selected").text();
    });

    props.textarea.forEach(function(v) {
      if ( v !== 'mensagem' ) {
        data[v] = $('textarea' + prefix + v).val();
      } else {
        data['comentario'] = $('textarea' + prefix + v).val();
      }
    });

    data['status'] = (data['type'] === 'troca') ? 1000001 : 1000002;

    return data;
  },
  createDoc: function(data){
    var self = this;
    var storeName = this.storeName;
    var dataEntity = this.dataEntity;

    var url = this.urlAPI({
      storeName: storeName, dataEntity: dataEntity
    });

    $.ajax({
      headers: {
        'Accept': 'application/vnd.vtex.ds.v10+json',
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
      type: 'PATCH',
      url: url,
      async: false,
      success: function (resp) {

        docId = resp.DocumentId;

        console.log(docId,resp);

        var file = $("#cl_arquivos")[0].files;
        var field = 'arquivos';

        if (file.length) {
          self.sendFile(file, docId, storeName, dataEntity, field);
        }

      },
      error: function (data) {
        if(data.responseText){
          var r = JSON.parse(data.responseText);
          console.log(r.Message);
        }else{
          console.log('Houve um erro tente novamente mais tarde.');
        }
      }
    });

  },

  sendFile: function(file, docId, storeName, dataEntity, field){

    var fileData = new FormData();

    $.each(file, function(key, value){
      fileData.append(key, value)
    });

    var url = this.urlAPI({
      storeName: storeName, dataEntity: dataEntity, docId: docId, field: field
    });

    $.ajax({
      url: url,
      type: 'POST',
      data: fileData,
      contentType: false,
      processData: false,
      success: function(data){
        console.log('succeed', data);
        alert('Mensagem enviada com sucesso');
        $("form[name=trocas-devolucoes]")[0].reset();        
      },
      error: function(data){
        console.log('failed', data);
      }
    });
  },
};

$(".submit-troca-devolucao-form").click(function(event){
  event.preventDefault();
  var data = sendFormDecoratons.getData({
    input: ['nome', 'email', 'telefone', 'nPedido'],
    select: ['type'],
    textarea: ['mensagem'],
  });
  sendFormDecoratons.createDoc(data);
});
