// $.getScript('http://io.vtex.com.br/vtex.js/2.2.0/vtex.min.js');

$(document).ready(function(event){
	$('.sizeList li span').click(function(){
		$(this).find('input').removeAttr('checked');
		$(this).prev().attr('checked', 'checked');
		var myLink = $(this).prev().attr('value');
		$('.sizeList a').css('display', 'block');
		$('.sizeList a').attr('href', myLink);
	});
});


$(document).ajaxStop(function(){
	$('.sizeList li span').click(function(){
		$(this).find('input').removeAttr('checked');
		$(this).prev().attr('checked', 'checked');
		var myLink = $(this).prev().attr('value');
		$('.sizeList a').css('display', 'block');
		$('.sizeList a').attr('href', myLink);
	});
});

// Polyfill Evento Customizado
	(function () {
	  if ( typeof window.CustomEvent === "function" ) return false;

	  function CustomEvent ( event, params ) {
	    params = params || { bubbles: false, cancelable: false, detail: undefined };
	    var evt = document.createEvent( 'CustomEvent' );
	    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
	    return evt;
	   }

	  CustomEvent.prototype = window.Event.prototype;

	  window.CustomEvent = CustomEvent;
	})();
// Polyfill Evento Customizado

// Minicart
	(function($) {
		'use strict';

		var settings = {
			effect: 'overlay'
		};

		var cart = null;

		var helper = {
			openCart : function(){
				var width = $(cart).width() * -1;

				if(settings.effect == "push"){
					$(settings.wrapper).animate({
						marginLeft:width
					});
				}

				$(cart).animate({
					right:0
				});

				$('.sta-cart-overlay').fadeIn();
			},
			closeCart : function(){
				var width = $(cart).width() * -1;

				if(settings.effect == "push"){
					$(settings.wrapper).animate({
						marginLeft:0
					});
				}

				$(cart).animate({
					right:width
				});

				$('.sta-cart-overlay').fadeOut();
			},
			fillCart : function(){ //
				setTimeout(function() {
					vtexjs.checkout.getOrderForm().done(function(orderForm) {

						var items = orderForm.items;
						var i;

						$(cart).find('.sta-cart-total strong').html('R$ ' + helper.toReal(orderForm.value));

						console.log(orderForm)

						$('.sta-cart .openCart > span').html('R$ ' + helper.toReal(orderForm.value));
						$('.openCart').html('<a href="#" class="link-cart"><i class="ico-cart"></i> <i class="cart-qty"> ' + orderForm.items.length + '</i> <span>R$ ' + helper.toReal(orderForm.value) + ' </span></a>');

						$(cart).find('ul').html('');

						if(items.length > 0){
							for(i = 0; i < items.length; i++){
								$(cart).find('ul').append('<li> <div class="sta-cart-pdt-image"><img src="'+items[i].imageUrl+'" /><span class="sta-cart-pdt-qtd-item">' + items[i].quantity + '</span></div> <div class="sta-cart-pdt-info"> <h4>'+items[i].name+'</h4> <button class="remove-item" data-index="'+i+'"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><polygon fill="#000" points="88.711,86.588 52.121,50 88.709,13.412 86.588,11.291 50,47.878 13.41,11.291 11.289,13.412   47.878,50 11.289,86.588 13.41,88.709 50,52.12 86.59,88.709 "/></svg><span>remover</span></button> <div class="sta-cart-pdt-qtd"></div> <p>R$: ' + helper.toReal(items[i].listPrice) + '</p> </div> </li>');
							}
						}else{
							helper.closeCart();
						}
					});
				}, 500);
			},
			addItem: function(el) {
				var urlTest = ["javascript",":","alert('Por favor, selecione o modelo desejado.');"].join('');
				var url = $(el).attr('href');

				if(url == urlTest){
					alert('Por favor, selecione o modelo desejado.');
					return false;
				} else {

					// var cart = "/checkout/cart/add?sku=" + url.split('sku')[1].split('&')[0].split('=')[1] + "&seller=1&redirect=true&sc=2";
					var cart = url;

					$.ajax({
						url: cart,
						type: 'GET',
						crossDomain: true,
						dataType: 'html',
						success: function(){
							// helper.openCart();
							// helper.fillCart();
							window.location.url = '/checkout/#/cart'
						}
					});
				}
			},
			addItemNoShowCart: function(el) {
				var urlTest = ["javascript",":","alert('Por favor, selecione o modelo desejado.');"].join('');
				var url = $(el).attr('href');

				if(url == urlTest){
					alert('Por favor, selecione o modelo desejado.');
					return false;
				} else {

					// var cart = "/checkout/cart/add?sku=" + url.split('sku')[1].split('&')[0].split('=')[1] + "&seller=1&redirect=true&sc=2";
					var cart = url;

					$.ajax({
						url: cart,
						type: 'GET',
						crossDomain: true,
						dataType: 'html',
						success: function(){
							helper.fillCart();
							helper.closeCart();

						}
					});
				}
			},
			removeItem : function(index){
	            vtexjs.checkout.getOrderForm().then(function (orderForm) {
	                var item = orderForm.items[index];
	                item.index = index;
	                return vtexjs.checkout.removeItems([item]);
	            }).done(function (orderForm) {
	                helper.fillCart();
	            });
			},
			toReal : function(val){
				val = val / 100;
				val = val.toFixed(2).toString().replace('.',',');
				val = val.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");

				return val;
			},
			selectSku: function(){
				// #Click add produto vitrine
				$('.product-actions .btn.comprar-product').on('click', function(event) {
					event.preventDefault();
					var idSku = $(this).parent().parent().find('.product-content .content-select-sku > ul > li.active').attr('data-sku');
					var qty = $(this).prev().find('.list-count .result input').val();
					if(idSku == undefined){
						alert('Selecione tamanho ou cor');
					}else{
						var cart = "/checkout/cart/add?sku=" + idSku + "&seller=1&redirect=true&sc=2";

						$.ajax({
							url: cart,
							type: 'GET',
							crossDomain: true,
							dataType: 'html',
							success: function(){
								helper.openCart();
								helper.fillCart();
							}
						});
					}
				});

				// Click aumenta quantidade
				$('.list-count .qty-more').on('click', function(event) {
					event.preventDefault();
					var $qty = parseInt($(this).parent().parent().find('.result input').val());
					$(this).parent().parent().find('.result input').attr('value', $qty + 1);
				});

				// Click diminui quantidade
				$('.list-count .qty-less').on('click', function(event) {
					event.preventDefault();
					var $qty = parseInt($(this).parent().parent().find('.result input').val());

					if($qty <= 1) {
						$(this).parent().parent().find('.result input').attr('value', '1');
					}else{
						$(this).parent().parent().find('.result input').attr('value', $qty - 1);
					}
				});

				// Add id sku
				$('.product-insertsku > fieldset > ul > li').each(function (index, item) {
					$(this).parents('.product-insertsku').parent().parent().parent().find('.product-content .content-select-sku > ul').append('<li data-sku="' + $(this).find('.insert-sku-checkbox').attr('rel') + '">' + $(this).find('.insert-sku-quantity').attr('title').split(" ")[0]) + '<li>';
				});

				// Deixa sku ativo
				$('.content-select-sku > ul > li').on('click', function(event) {
					$('.content-select-sku > ul > li').removeClass('active');
					$(this).addClass('active');
				});
			}
		};

		$.fn.vtexcart = function(parameters) {
			var el = this;
			settings = $.extend(settings, parameters);
			var cartHtml = '<div class="sta-cart-overlay"></div><div class="sta-cart-container"> <div class="sta-cart-title"> <button class="sta-cart-close"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><polygon fill="#000" points="88.711,86.588 52.121,50 88.709,13.412 86.588,11.291 50,47.878 13.41,11.291 11.289,13.412   47.878,50 11.289,86.588 13.41,88.709 50,52.12 86.59,88.709 "/></svg></button> <h3>Minha Compra<span class="qtd-cart"></span></h3> </div> <div class="sta-cart-items"> <ul></ul> </div> <div class="sta-cart-resume"> <span class="sta-cart-sub">Subtotal<strong>R$ 0,00</strong></span> <span class="sta-cart-freight">Frete<strong style="display:none">0</strong><button>Calcular</button><input type="text" /></span> <span class="sta-cart-total">Total: <strong>R$ 0,00</strong></span> <button class="bt-comprar" datahref="/checkout/#/cart"><span>Finalizar Pedido</span></button> </div> </div>';
			var miniCartHtml = '<a href="#" class="openCart link-cart"><span></span></a>';

			$(el).append(cartHtml);

			if(settings.cartButton){
				if($('.sta-cart .openCart').length == 0){
					$(settings.cartButton).append(miniCartHtml);
				}
			}

			cart = $(el).find('.sta-cart-container');

			helper.fillCart();

			//DIRECTIVES
			$('body').delegate('.comprarNow a','click', function(event){
				helper.addItem($(this));
				event.preventDefault();
			});

			$(settings.buyButton).on('click', function(event){
				helper.addItem($(this));
				event.preventDefault();
			});

			$('.btn-add-carrinho').on('click', function(event){
				event.preventDefault();
				$(this).attr('href', $('.buy-button').attr('href'));
				helper.addItemNoShowCart($(this));

				$("html, body").animate({scrollTop: 0}, 300);
				setTimeout(function(){
					helper.closeCart();
				},1200);

			});

			$('.openCart').on('click', function(event){
				helper.openCart();
				event.preventDefault();

			});

			$('.sta-cart-close, .sta-cart-overlay').on('click', function(){
				helper.closeCart();
			});

			$('.sta-cart-container').on('click','.remove-item', function(){
				var index = $(this).data('index');
				helper.removeItem(index);
			});

			$('.sta-cart-freight button').click(function(){
				$(this).hide();
				$('.sta-cart-freight input').show();
			});

			helper.selectSku();

			//Delegate ajax paginação
			$('body.categoria').on('click', '.pager.bottom .pages > li', function(event) {
				var interval = setInterval(function(){
					if ($('.content-select-sku > ul > li').length == 0) {
						helper.selectSku();
						clearInterval(interval);
					}
				},500);
			});
		};

	} (jQuery));

	$(function() {
	    $("body").vtexcart({
	        buyButton: $(".buy-button"),
					addCartButton: $(".btn-add-carrinho"),
	        wrapper: $(".container"),
	        effect: "overlay",
	        cartButton: $(".sta-cart")
	    })

	    $('header #mini-cart').click(function(){
	    	$('.sta-cart-container').animate({right: 0},300);
		});
		
		$('header #mini-cart').mouseenter(function(){
			$('.sta-cart-container').addClass('active');
		});
		
		$('.sta-cart-container').mouseleave(function(){
			$('.sta-cart-container').removeClass('active');
		})

	});
// Minicart

// Popup
	(function(window, document, $){
		'use strict';
		function Popup(){
			self = this;
			var popups = new Object();
			this.needScrolling = function(el){
				if (el[0].scrollHeight > el[0].clientHeight ) {
					el.css({'overflow-y': 'scroll'});
				}else{
					el.css({'overflow-y': 'hidden'});
				}
			}
			this.setWrapper = function(el){
				popups['wrapper'] = el;
				popups['wrapper'].on('click', function(e){
					$(this).fadeOut();
					self.closeAll();
				});
			}
			this.popups = function(className){
				popups['children'] = popups['wrapper'].selector+' '+className;
				popups['wrapper'].find(className).on('click', function(e){
					e.stopPropagation();
				})
			}
			this.newPopup = function(name, el){
				popups[name] = el;
				$(window).resize(function() {
					if (popups[name].hasClass('active')) self.needScrolling(popups[name]);
				});
				var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
				var elementChange    = new MutationObserver (function(){
				   if (popups[name].hasClass('active')) self.needScrolling(popups[name]);
				});
				elementChange.observe($(el)[0], {childList: true, subtree: true});
			}
			this.open = function(name){
				popups['wrapper'].fadeIn();
				popups[name].fadeIn().addClass('active');
				popups[name].prevAll().addClass('inactive');
				self.needScrolling(popups[name]);
			}
			this.close = function(name){
				popups[name].fadeOut().removeClass('active');
				popups[name].prev().removeClass('inactive');
				if(!$(popups['children']+'.inactive').length) popups['wrapper'].fadeOut();
			}
			this.closeAll = function(){
				popups['children'].fadeOut().removeClass('active');
				popups['wrapper'].fadeOut();
			}
		}
		window.Popupinator = new Popup();
	}(window, document, jQuery));
// Popup

// Calculadora
	(function (window, document, $) {
	    'use strict';

	    function Calculator(){
	    	var config = {
	    		ac: 'CC', // entidade
	    		an: 'api', // loja
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

				$('.sizeList li span').click(function(){
					$(this).find('input').removeAttr('checked');
					$(this).prev().attr('checked', 'checked');
					var myLink = $(this).prev().attr('value');
					$('.sizeList a').css('display', 'block');
					$('.sizeList a').attr('href', myLink);
				});				
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
			$(this).html('<form name="Calculadora"><fieldset><label>largura: <input name="calc_width">m</label><label>altura: <input name="calc_height">m</label></fieldset><p>As estampas da Decoratons tem sua repetição composta em 59x59cm, mediante isso, para um encaixe perfeito das estampas aconselhamos uma porcentagem extra em sua compra.</p><label><input type="checkbox" name="useLossRatio" class="hidden"/><span>Selecione aqui para confirmar essa adição.</span></label><span>Obs: Não utilize o adicional em estampas com listras verticais</span><button type="submit">Calcular</button></form>');
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

		$('.sizeList li span').click(function(){
			$(this).find('input').removeAttr('checked');
			$(this).prev().attr('checked', 'checked');
			var myLink = $(this).prev().attr('value');
			$('.sizeList a').css('display', 'block');
			$('.sizeList a').attr('href', myLink);
		});

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

	$('.sizeList li span').click(function(){
		$(this).find('input').removeAttr('checked');
		$(this).prev().attr('checked', 'checked');
		var myLink = $(this).prev().attr('value');
		$('.sizeList a').css('display', 'block');
		$('.sizeList a').attr('href', myLink);
	});

// Calculadora

// Tickets
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
// Tickets

(function (window, document, $) {
    'use strict';

    var __ec_dataEach = function(props){
    	var el = '';
    	if(props.data){
    		$.each(props.data, function(index, value) {
    			el += ' data-'+value.name +'="'+value.id+'"';
    		});
    	}
    	return el;
    }

    var __ec_propsComun = function(props){
    	var el = '';
    	el += (props.id) ? ' id="' + props.id + '"' : '';
    	el += (props.class) ? ' class="' + props.class + '"' : '';
    	el += (props.style) ? ' style="' + props.style + '"' : '';
    	return el;
    }

    var __ec_img = function(props){
    	var img = '\n'+'<img';
            img += __ec_dataEach(props);
    	    img += __ec_propsComun(props);
    	    img +=' src="'+props.src+'" ';
            img += (props.title) ? ' title="'+props.title+'" ' : '';
            img += (props.title) ? ' alt="'+props.title+'" ' : '';
            img += (props.width) ? ' width="'+props.width+'" ' : '';
            img += (props.height) ? ' height="'+props.height+'"' : '';
            img += '/>';
      return img;
    }

    var __ec_element = function(props){
    		if(props.type == 'img'){
    			return __ec_img(props);
    		}
    		var el = "";
    				el += "\n<" + props.type;
    				el += __ec_dataEach(props);
    				el += __ec_propsComun({id: props.id, class: props.class, style: props.style});
    				el += '>';
    				el += (props.content) ? props.content : '';
    				el += "</"+props.type+">"+'\n';

    			return el;
    }


    window.__ec_img = __ec_img;
    window.__ec_propsComun = __ec_propsComun;
    window.__ec_dataEach = __ec_dataEach;
    window.__element = __ec_element;

}(window, document, jQuery));

(function() {
  var method;
  var noop = function() {};
  var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];

    if (!console[method]) {
      console[method] = noop;
    }
  }
});


jQuery.fn.simulateClick = function() {
	return this.each(function() {
		if ('createEvent' in document) {
			var doc = this.ownerDocument,
			evt = doc.createEvent('MouseEvents');
			evt.initMouseEvent('click', true, true, doc.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
			this.dispatchEvent(evt);
		} else {
			this.click();
		}
	});
}


var body = $('body'),
	htmlBody = $('html, body'),
	$document = $(document),
	header = $('#header'),
	submenuDesktopWrapper = $('.js-submenu-wrap'),
	userSubmenu = $('.submenu-user'),
	sidePanelMobile = $('.side-panel'),
	mobileSubmenu = $('.submenu-mobile'),
	minicart = $('.minicart'),
	slide = $('.slide'),
	slideShelf = $('.slideShelf'),
	slideBrands = $('.servicos-e-cursos .servicos'),
	carousel = $('.shelf-carousel'),
	backToTop = $('.js-back-to-top'),
	shelf = $('.prateleira'),
	paginatedShelf = $('.prateleira[id*=ResultItems]'),
	orderList = $('.order-list'),
	formNews = $('.newsletter'),
	depCatBus = $('.dep-cat-bus'),
	duvidasFrequentes = $('.duvidas'),
	pagProduto = $('.produto'),
	sidebar = $('.sidebar');

	function masterDataContato(){
	    var jsonSaveDadosUser = {
	        "nome": $("#cl_nome").val(),
	        "email": $("#cl_email").val(),
	        "tel": $("#cl_telefone").val(),
	        "empresa": $("#cl_empresa").val(),
	        "mensagem": $("#cl_mensagem").val(),
	    };

	    var storename = 'decoratons';
	    var dataEntity = 'FC';

	    var urlSaveDadosUser = '/'+storename+'/dataentities/'+dataEntity+'/documents/';

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


$(function() {

	// Smooth Scrolling //

		$('a[href*="#"]').click(function(event){
		  	event.preventDefault();
			var target = $(this).attr('href');
			try{
				var targetOffset = ($(target).offset().top) - 250;
			}
			catch(err){}
			$('html, body').animate({ scrollTop: targetOffset}, 300);
		});

	// Smooth Scrolling //

	// Ajuste Meus Pedidos //
		if (orderList.length > 0) {
			orderList.find('link').remove();
			orderList.find('.page-header').unwrap('.container');
		}
	// Ajuste Meus Pedidos //

	// Search Toggle //
		$('.search-toggle').click(function(){
			$('.main-header .search-box').toggleClass('--active');
		});
	// Search Toggle //

	// Tabs Shelf Home //
		$('.tabs-destaque a').click(function(){
			$('.tabs-destaque a').removeClass('active');
			var guardaClass = $(this).attr('class');
			var findShelfs = $(this).parent();
			var teste = findShelfs.parent();
			var testeDois = teste.parent();
			var testeTres = testeDois.parent();
			var mamae = testeTres.find('div');
			mamae.removeClass('active');
			$('.prateleiras-destaque div.shelf-'+guardaClass+'').addClass('active');
			$(this).addClass('active');
			$('.slick-next').simulateClick('click');
		});

	// Tabs Shelf Home //

	// Botões quantidade
		$('.quantitySelector').each(function(){
			var $input = $(this).find('input[type="number"]');
			$input.before('<button class="qnt-more">+</button>');
			$input.after('<button class="qnt-less">-</button>');
			$(this).on('click', 'button.qnt-more',function(e){
				if (parseInt($input[0].value) < parseInt($input[0].attributes.max.value)) $input[0].value++;
				$input.change();
			});
			$(this).on('click', 'button.qnt-less',function(e){
				if (parseInt($input[0].value) > parseInt($input[0].attributes.min.value)) $input[0].value--;
				$input.change();
			});
		});
	// Botões quantidade

	// Campo Produto
		$('body.produto').each(function(){
			$.ajax({
				url: '/api/catalog_system/pub/products/search?fq=productId:'+$('#___rc-p-id')[0].value,
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				success: function(data){
					var config = {
						listSpec:{
							wrapper: 'ul',
							content: '<li>#icon#<span>#value#</span></li>'
						},
						detalhamentoIcons: {
							"Auto Adesivo": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512"><path d="M241.939.002c-60.718 3.367-120.5 28.242-166.904 74.641-100.047 100.053-100.047 262.263 0 362.316 50.031 50.023 115.592 75.039 181.17 75.039 65.561 0 131.139-25.016 181.155-75.039 46.39-46.398 71.28-106.171 74.64-166.904L241.939.002zm215.467 245.647c-16.405-2.836-32.468-7.43-48.046-13.743-29.109-11.812-55.25-29.164-77.672-51.585-24.062-24.054-42.217-52.265-53.998-83.851a235.322 235.322 0 0 1-11.344-41.882l191.06 191.061zm-163.279-53.368l85.218 149.116H208.909l85.218-149.116zM184.331 341.397h-50.734l53.781-89.647 24.687 41.124-27.734 48.523zm237.935 80.469c-22.423 22.421-48.562 39.78-77.671 51.586-28.157 11.413-57.875 17.194-88.39 17.194-30.516 0-60.25-5.781-88.39-17.194-29.125-11.806-55.25-29.165-77.672-51.586-22.421-22.43-39.796-48.562-51.593-77.68-11.421-28.141-17.203-57.874-17.203-88.382 0-30.516 5.781-60.249 17.203-88.39 11.797-29.117 29.172-55.25 51.593-77.679 20.797-20.804 44.875-37.288 71.546-48.999 22.938-10.071 47.125-16.344 72.094-18.711l8.28 8.281c2.86 45.898 18.016 91.179 45.469 130.476L224.19 271.625l-36.812-61.375-91.5 152.499h320.248l-90.937-159.131c44.593 40.687 100.062 62.789 156.498 66.311l8.297 8.298a233.49 233.49 0 0 1-18.702 72.077c-11.719 26.68-28.22 50.757-49.016 71.562z" fill="#147eb8"/></svg>',
							"Tinta Atóxica": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 505.923 505.923" width="512" height="512"><path d="M397.529 58.225c-37.359 0-72.27 11.235-100.957 32.49-25.401 18.819-44.228 44.84-51.653 71.391-8.498 30.386-1.593 57.841 18.431 75.96-6.892 12.102-13.298 24.592-18.372 36.707-4.66-11.592-10.865-21.973-17.882-31.224 9.949-15.808 11.327-35.12 3.511-54.911-7.36-18.635-22.266-35.818-41.974-48.386-21.258-13.556-46.288-20.721-72.383-20.721-33.485 0-67.836 12.078-99.338 34.928L0 166.727l20.162 5.478c33.26 9.036 59.805 34.679 83.225 57.303 23.91 23.098 46.495 44.914 72.659 44.921h.012c12.875 0 25.18-5.146 37.498-15.667 11.82 16.664 20.228 37.094 20.228 61.938v127h20l.018-129.384c0-15.96 9.362-39.486 26.042-68.882 12.387 6.689 23.962 9.954 35.235 9.954 36.76 0 60.665-35.173 85.974-72.41 22.59-33.238 48.194-70.911 86.29-90.421l18.581-9.516-19.061-8.516c-30.153-13.47-60.209-20.3-89.334-20.3zM176.058 254.428h-.007c-18.085-.005-36.938-18.218-58.768-39.306-20.663-19.961-43.588-42.108-72.305-55.135 23.345-13.586 47.248-20.456 71.272-20.456 48.227 0 84.676 28.4 95.755 56.453 2.869 7.266 5.835 19.295.99 31.335-17.942-18.216-37.69-30.663-49.979-38.408-3.594-2.266-6.698-4.222-8.771-5.695l-11.59 16.299c2.526 1.797 5.85 3.892 9.697 6.316 12.659 7.979 31.868 20.09 48.451 37.523-8.638 7.436-16.76 11.074-24.745 11.074zm208.452-78.693c-23.213 34.155-43.261 63.652-69.432 63.652-7.676 0-15.897-2.358-24.996-7.165a623.347 623.347 0 0 1 2.722-4.348c19.815-31.329 39.938-56.696 40.139-56.949l-15.649-12.454c-1.715 2.155-22.828 28.846-43.394 61.905-12.095-13.03-15.666-31.622-9.72-52.884 6.252-22.354 22.397-44.482 44.298-60.708 17.584-13.028 47.309-28.56 89.051-28.56 20.458 0 41.53 3.779 62.861 11.258-32.716 22.745-55.46 56.209-75.88 86.253z" fill="#147eb8"/></svg>',
							"Fácil Aplicação": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512"><g fill="#147eb8"><path d="M431.952 412.913V10c0-5.523-4.478-10-10-10H49.956c-5.523 0-10 4.477-10 10v451.958l-.002.039c0 27.572 22.43 50.003 50 50.003l.088-.002H421.851l.196.002c27.57 0 50-22.431 50-50.003-.001-24.323-17.285-44.634-40.095-49.084zM338.954 20h72.999v23.251h-72.999V20zm0 43.251h72.999v348.748h-72.999V63.251zM245.953 20h73.002v23.251h-8.038c-5.523 0-10 4.477-10 10s4.477 10 10 10h8.038v348.748h-73.002V20zm-92.999 0h72.999v392h-72.999V20zm-33.039 443.538c-.803 15.794-13.903 28.425-29.891 28.462h-.006a1.368 1.368 0 0 1-.064.002c-16.533-.002-29.986-13.447-30-29.979l.002-.026V20h72.999v392H90.047l-.031.001-.063-.001c-5.523 0-10 4.477-10 10s4.477 10 10 10c.285 0 .568.014.852.022.241.007.482.008.723.02.248.013.494.038.742.057.261.02.524.035.783.062.201.021.4.052.602.077.301.038.603.071.901.117.146.022.288.053.433.077.351.06.703.119 1.051.19.07.015.139.033.208.049 13.04 2.799 22.972 14.105 23.667 27.79a30.194 30.194 0 0 1 0 3.077zM422.142 492l-.188-.002H129.927c.355-.472.694-.956 1.034-1.441.043-.063.088-.124.132-.187.3-.433.589-.874.876-1.316.105-.164.211-.327.314-.491.266-.421.525-.847.777-1.276.11-.187.217-.375.325-.564.245-.43.489-.86.723-1.298.083-.156.16-.315.241-.471.448-.863.871-1.74 1.27-2.631.088-.195.18-.387.264-.583.166-.385.321-.775.479-1.165.121-.304.244-.607.36-.914.14-.369.273-.74.405-1.112a62.917 62.917 0 0 0 .69-2.099c.122-.405.235-.814.348-1.224.085-.308.175-.614.254-.924.178-.698.34-1.401.488-2.11l.041-.194h42.039c5.523 0 10-4.477 10-10s-4.477-10-10-10h-42.039l-.043-.198a50.29 50.29 0 0 0-.484-2.098c-.083-.324-.177-.643-.266-.965a45.584 45.584 0 0 0-.335-1.179c-.11-.367-.23-.729-.349-1.093a43.625 43.625 0 0 0-.34-1.001 36.586 36.586 0 0 0-.762-2.02c-.16-.399-.318-.798-.488-1.192-.076-.177-.16-.35-.238-.525a48.96 48.96 0 0 0-1.297-2.691c-.08-.154-.155-.31-.236-.462a52.345 52.345 0 0 0-.719-1.29c-.111-.193-.221-.387-.334-.579a47.32 47.32 0 0 0-1.102-1.78c-.279-.431-.561-.86-.852-1.281-.063-.091-.128-.179-.191-.269-.323-.461-.646-.924-.985-1.374h292.119l.127-.001.378-.002c16.264 0 29.495 13.458 29.495 30.001 0 16.51-13.405 29.95-29.904 30.001z"/><path d="M209.954 452.001h-.235c-5.523 0-10 4.477-10 10s4.477 10 10 10h.235c5.522 0 10-4.477 10-10s-4.477-10-10-10zM282.184 43.251h-.236c-5.523 0-10 4.477-10 10s4.477 10 10 10h.236c5.524 0 10-4.477 10-10 0-5.522-4.476-10-10-10z"/></g></svg>',
							"Produto Lavável": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 329.983 329.983" width="512" height="512"><g fill="#147eb8"><path d="M175.426 1.282a7.498 7.498 0 0 0-6.183 3.255c-4.089 5.955-100.145 146.668-100.145 217.837 0 58.629 47.698 106.327 106.327 106.327s106.326-47.698 106.326-106.327c0-71.169-96.055-211.882-100.144-217.837a7.496 7.496 0 0 0-6.181-3.255zm0 312.419c-50.358 0-91.327-40.969-91.327-91.327 0-56.606 69.872-167.393 91.327-200.073 21.455 32.68 91.326 143.466 91.326 200.073 0 50.358-40.969 91.327-91.326 91.327z"/><path d="M167.927 286.199a7.5 7.5 0 0 0 7.5 7.5c39.33 0 71.328-31.996 71.328-71.323 0-4.142-3.357-7.5-7.5-7.5s-7.5 3.358-7.5 7.5c0 31.057-25.269 56.323-56.328 56.323a7.5 7.5 0 0 0-7.5 7.5zM322.483 31.658h-14.574V17.083c0-4.142-3.357-7.5-7.5-7.5s-7.5 3.358-7.5 7.5v14.575h-14.575c-4.143 0-7.5 3.358-7.5 7.5s3.357 7.5 7.5 7.5h14.575v14.575c0 4.142 3.357 7.5 7.5 7.5s7.5-3.358 7.5-7.5V46.658h14.574c4.143 0 7.5-3.358 7.5-7.5s-3.357-7.5-7.5-7.5zM51.65 257.492H37.075v-14.575c0-4.142-3.357-7.5-7.5-7.5s-7.5 3.358-7.5 7.5v14.575H7.5c-4.143 0-7.5 3.358-7.5 7.5s3.357 7.5 7.5 7.5h14.575v14.575c0 4.142 3.357 7.5 7.5 7.5s7.5-3.358 7.5-7.5v-14.575H51.65c4.143 0 7.5-3.358 7.5-7.5s-3.357-7.5-7.5-7.5z"/></g></svg>',
						}
					}
				},
				error: function(error){
					console.log('error', error);
				}
			});
		});
	// Campo Produto


	// BreadCrumb Ajuste Texto //
		try {
			$('.bread-crumb').find('li:first-child a').text('Home');
		} catch (e) {}


	// Remocao de Li HelperComplement Prateleira
		if ($('.helperComplement').length) {
			$('.helperComplement').remove();
		}
	// Remocao de Li HelperComplement Prateleira


  	// Voltar ao Topo
		$(window).scroll(function() {
			var scroll = $(window).scrollTop();

			if (scroll >= 450) {
				$('.js-back-to-top').addClass('active');
			} else {
				$('.js-back-to-top').removeClass('active');
			}
		});

		body.on('click', '.js-back-to-top', function(event) {
		    event.preventDefault();
		    htmlBody.animate({ scrollTop: 0 }, 300);
		});

		body.on('click', '.bt-open-news', function(event) {
		    event.preventDefault();
		    htmlBody.animate({ scrollTop: 3500 }, 300);
		});
		body.on('click', '.rating-click-here', function(event) {
		    event.preventDefault();
		    htmlBody.animate({ scrollTop: 3500 }, 300);
		});
  	// Voltar ao Topo

	// Compra Rapida
		body.on('click', '.btn-fast-buy', function(event) {
			event.preventDefault();
			var url = $(this).attr('href');
			$.get(url, function(data) {
				vtexjs.checkout.getOrderForm().done(function(orderForm) {
					console.log(orderForm);
					htmlBody.animate({ scrollTop: 0 }, 300);
				});
			});
		});
	// Compra Rapida

	// Slider
		$('.banners-top.slider').slick({
			adaptiveHeight: true,
			autoplay: true,
			autoplaySpeed: 5000,
			pauseOnHover: true,
			arrows: false,
			dots: true,
			draggable: true,
			touchMove: true,
			slidesToShow: 1,
			slidesToScroll: 1
		});
	// Slider

	// Home Tipbar //
		if(window.matchMedia('(max-width: 1024px)').matches){
			$('body.home section.tipBar ul').slick({
			    dots: false,
			    arrows: false,
			    draggable: true,
			    touchMove: true,
			    autoplay: true,
			    autoplaySpeed: 2500,
			    slidesToShow: 2,
			    mobileFirst: true,
			    slidesToScroll: 2,
			    adaptiveHeight: true,
			});
		}
	// Home Tipbar //

	// slideShelf
	    $('.shelf.slider').find('ul').slick({
			dots: false,
			arrows: true,
			draggable: true,
			touchMove: true,
			autoplay: false,
			slidesToShow: 2,
			mobileFirst: true,
			slidesToScroll: 1,
			prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 46.02 46.02"><path d="M14.757 46.02a5.688 5.688 0 0 1-3.929-1.569 5.705 5.705 0 0 1-.204-8.063L23.382 22.97 10.637 9.645a5.703 5.703 0 0 1 8.242-7.884l16.505 17.253a5.707 5.707 0 0 1 .013 7.872L18.893 44.247a5.699 5.699 0 0 1-4.136 1.773z" fill="#FFF"/></svg></button>',
			nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 46.02 46.02"><path d="M14.757 46.02a5.688 5.688 0 0 1-3.929-1.569 5.705 5.705 0 0 1-.204-8.063L23.382 22.97 10.637 9.645a5.703 5.703 0 0 1 8.242-7.884l16.505 17.253a5.707 5.707 0 0 1 .013 7.872L18.893 44.247a5.699 5.699 0 0 1-4.136 1.773z" fill="#FFF"/></svg></button>',
			adaptiveHeight: true,
			responsive: [
				{
					breakpoint: 767,
					settings: {
						slidesToShow: 3
					}
				},
				{
					breakpoint: 991,
					settings: {
						slidesToShow: 4
					}
				},
			]
	    });
	// slideShelf

	// slideShelf
		if (slideBrands.length > 0) {
		    $('.home').find('.servicos-e-cursos .servicos').find('.slider').slick({
				adaptiveHeight: true,
				autoplay: false,
				arrows: false,
				dots: true,
				mobileFirst: true,
				draggable: true,
				touchMove: true,
				slidesToShow: 1,
				slidesToScroll: 1,
				responsive: [
					{
						breakpoint: 991,
						settings: {
							slidesToShow: 1
						}
					},
					{
						breakpoint: 767,
						settings: {
							slidesToShow: 1
						}
					},
					{
						breakpoint: 479,
						settings: {
							slidesToShow: 1
						}
					}
				]
		    });
		}
	// slideShelf

	// Menu SidePanel //
		$('header .js-open-mobile-menu').click(function(){
			$(this).toggleClass('active');
			$('header .menu-header').toggleClass('slideActive');
		});
		$("header nav.menu .has-sub .js-open-sub").click(function() {
		  $(this).toggleClass('active');
		  $(this).next().toggleClass("slideActive");
		});
	// Menu SidePanel //

	function calcDesc(preco, desconto){
		desconto = desconto.match(/(\(\d+%\)|\(\d+\.\d{2}%\))/g)[0].split('%')[0].split('(')[1]/100;
		preco = preco.replace('.','').replace(',','.');
		var precoDesc = (preco*desconto).toFixed(2);
		var total = (preco - precoDesc).toFixed(2);
		total = total.replace('.',',');
		total = total.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
		return total;
	}

	// Desconto Boleto //
		$('.prateleira li').each(function(){
			if($(this).find('.best-price').length){
				var desconto = $(this).find('p[class^="flag desconto-no-boleto"]').text();
				var preco = $(this).find('.best-price').text().replace(' ','').split('$')[1];
				var total = calcDesc(preco, desconto);
				$(this).find('.price').append('<span class="preco-boleto">ou R$ '+total+' no boleto</span>');
			}
		});

	// Desconto Boleto //

	// Usuário deslogado //
		$('.login-out-link').each(function(){
			var _this = $(this);
			vtexjs.checkout.getOrderForm().done(function(orderForm) {
			    if(orderForm.loggedIn){
			    	_this.attr('href','/logout');
			    	_this.find('span').text('Sair');
			    }
		    });
		});
	// Usuário deslogado //

	// Frete Grátis //
		$('.prateleira li').each(function(){
			if($(this).find('.best-price').length){
				var preco = $(this).find('.best-price').text().replace(' ','').split('$')[1];
				preco = preco.replace('.','').replace(',','.');
				if(preco > 200){
					$(this).find('.flag-frete').append('<p class="flag frete-gratis">Frete grátis SP</p>');
				}
			}
		});
	// Frete Grátis //

	// Smart Research //
		if (sidebar.length > 0) {
			try {
				sidebar.find('input[type="checkbox"]').vtexSmartResearch({
					elemLoading: '',
					returnTopText: '',
					elemLoading:'<i class="shelf__loading"></i>',
					filterScrollTop: function(shelfOffset) {
						return 20;
					}
				});
			} catch(e) {}
		}
	// Smart Research //

	// Resultado da busca //

		var termoBusca = $('body.resultado-busca .searchResultsTime .resultado-busca-termo .value').text();
		$('body.resultado-busca h3.tlt-shelf').append(termoBusca);

	// Resultado da busca //

	// Frete Gratis Aberto //
		try {
			$document.ready(function(){
				$('.shipping-value').simulateClick('click');

				$(".box-clipping:nth-child(3n+1)").addClass("colum-edit");
				$(".box-clipping:nth-child(3n+2)").addClass("no-margin pull-text-left");
				$(".box-clipping:nth-child(3n+3)").addClass("no-margin pull-text-right");

				// Buy Button Text //
					$('.buy-button').text('Comprar');
				// Buy Button Text //


				// Slide Toggle Product Description //
					$('.active-desc').click(function(){
						$(this).next().slideToggle();
					});
				// Slide Toggle Product Description //


				// Relacionados Vazio //
					if($('.shelfRelacionados li').length == 0){
						$('.shelfRelacionados').remove();
					}
				// Relacionados Vazio //

			});
		} catch(e) {}
	// Frete Gratis Aberto //

	function unHide(t){
		setTimeout(function(){
			$('header').removeClass('ha-hide');
			$('header').removeClass('ha-hidding');
		}, t);
	}

	// Menu Persistente Begin //
		$(window).scroll(function() {
			var scroll = $(window).scrollTop();
			if (scroll >= 350) {
				$('header').addClass('menu-persistente');
				$('body').addClass('top-height-active');
			} else {
				$('.menu-persistente').addClass('ha-hidding');
				$('.menu-persistente').addClass('ha-hide');
				unHide(99);
				$('header').removeClass('menu-persistente');
				$('body').removeClass('top-height-active');
			}
		});
    // Menu Persistente END //

    // Scripts Pagina de Produto //
		
	    if (pagProduto.length > 0) {
			try {
				$document.ready(function() {
				// Script Quantidade de Produtos END. Pego a quantidade de produtos pelo val e jogo na URL do botao.
					$('.selecao-sku .more').click(function(){
						var $input = $(this).prev();
						$input.val( +$input.val() + 1 );
						var opt_value = $input.val();
						var link = $(this).next();
						var currentURL = $('.buy-button').attr('href');
						var nomedoproduto = currentURL.split(/\&/)[0];
						$('.buy-button').removeAttr('href');
						$('.buy-button').attr('href', nomedoproduto + '&qty=' + opt_value + '&seller=1&redirect=false&sc=1');
					});

					$('.selecao-sku .less').click(function(){
						var $input = $(this).next();
						$input.val( +$input.val() - 1 );
						var opt_value = $input.val();
						var encontraInput = $(this).next();
						var currentURL = $('.buy-button').attr('href');
						var nomedoproduto = currentURL.split(/\&/)[0];

						$('.buy-button').removeAttr('href');
						$('.buy-button').attr('href', nomedoproduto + '&qty=' + opt_value + '&seller=1&redirect=false&sc=1');
					});
		        // Script Quantidade de Produtos END

				});
			} catch(e) {}
	    }

	    // Produto esgotado //

	// Produto esgotado //

    // Scripts Pagina de Produto //


  	// Scripts Departamento //
		if($(depCatBus).length > 0){
			// Adicionando classe nos elementos do Ordernar Por quando ativos
			if(window.location.href.indexOf("OrderByTopSaleDESC")!=-1){
				$(".main-category__orderBy li:nth-child(2) a").addClass("active");
			}
			if(window.location.href.indexOf("OrderByReleaseDateDESC")!=-1){
				$(".main-category__orderBy li:nth-child(3) a").addClass("active");
			}
			if(window.location.href.indexOf("OrderByPriceDESC")!=-1){
				$(".main-category__orderBy li:nth-child(4) a").addClass("active");
			}
			if(window.location.href.indexOf("OrderByPriceASC")!=-1){
				$(".main-category__orderBy li:nth-child(5) a").addClass("active");
			}
			// Adicionando classe nos elementos do Ordernar Por quando ativos
		}
  	// Scripts Departamento //

	// Submenu mobile //
		if(window.matchMedia('(max-width: 1365px)').matches){
			$('.menu-header li').has(".submenu").find(' > a').each(function(){
			    this.removeAttribute('href');
			    $(this).on('click', function(){
			        $(this).siblings('.submenu').toggleClass('slideActive');
			    });
			});
		}
	// Submenu mobile //

	// Modal //
		$('.close-modal, .bg_modal').click(function() {
			$('.modal-opacity').fadeOut(600);
			$('body').removeClass('modal-active');
			$('.modal-content').remove();
		});
		
		$(document).keyup(function(ev) {
			if (ev.keyCode == 27)
			$('.modal-opacity').fadeOut(600);
			$('body').removeClass('modal-active');
		});
	// Modal //


	// Scripts Modal //
	    // Remocao Loading Meus Pedidos//
			try {
				$document.ajaxStop(function() {
					orderList.parents('html').removeClass('is-loading');
				});
			} catch(e) {}
	    // Remocao Loading Meus Pedidos//


	    // Simulate Click Search //
			try {
				$document.ready(function(){
					$('.btn-search').click(function(){
						$('.btn-buscar').simulateClick('click');
					});
				});
			} catch(e) {}
	    // Simulate Click Search //

	    // Scripts Departamento //
			if($(duvidasFrequentes).length > 0){

				// Slide Toggle itens
					$(".tab span").click(function() {
						$(this).toggleClass("active");
						$(this).next().slideToggle();
					});
				// Slide Toggle itens

			}
	  	// Scripts Departamento //
	// Scripts Modal //

	// App instagram //
		$('#insta-app').each(function(){
			if(window.matchMedia('(min-width:1025px)').matches){
				var Class = '';
				var elementClass = $(this).attr('class');
				if(elementClass){
					Class = elementClass;
				}
				$(this).replaceWith('<ul id="insta-app" class="'+Class+'"></ul>');
				var count = 16;
				var userId = '1657718611';
				var accessToken = '1657718611.4b09eb8.66504be972cb41e184a97bf07cea9434';
				$.ajax({
				    url: 'https://api.instagram.com/v1/users/'+userId+'/media/recent/?count='+count+'&access_token='+accessToken,
				    dataType: 'JSONP',
				    jsonpCallback: 'callback',
				    type: 'GET',
				}).done(function(data){
					var post = data.data;
					console.log(post);
					for(i=0; i< post.length; i++){
						var photo = '<li><a href="'+post[i].link+'"><img src="'+post[i].images.thumbnail.url+'"/></a></li>'
						$('#insta-app').append(photo);
					}
				});
			}
		});
	// App instagram //
});
$(window).load(function(){
	// Cancelar login //
    	$('#vtexIdUI-auth-selector .modal-header .close').click(function(){
			window.location.href = window.location.href.split('/login?')[0];
		});
    // Cancelar login //	
});

// Compre Junto //
	$(window).load(function(){
		$('body').find('#divCompreJunto').each(function(){
		    $(this).find('img').each(function(){
		        this.src = this.src.replace(/-90-90/g,'-300-225');
		        this.width = 300;
		        this.height = 225;
		    });
		    $(this).find('.buy').each(function(){
		        var total = $(this).html().split('<br>')[1].split("<strong>")[0].split(':')[1];
		        total = '<span class="total">Valor total:<strong>'+total+'</strong></span>';
		        var savings = $(this).find('strong').last().html().split(':')[1];
		        savings = '<span class="savings">Comprando junto você economiza:<strong>'+savings+'</strong></span>';
		        var installments = '<span class="installmetns">Por apenas '+$(this).find('strong').first().html()+' de '+$(this).find('strong:nth-child(2)').html()+'</span>';
		        $(this).prepend(total+installments+savings);
		    });
		});
	});
// Compre Junto //

// Instagram //
	$(window).on('load', function(){
		$('.instaApp-feed').each(function(){
			var _this = $(this);
			var elementClass = $(this).attr('class') || '';
			var count = 12;
			var userId = '559458055';
			var accessToken = '559458055.4bb98dd.99e6ba92aa6545f4a2a2b3c1b8a9e525';
			$.ajax({
			    url: 'https://api.instagram.com/v1/users/'+userId+'/media/recent/?count='+count+'&access_token='+accessToken,
			    dataType: 'JSONP',
			    jsonpCallback: 'callback',
			    type: 'GET',
			}).done(function(data){
				var post = data.data;
				console.log(post);
				var posts = ''
				for(i=0; i< post.length; i++){
					posts += '<li class="insta-post"><a href="'+post[i].link+'"><img src="'+post[i].images.thumbnail.url+'"/></a></li>'
				}
				_this.replaceWith('<ul class="'+elementClass+'">'+posts+'</ul>');
			});
		});
	});
// Instagram //

$(document).ajaxStop(function(){
	$('button.bt-comprar').click(function(){
		var myLink = $(this).attr('datahref');
		window.location.href = myLink;
	});
});

$(document).ajaxComplete(function(){
	$('button.bt-comprar').click(function(){
		var myLink = $(this).attr('datahref');
		window.location.href = myLink;
	});
});

// Alteração no tamanho da fonte nas descrições das imagens
$(document).ready(function() {
	$(".txt-sz-16").css("font-size", "14px");
});

// Alteração no tamanho da fonte do preço
$(document).ready(function(){
    $(".txt-sz-30").css("font-size", "27px");
});

// Alteração no tamanho da fonte do título das imagens
$(document).ready(function(){
    $(".ambiente-title").css("font-size", "13px");
});