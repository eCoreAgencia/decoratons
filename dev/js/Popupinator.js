(function(window, document, $){
	'use strict';
	function Popup(){
		self = this;
		var popups = new Object();
		this.setWrapper = function(el){
			popups['wrapper'] = el;
		}
		this.newPopup = function(name, el){
			popups[name] = el;
		}
		this.open = function(name){
			popups['wrapper'].fadeIn();
			popups[name].fadeIn();
		}
		this.close = function(name){
			popups['wrapper'].fadeOut();
			popups[name].fadeOut();
		}
	}
	window.Popupinator = new Popup();
}(window, document, jQuery));