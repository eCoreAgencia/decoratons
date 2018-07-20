if($('body.produto').length > 0){
	$("#___rc-p-id").each(function(index) {
		var id = $(this).attr("value");
		var data = "/api/catalog_system/pub/products/search/?fq=productId:"+id+"";

		$.getJSON(data, function(data) {
			$.each(data, function(key, val) {
				var HeightPaper = val.Altura;
				console.log(HeightPaper);

				var WidthPaper = val.Largura;
				console.log(WidthPaper);

				var txtPaper = val.Texto;
				console.log(txtPaper);

				$('<h2 class="txt-black txt-sz-24">Dimensões</h2>').insertBefore('.sku-section #prod-dimensoes');
				$('<span class="tlt-dim">Tamanhos disponíveis:</span>').appendTo('.sku-section #prod-dimensoes');
				$('<span class="dados-dimensions height">(A)'+HeightPaper+' x '+WidthPaper+' (L)</span>').appendTo('.sku-section #prod-dimensoes');
				$('<span class="dados-dimensions txt">'+txtPaper+'</span>').appendTo('.sku-section #prod-dimensoes .height');
				/****** Dimensoes ******/
			});
		});
	});
}