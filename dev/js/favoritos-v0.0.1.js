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
	    		an: 'decoratons', // loja
				thumbFav: {
					width: '100',
					height: '100'
				},
				favList: {
					wrapper: 'ul',
					item: '<li data-id="#favId#" data-prod-id="#productId#"><a href="#link#" alt="#productName#">#productImage#</a></li>',
				},
	    	}
	    	var clientEmail = vtexjs.checkout.orderForm.clientProfileData.email;
	    	var currentId = document.getElementById('___rc-p-id').value;
	    	self = this;
			this.addItem = function(productId, success, error){
				error = error || null;
				success = success || null;
				productId = productId || null;
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
			}
			this.addCurrent = function(){
				self.addItem(currentId, function(){
					$(window).trigger('Favorites.favoriteProduct');
				});
			}
			this.getItems = function(productId, success, error){
				error = error || null;
				success = success || null;
				productId = productId || null;
				$.ajax({
					url: '/'+config.an+'/dataentities/'+config.ac+'/search?_where(email='+clientEmail+((productId)? ' AND productId='+productId: '')+')&_fields=id,productId',
					type:'GET',
					headers: {
						'Content-Type': 'application/json',
						'REST-Range': 'resources=0-99',
						Accept: 'application/vnd.vtex.ds.v10+json'
					},
					success: function(data){
						console.log('Sucesso', data);
						if(data.length){
							var ids = [];
							var favlist = data;
							$.each(data, function(i, item){ids.push(item.productId);});
							self.getProducts(ids, function(products){
								var items = [];
								$.each(products, function(i, item){
									items.push({
										link: item.link,
										brand: item.brand,
										linkText: item.linkText,
										productId: item.productId,
										decription: item.decription,
										productName: item.productName,
										clusters: item.clusterHighlights,
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
					},
					error: function(data){
						console.log('error', data);
						if (error) error(data);
					}
				})
			}
			this.removeItem = function(id, success, error){
				success = success || null;
				error = error || null;
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
			this.removeByProductId= function(id, success){
				self.getItems(id, function(data){
					console.log('data', data);
					self.removeItem(data[0].favId, success);
				});
			}
			this.removeCurrent = function(){
				self.removeByProductId(currentId, function(){
					$(window).trigger('Favorites.notFavoriteProduct');
				})
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
					(data.length)? $(window).trigger('Favorites.favoriteProduct') : $(window).trigger('Favorites.notFavoriteProduct');
				});
			}
			this.isCurrentFavorite = function(callback){
				self.isFavorite(currentId, callback);
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
					Favoritos.removeCurrent()
				};
				console.log('$this.onClick', $this.onclick);
			});
			$(window).on('Favorites.notFavoriteProduct', $this,function(){
				$this.removeClass('isFavorite');
				$this[0].onclick =  function(){
					console.log('clicked');
					Favoritos.addCurrent();
				};
				console.log('$this.onClick', $this.onclick);
			});
			Favoritos.isCurrentFavorite();
		}
	});
}(window, document, jQuery));