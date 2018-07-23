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