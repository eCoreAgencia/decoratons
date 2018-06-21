(function (window, document, $) {
    'use strict';

    function Tickets(){
    	var config = {
    		ac: 'TD', // entidade
    		an: 'decoratons', // loja
    	}
    	self = this;
    	this.new = function(data, handlers) {
    		data = data || null;
    		handlers = handlers || null;
			$.ajax({
				url: '/'+config.an+'/dataentities/'+config.ac+'/documents',
				data: JSON.stringify(data),
				type: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/vnd.vtex.ds.v10+json'
				},
				success: function(data){
					console.log('Sucesso', data);
					if (handlers && handlers.success) handlers.success(data);
				},
				error: function(data){
					console.log('error', data);
					if (handlers && handlers.error) handlers.error(data);
				}
			});
    	}
    	this.sendFile = function(files,to, handlers){
    		to = to || null;
    		files = files || null;
    		handlers = handlers || null;
    		$.each(files, function(field,file){
                var send = new FormData();
				$.each(file, function(i,item){
					send.append(field, item);
				});
				$.ajax({
				    url: to.split(':')[1]+'/'+field+'/attachments',
				    data: send,
				    type: 'POST',
				    contentType: false,
				    processData: false,
				    success: function(data){
				    	if (handlers && handlers.success) handlers.success(data);
				    },
				    error: function(data){
				    	$.ajax({
						    url: to,
						    type: 'DELETE',
						    'Content-Type': 'application/json',
						    Accept: 'application/vnd.vtex.ds.v10+json',
						    success: function(){
						    	console.log('Save error', error);
				    			if (handlers && handlers.error) handlers.error(data);
						    }
						});
				    }
				});                 
			});
		}
    }
    window.Ticket = new Tickets();
    $.fn.ticketForm = function(){
		var $this = $(this);
		$this.on('submit', function(e){
			e.preventDefault();
			var data =  $this.serializeArray().reduce(function(obj, item) {
			    obj[item.name] = item.value;
			    return obj;
			}, {});
			var files = new Object();
			$this.find('input[type="file"]').each(function(){
				files[this.name] = this.files;
			});
			Ticket.new(data,{
				success: function(data){
					console.log('Ticket criado com sucesso', data);
					Ticket.sendFile(files, data.Href,{
						success: function(data){
							console.log('arquivos enviados', data);
						},
						erro: function(data){
							console.log('erro ao enviar arquivos', data);
						}
					});
				},
				error: function(data){
					console.log('Erro ao criar ticket', data);
				}
			})
		});
	}
}(window, document, jQuery));