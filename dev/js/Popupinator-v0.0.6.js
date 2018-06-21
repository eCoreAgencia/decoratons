(function(window, document, $){
	'use strict';
	function Popup(){
		self = this;
		var popups = new Object();
		this.setWrapper = function(el){
			popups['wrapper'] = el;
			popups['wrapper'].on('click', function(e){
				$(this).fadeOut();
				self.closeAll();
				$(this).children().on('click', function(e){
					e.stopPropagation();
				})
			});
		}
		this.popups = function(className){
			popups['children'] = popups['wrapper']+' '+className;
		}
		this.newPopup = function(name, el){
			popups[name] = el;
		}
		this.open = function(name){
			popups['wrapper'].fadeIn();
			popups[name].fadeIn().addClass('active');
			popups[name].prevAll().addClass('inactive');
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