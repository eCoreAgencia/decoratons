(function(window, document, $){
	'use strict';
	function Popup(){
		self = this;
		var popups = new Object();
		function needScrolling(el){
			if (el.prop('scrollHeight') > el.height() ) {
			  	console.log("this element is overflowing !!");
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
				needScrolling(popups[name]);
			});
		}
		this.open = function(name){
			popups['wrapper'].fadeIn();
			popups[name].fadeIn().addClass('active');
			popups[name].prevAll().addClass('inactive');
			needScrolling(popups[name]);
		}
		this.close = function(name){
			console.log(popups);
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