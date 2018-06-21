$(window).load(function(){

	function getAxis(){
		var windowWidth = $(window).width();
		if(windowWidth >= 768){
			return 'Y';
		}else{
			return 'X';
		}
	}

	function getThumbSize(axis){
		return ((axis == 'X')? $('.thumbs li').outerWidth() : $('.thumbs li').outerHeight(true));
	}

	$('.apresentacao .thumbs').each(function(){
		$(this).append('<span class="prev-thumb"><</span>');
		$(this).append('<span class="next-thumb">></span>');
	});

	var thumbMove = 0;
	var axis = getAxis();
	var thumbSize = getThumbSize(axis);
	var move = thumbSize;
	var isXAxis = (axis == 'X')? true : false;
	var thumbWrapperSize = isXAxis? $('.thumbs').width() : $('.thumbs').height();
	var parentOffset = {
		'start': (isXAxis? $('.thumbs').offset().left : $('.thumbs').offset().top),
		'end': (isXAxis? ($('.thumbs').offset().left+thumbWrapperSize) : ($('.thumbs').offset().top+thumbWrapperSize))
	}
	$(window).resize(function(){
		axis = getAxis();
		thumbSize = getThumbSize(axis);
		move = thumbSize;
		isXAxis = (axis == 'X')? true : false;
		thumbWrapperSize = isXAxis? $('.thumbs').width() : $('.thumbs').height();
		parentOffset = {
			'start': (isXAxis? $('.thumbs').offset().left : $('.thumbs').offset().top),
			'end': (isXAxis? ($('.thumbs').offset().left+thumbWrapperSize) : ($('.thumbs').offset().top+thumbWrapperSize))
		}
		var split = isXAxis? 4: 5;
		var crtTransform = $('.thumbs li').css('transform').split(',')[split];
		$('.thumbs li').css('transform','translate(0)');
		$('.thumbs li').css('transform','translate'+axis+'('+crtTransform+'px)');
	});
	var lastTouch;
	$('.thumbs').on('touchmove',function(e){
		e.preventDefault();
		var touch = e.originalEvent.touches[0];
		var current = isXAxis? touch.clientX : touch.clientY;
		var touchMove = lastTouch - current;
		if(current < parentOffset.start || current > parentOffset.end){
			return 0;
		}
		if(lastTouch > current){
			//esquerda, cima
			var liOffset = $('.thumbs li').last().position();
			liOffset = isXAxis? liOffset.left : liOffset.top;
			var lastBottom = liOffset + thumbSize;
			if(lastBottom > thumbWrapperSize){
				if(lastBottom-touchMove < thumbWrapperSize){
					thumbMove -= lastBottom - thumbWrapperSize;
				}else{
					thumbMove -= touchMove;
				}
				$('.thumbs li').css('transform','translate'+axis+'('+thumbMove+'px)');
			}
		}else if(lastTouch < current){
			//direita, baixo
			var liOffset = $('.thumbs li').first().position();
			liOffset = isXAxis? liOffset.left : liOffset.top;
			if(liOffset < 0){
				if(liOffset+touchMove > 0){
					thumbMove = 0;
				}else{
					thumbMove += (-touchMove);
				}
				$('.thumbs li').css('transform','translate'+axis+'('+thumbMove+'px)');
			}
		}
		lastTouch = current; 
	});
	$('.next-thumb').click(function(){
		var liOffset = $('.thumbs li').last().position();
		liOffset = isXAxis? liOffset.left : liOffset.top;
		var lastBottom = liOffset + thumbSize;
		if(lastBottom > thumbWrapperSize){
			if(lastBottom-move < thumbWrapperSize){
				thumbMove -= lastBottom - thumbWrapperSize;
			}else{
				thumbMove -= move;
			}
			$('.thumbs li').css('transform','translate'+axis+'('+thumbMove+'px)');
		}
	});

	$('.prev-thumb').click(function(){
		var liOffset = $('.thumbs li').first().position();
		liOffset = isXAxis? liOffset.left : liOffset.top;
		if(liOffset < 0){
			if(liOffset+move > 0){
				thumbMove = 0;
			}else{
				thumbMove += move;
			}
			$('.thumbs li').css('transform','translate'+axis+'('+thumbMove+'px)');
		}
	});
	$('.product-view .apresentacao #include #image').each(function(){
		var border = $(this).css('border').split('px')[0]*2;
		var maxWidth = parseInt($(this).css('max-width').replace('px','')) + border;
		var maxHeight = parseInt($(this).css('max-height').replace('px','')) + border;
		var width = $(this).width() + border;
		var height = ((maxHeight*width)/maxWidth)+border;
		$(this).css('height', height);
	});
	$(window).resize(function(){
		$('.product-view .apresentacao #include #image').each(function(){
			var border = $(this).css('border').split('px')[0]*2;
			var maxWidth = parseInt($(this).css('max-width').replace('px','')) + border;
			var maxHeight = parseInt($(this).css('max-height').replace('px','')) + border;
			var width = $(this).width() + border;
			var height = ((maxHeight*width)/maxWidth)+border;
			$(this).css('height', height);
		});
	});
});