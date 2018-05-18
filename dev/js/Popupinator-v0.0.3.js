(function(window, document, $){
	'use strict';
	function Popup(){
		self = this;
		var popups = new Object();
		this.setWrapper = function(el){
			popups['wrapper'] = el;
			popups['wrapper'].on('click', function(){
				$(this).fadeOut();
				self.closeAll();
			});
		}
		this.popups = function(className){
			popups['children'] = popups['wrapper']+' '+className;
		}
		this.newPopup = function(name, el){
			popups['children'] = el;
		}
		this.open = function(name){
			popups['wrapper'].fadeIn();
			popups[name].fadeIn().addClass('active');
			popups[name].prevAll().addClass('inactive');
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