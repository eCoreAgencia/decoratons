(function (window, document, $) {
    'use strict';

    function Calculator(){
    	var config = {
    		ac: 'CC', // entidade
    		an: 'decoratons', // loja
    		fields: 'width,height,variation,searchUrl,area,order',
    		results: {
    			wrapper: 'ul',
    			result: '<li class="tamanho #variation#" data-width="#width#" data-height="#height#" data-area="#area#"><label><input name="calc_tam" value="#searchUrl#" type="radio" class="hidden"/><span>Tamanho #variation#</span></label><input type="text" name="calc_quant" disabled/><p>rolos de #heightFormated# (A) X #widthFormated# (L)</p></li>'
    		},
    		instruction: 'Informe as medidas em metros. Ex: 1,20m x 2,40',
    		lossRatio: '20',
    	}

    	this.getSizes = function(success, error){
			error = error || null;
			success = success || null;

			$.ajax({
				url: '/'+config.an+'/dataentities/'+config.ac+'/search?_fields='+config.fields,
				type:'GET',
				headers: {
					'REST-Range': 'resources=0-99',
					'Content-Type': 'application/json',
					Accept: 'application/vnd.vtex.ds.v10+json'
				},
				success: function(data){
					data.sort(function(a, b){return a.order - b.order})
					window.Calculadora.sizes = data;
					if (success) success(data);
				},
				error: function(data){
					console.log('error', data, data.getResponseHeader(), data.statusCode());
					if (error) error(data);
				}
			})
    	}
    	this.sizeList = function(sizes){
			var list = '<'+config.results.wrapper+'>';
			console.log('hell', sizes.length);
			$.each(sizes, function(i, item){
				console.log('size', i, item)
				var li = config.results.result;
				$.each(item, function(i, prop){
					console.log('prop', i, prop);
					console.log(li);
					if(i == "height" || i == "width"){
						var replace = (prop >= 1)? prop +' m': (prop*100)+' cm';
						li = li.replace('#'+i+'Formated#', replace);
					}
					li = li.replace(RegExp('#'+i+'#', 'g'), prop);
				});
				list += li;
			});
			list += '</'+config.results.wrapper+'>';
			window.Calculadora.sizeList = list;
    	}
    	this.renderSizes = function(list,el){
			el.html(list);
			console.log('list', Calculadora.sizeList);
    	}
    	this.alturaAprx = function(array,b){
			var a = null;
			$.each(array, function(){
				console.log(this, b)
				if (a == null || Math.abs(this.height - b) < Math.abs(a - b)) {
					a = this.height;
				}
			});
    		return a;
    	}
    	this.calcArea = function(width, height, lossRatio){
    		width = width || null;
    		height = height || null;
    		lossRatio = lossRatio || null;
			var area = width*height;
			console.log('Oarea', area);
			console.log('lossRatio?', lossRatio);
			if (lossRatio) area += area*config.lossRatio/100;
			console.log('Farea', area);
			return area;
    	}
    }
    window.Calculadora = new Calculator();
	$.fn.Calc_calculadora = function(){
		console.log('Calculadora', Calculadora);
		$(this).html('<form name="Calculadora"><fieldset><label>largura: <input name="calc_width">m</label><label>altura: <input name="calc_height">m</label></fieldset><p>As estampas da Decoratons tem sua repetição composta em 59x59cm, mediante isso, para um encaixe perfeito das estampas aconselhamos uma porcentagem extra em sua compra.</p><label><input type="checkbox" name="useLossRatio" class="hidden"/><span> Selecione aqui para confirmar essa adição.</span></label><span>Obs: Não utilize o adicional em estampas com listras verticais.</span><button type="submit">Calcular</button></form>');
		$(this).find('form input').mask("###0,00", {reverse: true});;
		$(this).find('form').on('submit', function(e){
			e.preventDefault();
			var width = $(this).find('[name="calc_width"]')[0].value.replace('.','').replace(',','.');
			var height = $(this).find('[name="calc_height"]')[0].value.replace('.','').replace(',','.');
			if(width.length > 0 && width > 0 && height.length > 0 && height > 0){
				console.log('Loss?', $(this).find('[name="useLossRatio"]').attr('checked'));
				var area = Calculadora.calcArea(width, height, ($(this).find('[name="useLossRatio"]').attr('checked'))? true : false);
				var event = new CustomEvent("Calculadora.dimensaoAlterada");
				event.width = width;
				event.height = height,
				event.area = area
				window.dispatchEvent(event);
				$(window).trigger('Calculadora.dimensaoAlterada');
			}else{
				alert('Por favor, insira as dimensões!');
			}
		});
	}
	$.fn.Calc_tamanhos = function(){
		var $this = $(this);
		Calculadora.getSizes(function(){
			Calculadora.sizeList(Calculadora.sizes);
			Calculadora.renderSizes(Calculadora.sizeList, $this);
			$this.append('<a href="javascript:alert(\'Por Favor, Selecione um Tamanho!\')">Comprar</a>')
		});
		window[(window.addEventListener)? 'addEventListener': 'attachEvent']('Calculadora.dimensaoAlterada', function(e){
			console.log('Alterado', e);
			$this.find('.tamanho').each(function(){
				$(this).find('input[name="calc_quant"]').val(Math.ceil(e.area/$(this).attr('data-area')));
			});
			$this.find('.tamanho[data-height="'+Calculadora.alturaAprx(Calculadora.sizes,e.height)+'"]').each(function(){
				$(this).siblings().removeClass('match');
				$(this).addClass('match');
				$(this).find('input[type="radio"]').click();
				$this.find('a').attr('href', $this.find('input[type="radio"]:checked')[0].value);
			});
		});
	}
}(window, document, jQuery));