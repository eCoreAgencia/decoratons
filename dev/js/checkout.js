$(window).on('load', function(){
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
	var payment = $('body').find('#payment-data')[0];
	var profile = $('body').find('#client-profile-data > .client-pre-email')[0];
	if(profile.offsetParent == null){
		document.body.classList.add('body-pag');
	}
	if($.grep(payment.classList, function(e){return (e == 'span12')}).length){
		document.body.classList.add('body-payment');
	}
	var profileSecChange = new MutationObserver (function(e){
	    (e[0].target.offsetParent == null)? document.body.classList.add('body-pag') : document.body.classList.remove('body-pag');
	});
	var paymentSecChange = new MutationObserver (function(e){
	    console.log(e[0].target.classList);
	    ($.grep(e[0].target.classList, function(e){return (e == 'span12')}).length)? 
			document.body.classList.add('body-payment'):
			document.body.classList.remove('body-payment');
	});
	profileSecChange.observe (profile, {attributes: true, attributeOldValue: true, attributeFilter: ["style"]});
	paymentSecChange.observe (payment, {attributes: true, attributeOldValue: true, attributeFilter: ["class"]});
});