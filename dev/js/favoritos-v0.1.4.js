(function (window, document, $) {
    'use strict';
    vtexjs.checkout.getOrderForm().done(function(orderForm) {
	    var favoriteProduct = new CustomEvent("Favorites.favoriteProduct");
	    var notFavoriteProduct = new CustomEvent("Favorites.notFavoriteProduct");
	    var productFavorited = new CustomEvent("Favorites.productFavorited");
	    var productUnfavorited = new CustomEvent("Favorites.productUnfavorited");

	    function Favorites(){
	    	var config = {
	    		ac: 'PF', // entidade
	    		an: 'agapemoda', // loja
	    		maxFav: '10',
				thumbFav: {
					width: '608',
					height: '608'
				},
	    	}
	    	var clientEmail = vtexjs.checkout.orderForm.clientProfileData.email;
	    	var pId = document.getElementById('___rc-p-id');
	    	var currentId = (pId != null)? pId.value : null;
	    	self = this;
	    	function formatPrice(input,dp){
				input = String(input.toFixed(2));
				var thou = (dp == '.')? ',': '.';
				var r = input.replace(/\D/g,"");
			    r = r.replace(/^0/,"");
			    if(r.length > 5){
			    	r = r.replace(/\B(?=(.{2}$)+(?!\d))|([.])/g,dp).replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1"+thou);
			    }else if(r.length > 2){
			    	r = r.replace(/(\d{1})(\d{2})$/,"$1"+dp+"$2");
			    }else if(r.length > 1){
					r = r.replace(/(\d{2})$/,"00"+dp+"$1");
				}else {
			        r = r.replace(/(\d{1})$/, "00"+dp+"0$1");
			    }
			    return 'R$ '+r;
			}
			function scapedName(name){
				console.log('name', name);
				return (name.replace(/[% &]/g,'-'));
			}
			this.config = function(config){
			for (var key in config) {
		        if (_config.hasOwnProperty(key)) _config[key] = config[key];
		    }
    	}
			this.addItem = function(productId, success, error){
				var _pId = productId;
				error = error || null;
				success = success || null;
				productId = productId || null;
				self.getFavorites(null, function(data){
					console.log(data.lenght < config.maxFav, data.map(function(o){return o.productId}).indexOf(_pId));
					if(data.length < config.maxFav && data.map(function(o){return o.productId}).indexOf(_pId) < 0){
						$.ajax({
							url: '/'+config.an+'/dataentities/'+config.ac+'/documents',
							data: JSON.stringify({
								email: clientEmail,
								userEmail: clientEmail,
								productId: productId,
							}),
							type: 'POST',
							headers: {
								'Content-Type': 'application/json',
								Accept: 'application/vnd.vtex.ds.v10+json'
							},
							success: function(data){
								console.log('Sucesso', data);
								$(window).trigger('Favorites.productFavorited');
								if (success) success(data);
							},
							error: function(data){
								console.log('error', data);
								if (error) error(data);
							}
						})
					}else{
						alert('Você já atingiu o limite de produtos favoritos.\nPor favor, retire alguns e tente novamente!');
					}
				});
			}
			this.addCurrent = function(success, error){
				error = error || null;
				success = success || null;
				self.addItem(currentId, function(){
					$(window).trigger('Favorites.favoriteProduct');
					if (success) success();
				}, error);
			}
			this.getFavorites = function(productId, success, error){
				error = error || null;
				success = success || null;
				productId = productId || null;
				console.log('productId', productId);
				$.ajax({
					url: '/'+config.an+'/dataentities/'+config.ac+'/search?_where(email='+clientEmail+')'+((productId)?'&productId='+productId: '')+'&_fields=id,productId',
					type:'GET',
					headers: {
						'Content-Type': 'application/json',
						'REST-Range': 'resources=0-99',
						Accept: 'application/vnd.vtex.ds.v10+json'
					},
					success: function(data){
						console.log('Sucesso', data);
						window.Favoritos.documents = data;
						if(success) success(data);
					},
					error: function(data){
						console.log('error', data);
						if (error) error(data);
					}
				})
			}
			this.getItems = function(productId, success, error){
				error = error || null;
				success = success || null;
				productId = productId || null;
				console.log('get Items', productId);
				self.getFavorites(productId,function(data){
					if(data.length){
						var ids = [];
						var favlist = data;
						$.each(data, function(i, item){ids.push(item.productId);});
						console.log('favorites', data)
						self.getProducts(ids, function(products){
							var items = [];
							console.log('Products', products);
							$.each(products, function(i, item){
								var bestPrice = item.items[0].sellers[0].commertialOffer.Price;
								var listPrice = item.items[0].sellers[0].commertialOffer.ListPrice;
								var availableQuantity = 0;
								$.each(item.items, function(i, sku){
									availableQuantity += sku.sellers[0].commertialOffer.AvailableQuantity;
								});
								var discountHighlight = '';
								$.each(item.items[0].sellers[0].commertialOffer.DiscountHighLight, function(i, d){
									$.each(d, function(){
										discountHighlight += '<p class="flag '+scapedName(this)+'">'+d+'</p>'	
									});
								});
								var productHighlight = '';
								$.each(item.clusterHighlights, function(i, d){
									productHighlight += '<p class="flag '+scapedName(d)+'">'+d+'</p>'	
								});
								items.push({
									link: item.link,
									brand: item.brand,
									linkText: item.linkText,
									productId: item.productId,
									categories: item.categories,
									decription: item.description,
									productName: item.productName,
									clusters: item.clusterHighlights,
									isInStock: availableQuantity > 0,
									productHighlight: productHighlight,
									discountHighlight: discountHighlight,
									availableQuantity: availableQuantity,
									hasBestPrice: (listPrice > bestPrice),
									bestPrice: formatPrice(bestPrice, ','),
									listPrice: formatPrice(listPrice, ','),
									favId: favlist[favlist.map(function(o){return o.productId}).indexOf(item.productId)].id,
									productImage: item.items[0].images[0].imageTag.replace('~', '').replace(/#width#/g, config.thumbFav.width).replace(/#height#/g, config.thumbFav.height),
								});
							});
							window.Favoritos.favoritos = items;
							if (success) success(items);
						});
					}else{
						if (success) success(data);
					}
				});
			}
			this.removeItem = function(id, success, error){
				error = error || null;
				success = success || null;
				console.log('id', id);
				$.ajax({
					url: '/'+config.an+'/dataentities/'+config.ac+'/documents/'+id,
					type: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/vnd.vtex.ds.v10+json'
					},
				}).done(function(){
					console.log('Removed');
					$(window).trigger('Favorites.productUnfavorited');
					if (success) success();
				});
			}
			this.removeByProductId= function(id, success, error){
				error = error || null;
				success = success || null;
				self.getItems(id, function(data){
					console.log('data', data);
					self.removeItem(data[0].favId, success);
				});
			}
			this.removeCurrent = function(success, error){
				error = error || null;
				success = success || null;
				self.removeByProductId(currentId, function(){
					$(window).trigger('Favorites.notFavoriteProduct');
					if (success) success();
				}, error);
			}
			this.getProducts = function(ids, success, error){
				ids = ids || null;
				error = error || null;
				success = success || null;
				if(ids){
					var filter = '';
					$.each(ids, function(i, item){
						filter += (i)? '&fq=productId:' + item : 'fq=productId:'+ item;
					});
					$.ajax({
						url: '/api/catalog_system/pub/products/search?'+filter,
						type: 'GET',
						headers: {
							'Content-Type': 'application/json',
							Accept: 'application/vnd.vtex.ds.v10+json'
						},
						success: function(data){
							console.log('Sucesso', data);
							if (success) success(data);
						},
						error: function(data){
							console.log('error', data);
							if (error) error(data);
						}
					});
				}else{
					console.log('Nenhum id informado!');
				}
			}
			this.favList = function(){
				self.getItems(null, function(){
					var list = '<'+config.favList.wrapper+'>';
					$.each(Favoritos.favoritos, function(i, item){
						var li = config.favList.item;
						$.each(item, function(i, prop){
							li = li.replace(RegExp('#'+i+'#', 'g'), prop);
						});
						list += li;
					});
					list += '</'+config.favList.wrapper+'>';
					window.Favoritos.list = list;
				});
			}
			this.isFavorite = function(id, callback){
				id = id || null;
				callback = callback || null;
				self.getItems(id,function(data){
					console.log('isFavorite', data);
					(data.length)? $(window).trigger('Favorites.favoriteProduct') : $(window).trigger('Favorites.notFavoriteProduct');
				});
			}
			this.isCurrentFavorite = function(callback){
				self.isFavorite(currentId, callback);
			}
			this.renderFavList = function(templateId,className, parent){
				var template = Handlebars.compile(
					'<div class="'+className+'"><ul>{{#each favorito}}'+
						'<li class="favorito" data-id="{{favId}}" data-prod-id="{{productId}}">'+
							'<button class="removeFavorite" data-favid="{{favId}}"></button>'+
							document.getElementById(templateId).innerHTML+
						'</li>'+
					' {{/each}}</ul></div>'
				);
				$(parent).html(template({
					favorito: Favoritos.favoritos
				}));
				$(parent).find('.removeFavorite').on('click', function(){
					var $this = $(this);
					self.removeItem(
						$this.attr('data-favid'),
						function(d){
							console.log('s', d);
							$this.parent().fadeOut(300, function() { $(this).remove(); });
						},
						function(d){
							console.log('e', d);
							alert('Um erro ocorreu. Por favor, tente novamente!');
						})
				});
			}
			this.renderFavPage = function(_templateId, _className, _parent){
				_parent = _parent || null;
				_className = _className || null;
				_templateId = _templateId || null;
				self.getItems(null, function(){
					self.renderFavList(_templateId, _className, _parent);
				});
			}
	    }
	    window.dispatchEvent(favoriteProduct);
	    window.dispatchEvent(notFavoriteProduct);
	    window.dispatchEvent(productFavorited);
	    window.dispatchEvent(productUnfavorited);
		window.Favoritos = new Favorites();
		$.fn.favoriteCurrentButton = function(){
			console.log(this);
			var $this = $(this);
			console.log('$this', $this);
			$(window).on('Favorites.favoriteProduct', $this,function(){
				$this.addClass('isFavorite');
				$this[0].onclick = function(){
					console.log('clicked');
					Favoritos.removeCurrent(function(){alert('Produto removido dos favoritos!')})
				};
				console.log('$this.onClick', $this.onclick);
			});
			$(window).on('Favorites.notFavoriteProduct', $this,function(){
				$this.removeClass('isFavorite');
				$this[0].onclick =  function(){
					console.log('clicked');
					if(vtexjs.checkout.orderForm.loggedIn){
						Favoritos.addCurrent(function(){alert('Produto adicionado aos favoritos!')});
					}else{
						alert('É preciso entrar para adicionar aos favoritos!');
					}
				};
				console.log('$this.onClick', $this.onclick);
			});
			Favoritos.isCurrentFavorite();
		}
	});
}(window, document, jQuery));