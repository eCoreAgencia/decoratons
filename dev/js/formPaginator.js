$('form[name="Pedido-parceria"]').each(function(){
	var $form = $(this);
	$form.find('.menu').each(function(){
		function updateProgress(el){
			$progress.css("will-change", "width");
			el.animate({width: ($current.innerText/max)*100 + '%'}, 300);
			$progress.css("will-change", "");
		}
		var $menu = $(this);
		var max = $form.find('section').length;
		var $progressBar = $(this).find('.progress-bar')[0];
		var $progress = $(this).find('.progress-bar').find('.progress');
		var $current = $(this).find('.current')[0];
		$progress.css({"height": "100%", "display": "block", "background-color":"#147eb8", "border-radius": "25px"});
		updateProgress($progress);
		$(this).find('.last')[0].innerText = max;
		$progressBar.attributes['data-max'].value = max;
		$(this).find('button.prev').on('click', function(){
			if ($progressBar.attributes['data-value'].value > 1){
				$form.find('section.active:not(:first-of-type)').removeClass('active').prev().removeClass('prev').addClass('active').prev().addClass('prev');
				$current.innerText = --$progressBar.attributes['data-value'].value
				if ($current.innerText <= 1) $(this).hide();
				if ($current.innerText == max - 1) $menu.find('button.next').show();
				updateProgress($progress);
			};
		});
		$(this).find('button.next').on('click', function(){
			if ($progressBar.attributes['data-value'].value < max){
				$form.find('section.active:not(:last-of-type)').removeClass('active').addClass('prev').next().addClass('active');
				$current.innerText = ++$progressBar.attributes['data-value'].value;
				if ($current.innerText >= max) $(this).hide();
				if ($current.innerText == 2) $menu.find('button.prev').show();
				updateProgress($progress);
			}
		});
	});
});