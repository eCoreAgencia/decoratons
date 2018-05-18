$(function(){

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
	var thumbWrapperSize = (axis == 'X')? $('.thumbs').width() : $('.thumbs').height();

	$(window).resize(function(){
		axis = getAxis();
		thumbSize = getThumbSize(axis);
		move = thumbSize;
		thumbWrapperSize = (axis == 'X')? $('.thumbs').width() : $('.thumbs').height();
	});

	$('.next-thumb').click(function(){
		var liOffset = $('.thumbs li').last().position();
		liOffset = (axis == 'X')? liOffset.left : liOffset.top;
		var lastBottom = liOffset + thumbSize;
		if(lastBottom > thumbWrapperSize){
			if(lastBottom-move < thumbWrapperSize){
				thumbMove -= lastBottom - thumbWrapperSize;
			}else{
				thumbMove -= move;
			}
			$('.thumbs li').css('transform','translate'+axis+'('+thumbMove+'px)');
		}
	}.bind(this)).bind(this);

	$('.prev-thumb').click(function(){
		var liOffset = $('.thumbs li').first().position();
		liOffset = (axis == 'X')? liOffset.left : liOffset.top;
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
