if($('body.produto').length > 0){

	if($(this).find('.skuBestPrice').length){
		var desconto = $(this).find('p[class^="flag desconto-no-boleto"]').text();
		var preco = $(this).find('.skuBestPrice').text().replace(' ','').split('$')[1];
		var total = calcDesc(preco, desconto);
		$(this).find('p.descricao-preco').append('<em class="preco-boleto">ou R$ '+total+' no boleto</em>');
	}

	// Alteracao SKU //
		var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
		var elementChange    = new MutationObserver (function(){
			$('.buy-box').each(function(){
				var desconto = $(this).find('p[class^="flag desconto-no-boleto"]').text();
				var preco = $(this).find('.skuBestPrice').text().replace(' ','').split('$')[1];
				var total = calcDesc(preco, desconto);
				$(this).find('p.descricao-preco').append('<em class="preco-boleto">ou R$ '+total+' no boleto</em>');
			});
		});
		$(".buy-box .productName").each ( function () {
			elementChange.observe (this, {childList: true, characterData: true, attributes: true, subtree: true });
		});
	// Alteracao SKU //

	$('.product-info menu button[name=productDescription]').addClass('active');
	$('.product-info .info article.productDescription').addClass('active');
	$('.product-info menu button').click(function(){
		$('.product-info menu button').removeClass('active');
		$(this).addClass('active');
		var prodCampo = $(this).attr('name');
		$('.product-info .info .active').removeClass('active');
		$('.product-info .info article.'+prodCampo).addClass('active');
	});

	$('li.specification').click(function(){
		$('.dimensoes-obs').slideToggle();
	});


	$('.product-box .ProductInfo .Availability').each(function(){
		var prontaEntrega = $('.product-box .ProductInfo .flag.pronta-entrega');
		if(prontaEntrega.length){
			$(this).find('span').text(prontaEntrega.text());
			prontaEntrega.remove();
		}else{
			$(this).remove();
		}
	});
	
	$('.sku-selector-container .Tamanho .specification').on('hover', function(){
		 $('.skus-dimensoes').addClass('active');
	 });

	 $('.sku-selector-container .Tamanho .specification').on('mouseout', function(){
		 $('.skus-dimensoes').removeClass('active');
	});

	$('button[name="formas-pagamento"]').on('click', function(){
		$(this).siblings('.formas-de-pagamento').toggleClass('active');
	});

	$('.bt-close-pgto').on('click', function(event){
		$('.formas-de-pagamento').removeClass('active');
	});
	
	$(window).on('skuSelected.vtex', function(){
		($('.plugin-preco .skuBestPrice').length)? $('.buy-box').removeClass('sku-unavailable'): $('.buy-box').addClass('sku-unavailable');
	});

	$("#___rc-p-id").each(function(index) {
		var id = $(this).attr("value");
		var data = "/api/catalog_system/pub/products/search/?fq=productId:"+id+"";

		// jSon Mounting Details Elements //
			$.getJSON(data, function(data) {
				$.each(data, function(key, val) {

                    console.log(data);

                    var Precaucoes = val.Precauções;
                    var Vantagens = val.Vantagens;
                    var Caracteristicas = val.Caracteristicas;

                    $('#prod-precaucoes').text(Precaucoes);
                    $('#prod-vantagens').text(Vantagens);
                    $('#prod-caracteristicas').text(Caracteristicas);

                    // Mounting Details Elements //
                    var test1 = $('#prod-precaucoes').text();
                    var result2 = test1.replace(/;/g,';<br/>');
                    $('#prod-precaucoes').html(result2);

                    var test5 = $('#prod-vantagens').text();
                    var result5 = test5.replace(/;/g,';<br/>');
                    $('#prod-vantagens').html(result5);
                // Mounting Details Elements //

					// Cad P //
						var HeightPaperP = val.AlturaP;
						var WidthPaperP = val.LarguraP;
						var txtPaperP = val.TextoP;
					// Cad P //

					// Cad M //
						var HeightPaperM = val.AlturaM;
						var WidthPaperM = val.LarguraM;
						var txtPaperM = val.TextoM;
					// Cad M //

					// Cad G //
						var HeightPaperG = val.AlturaG;
						var WidthPaperG = val.LarguraG;
						var txtPaperG = val.TextoG;
					// Cad G //

					/* Mounting Width Box Doubt */
						$('<h2 class="txt-black txt-sz-24">Dimensões</h2>').insertBefore('.sku-section #prod-dimensoes');
						$('<span class="tlt-dim">Tamanhos disponíveis:</span>').appendTo('.sku-section #prod-dimensoes');
						$('<span class="dados-dimensions height P">'+HeightPaperP+' x '+WidthPaperP+' = '+txtPaperP+'</span>').appendTo('.sku-section #prod-dimensoes');
						$('<span class="dados-dimensions height M">'+HeightPaperM+' x '+WidthPaperM+' = '+txtPaperM+'</span>').insertAfter('.sku-section #prod-dimensoes .height.P');
						$('<span class="dados-dimensions height G">'+HeightPaperG+' x '+WidthPaperG+' = '+txtPaperG+'</span>').insertAfter('.sku-section #prod-dimensoes .height.M');
					/* Mounting Width Box Doubt */


					/* Mounting Info Width */
						$('ul.skus-dimensoes li').remove();
						$('<li class="dados-dimensions height P">(A) '+HeightPaperP+'<br />(L) '+WidthPaperP+'</li>').appendTo('.sku-section ul.skus-dimensoes');
						$('<li class="dados-dimensions height M">(A) '+HeightPaperM+'<br />(L) '+WidthPaperM+'</li>').insertAfter('.sku-section ul.skus-dimensoes li.height.P');
						$('<li class="dados-dimensions height G">(A) '+HeightPaperG+'<br />(L) '+WidthPaperG+'</li>').insertAfter('.sku-section ul.skus-dimensoes li.height.M');
					/* Mounting Info Width */
					

					/* Mounting Table Info */
						$('<table><tr><td></td><td><strong>ALTURA</strong></td><td><strong>LARGURA</strong></td></tr><tr><td>P</td><td>'+HeightPaperP+'</td><td>'+WidthPaperP+'</td></tr><tr><td>M</td><td>'+HeightPaperM+'</td><td>'+WidthPaperM+'</td></tr><tr><td>G</td><td>'+HeightPaperG+'</td><td>'+WidthPaperG+'</td></tr></table>').appendTo('.atributos .dimensoes');
					/* Mounting Table Info */

				});
			});
		// jSon Mounting Details Elements //


		// EasyZoom Product Image //
			$.getJSON(data, function(data) {
				$.each(data, function(key, val) {
					var elements = val.items[0].images;

					$(elements).each(function(data, val){
						// Take Image Thumbs //
							var myLabel = val.imageLabel;
							var myImageID = val.imageId;
							var myImageName = val.imageText;
							$('<li class="'+myLabel+'"><a href="/arquivos/ids/'+myImageID+'-1000-1000/'+myImageName+'.jpg" data-standard="/arquivos/ids/'+myImageID+'-550-550/'+myImageName+'.jpg"><img src="/arquivos/ids/'+myImageID+'-100-100/'+myImageName+'.jpg" /></a></li>').appendTo('ul.thumbnails');
						// Take Image Thumbs //

						var myFirst = $('.thumbnails li').first();
						myFirst.addClass('first-thumb');

						var firstThumbStand = $('.thumbnails li.first-thumb a').attr('data-standard');
						var firstThumbLink = $('.thumbnails li.first-thumb a').attr('href');
						var firstThumbEx = $('<a href="'+firstThumbLink+'"><img src="'+firstThumbStand+'"/></a>');
						firstThumbEx.appendTo('.easyzoom');
						$('.easyzoom a:first-of-type').nextAll().remove();

						// Instantiate EasyZoom instances
						var $easyzoom = $('.easyzoom').easyZoom();

						// Setup thumbnails example
						var api1 = $easyzoom.filter('.easyzoom--with-thumbnails').data('easyZoom');
						$('.thumbnails').on('click', 'a', function(e) {
							var $this = $(this);
							e.preventDefault();
							// Use EasyZoom's `swap` method
							api1.swap($this.data('standard'), $this.attr('href'));
						});
					});
				});
			});
		// EasyZoom Product Image //
	});
}