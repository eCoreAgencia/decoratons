function masterDataContato(){var jsonSaveDadosUser={nome:$("#cl_nome").val(),email:$("#cl_email").val(),tel:$("#cl_telefone").val(),empresa:$("#cl_empresa").val(),mensagem:$("#cl_mensagem").val()},storename="decoratons",dataEntity="FC",urlSaveDadosUser="/"+storename+"/dataentities/"+dataEntity+"/documents/";$.ajax({headers:{Accept:"application/vnd.vtex.ds.v10+json","Content-Type":"application/json"},data:JSON.stringify(jsonSaveDadosUser),type:"PATCH",url:urlSaveDadosUser,success:function(data){console.log(data),$("div#messageSuccess").removeClass("hide"),$("#cl_nome").val(""),$("#cl_email").val(""),$("#cl_telefone").val(""),$("#cl_empresa").val(""),$("#cl_mensagem").val(""),alert("Mensagem Enviada com sucesso!")},error:function(data){console.log(data),alert("Houve um erro ao enviar a mensagem. Tente novamente mais tarde")}})}$(document).ready(function(event){$(".sizeList li span").click(function(){$(this).find("input").removeAttr("checked"),$(this).prev().attr("checked","checked");var myLink=$(this).prev().attr("value");$(".sizeList a").css("display","block"),$(".sizeList a").attr("href",myLink)})}),$(document).ajaxStop(function(){$(".sizeList li span").click(function(){$(this).find("input").removeAttr("checked"),$(this).prev().attr("checked","checked");var myLink=$(this).prev().attr("value");$(".sizeList a").css("display","block"),$(".sizeList a").attr("href",myLink)})}),function(){function CustomEvent(event,params){params=params||{bubbles:!1,cancelable:!1,detail:void 0};var evt=document.createEvent("CustomEvent");return evt.initCustomEvent(event,params.bubbles,params.cancelable,params.detail),evt}return"function"!=typeof window.CustomEvent&&(CustomEvent.prototype=window.Event.prototype,void(window.CustomEvent=CustomEvent))}(),function($){"use strict";var settings={effect:"overlay"},cart=null,helper={openCart:function(){var width=$(cart).width()*-1;"push"==settings.effect&&$(settings.wrapper).animate({marginLeft:width}),$(cart).animate({right:0}),$(".sta-cart-overlay").fadeIn()},closeCart:function(){var width=$(cart).width()*-1;"push"==settings.effect&&$(settings.wrapper).animate({marginLeft:0}),$(cart).animate({right:width}),$(".sta-cart-overlay").fadeOut()},fillCart:function(){setTimeout(function(){vtexjs.checkout.getOrderForm().done(function(orderForm){var i,items=orderForm.items;if($(cart).find(".sta-cart-total strong").html("R$ "+helper.toReal(orderForm.value)),console.log(orderForm),$(".sta-cart .openCart > span").html("R$ "+helper.toReal(orderForm.value)),$(".openCart").html('<a href="#" class="link-cart"><i class="ico-cart"></i> <i class="cart-qty"> '+orderForm.items.length+"</i> <span>R$ "+helper.toReal(orderForm.value)+" </span></a>"),$(cart).find("ul").html(""),items.length>0)for(i=0;i<items.length;i++)$(cart).find("ul").append('<li> <div class="sta-cart-pdt-image"><img src="'+items[i].imageUrl+'" /><span class="sta-cart-pdt-qtd-item">'+items[i].quantity+'</span></div> <div class="sta-cart-pdt-info"> <h4>'+items[i].name+'</h4> <button class="remove-item" data-index="'+i+'"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><polygon fill="#000" points="88.711,86.588 52.121,50 88.709,13.412 86.588,11.291 50,47.878 13.41,11.291 11.289,13.412   47.878,50 11.289,86.588 13.41,88.709 50,52.12 86.59,88.709 "/></svg><span>remover</span></button> <div class="sta-cart-pdt-qtd"></div> <p>R$: '+helper.toReal(items[i].listPrice)+"</p> </div> </li>");else helper.closeCart()})},500)},addItem:function(el){var urlTest=["javascript",":","alert('Por favor, selecione o modelo desejado.');"].join(""),url=$(el).attr("href");if(url==urlTest)return alert("Por favor, selecione o modelo desejado."),!1;var cart=url;$.ajax({url:cart.replace("https://www.kroton.com.br","").replace("true","false"),type:"GET",crossDomain:!0,dataType:"html",success:function(){helper.openCart(),helper.fillCart()}})},addItemNoShowCart:function(el){var urlTest=["javascript",":","alert('Por favor, selecione o modelo desejado.');"].join(""),url=$(el).attr("href");if(url==urlTest)return alert("Por favor, selecione o modelo desejado."),!1;var cart=url;$.ajax({url:cart.replace("https://www.kroton.com.br","").replace("true","false"),type:"GET",crossDomain:!0,dataType:"html",success:function(){helper.fillCart(),helper.closeCart()}})},removeItem:function(index){vtexjs.checkout.getOrderForm().then(function(orderForm){var item=orderForm.items[index];return item.index=index,vtexjs.checkout.removeItems([item])}).done(function(orderForm){helper.fillCart()})},toReal:function(val){return val/=100,val=val.toFixed(2).toString().replace(".",","),val=val.replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1.")},selectSku:function(){$(".product-actions .btn.comprar-product").on("click",function(event){event.preventDefault();var idSku=$(this).parent().parent().find(".product-content .content-select-sku > ul > li.active").attr("data-sku");$(this).prev().find(".list-count .result input").val();if(void 0==idSku)alert("Selecione tamanho ou cor");else{var cart="/checkout/cart/add?sku="+idSku+"&seller=1&redirect=true&sc=2";$.ajax({url:cart.replace("https://www.kroton.com.br","").replace("true","false"),type:"GET",crossDomain:!0,dataType:"html",success:function(){helper.openCart(),helper.fillCart()}})}}),$(".list-count .qty-more").on("click",function(event){event.preventDefault();var $qty=parseInt($(this).parent().parent().find(".result input").val());$(this).parent().parent().find(".result input").attr("value",$qty+1)}),$(".list-count .qty-less").on("click",function(event){event.preventDefault();var $qty=parseInt($(this).parent().parent().find(".result input").val());$qty<=1?$(this).parent().parent().find(".result input").attr("value","1"):$(this).parent().parent().find(".result input").attr("value",$qty-1)}),$(".product-insertsku > fieldset > ul > li").each(function(index,item){$(this).parents(".product-insertsku").parent().parent().parent().find(".product-content .content-select-sku > ul").append('<li data-sku="'+$(this).find(".insert-sku-checkbox").attr("rel")+'">'+$(this).find(".insert-sku-quantity").attr("title").split(" ")[0])+"<li>"}),$(".content-select-sku > ul > li").on("click",function(event){$(".content-select-sku > ul > li").removeClass("active"),$(this).addClass("active")})}};$.fn.vtexcart=function(parameters){var el=this;settings=$.extend(settings,parameters);var cartHtml='<div class="sta-cart-overlay"></div><div class="sta-cart-container"> <div class="sta-cart-title"> <button class="sta-cart-close"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><polygon fill="#000" points="88.711,86.588 52.121,50 88.709,13.412 86.588,11.291 50,47.878 13.41,11.291 11.289,13.412   47.878,50 11.289,86.588 13.41,88.709 50,52.12 86.59,88.709 "/></svg></button> <h3>Minha Compra<span class="qtd-cart"></span></h3> </div> <div class="sta-cart-items"> <ul></ul> </div> <div class="sta-cart-resume"> <span class="sta-cart-sub">Subtotal<strong>R$ 0,00</strong></span> <span class="sta-cart-freight">Frete<strong style="display:none">0</strong><button>Calcular</button><input type="text" /></span> <span class="sta-cart-total">Total: <strong>R$ 0,00</strong></span> <button class="bt-comprar" datahref="/checkout/#/cart"><span>Finalizar Pedido</span></button> </div> </div>',miniCartHtml='<a href="#" class="openCart link-cart"><span></span></a>';$(el).append(cartHtml),settings.cartButton&&0==$(".sta-cart .openCart").length&&$(settings.cartButton).append(miniCartHtml),cart=$(el).find(".sta-cart-container"),helper.fillCart(),$("body").delegate(".comprarNow a","click",function(event){helper.addItem($(this)),event.preventDefault()}),$(settings.buyButton).on("click",function(event){helper.addItem($(this)),event.preventDefault()}),$(".btn-add-carrinho").on("click",function(event){event.preventDefault(),$(this).attr("href",$(".buy-button").attr("href")),helper.addItemNoShowCart($(this)),$("html, body").animate({scrollTop:0},300),setTimeout(function(){helper.closeCart()},1200)}),$(".openCart").on("click",function(event){helper.openCart(),event.preventDefault()}),$(".sta-cart-close, .sta-cart-overlay").on("click",function(){helper.closeCart()}),$(".sta-cart-container").on("click",".remove-item",function(){var index=$(this).data("index");helper.removeItem(index)}),$(".sta-cart-freight button").click(function(){$(this).hide(),$(".sta-cart-freight input").show()}),helper.selectSku(),$("body.categoria").on("click",".pager.bottom .pages > li",function(event){var interval=setInterval(function(){0==$(".content-select-sku > ul > li").length&&(helper.selectSku(),clearInterval(interval))},500)})}}(jQuery),$(function(){$("body").vtexcart({buyButton:$(".buy-button"),addCartButton:$(".btn-add-carrinho"),wrapper:$(".container"),effect:"overlay",cartButton:$(".sta-cart")}),$("header #mini-cart").click(function(){$(".sta-cart-container").animate({right:0},300)}),$("header #mini-cart").mouseenter(function(){$(".sta-cart-container").addClass("active")}),$(".sta-cart-container").mouseleave(function(){$(".sta-cart-container").removeClass("active")})}),function(window,document,$){"use strict";function Popup(){self=this;var popups=new Object;this.needScrolling=function(el){el[0].scrollHeight>el[0].clientHeight?el.css({"overflow-y":"scroll"}):el.css({"overflow-y":"hidden"})},this.setWrapper=function(el){popups.wrapper=el,popups.wrapper.on("click",function(e){$(this).fadeOut(),self.closeAll()})},this.popups=function(className){popups.children=popups.wrapper.selector+" "+className,popups.wrapper.find(className).on("click",function(e){e.stopPropagation()})},this.newPopup=function(name,el){popups[name]=el,$(window).resize(function(){popups[name].hasClass("active")&&self.needScrolling(popups[name])});var MutationObserver=window.MutationObserver||window.WebKitMutationObserver,elementChange=new MutationObserver(function(){popups[name].hasClass("active")&&self.needScrolling(popups[name])});elementChange.observe($(el)[0],{childList:!0,subtree:!0})},this.open=function(name){popups.wrapper.fadeIn(),popups[name].fadeIn().addClass("active"),popups[name].prevAll().addClass("inactive"),self.needScrolling(popups[name])},this.close=function(name){popups[name].fadeOut().removeClass("active"),popups[name].prev().removeClass("inactive"),$(popups.children+".inactive").length||popups.wrapper.fadeOut()},this.closeAll=function(){popups.children.fadeOut().removeClass("active"),popups.wrapper.fadeOut()}}window.Popupinator=new Popup}(window,document,jQuery),function(window,document,$){"use strict";function Calculator(){var config={ac:"CC",an:"api",fields:"width,height,variation,searchUrl,area,order",results:{wrapper:"ul",result:'<li class="tamanho #variation#" data-width="#width#" data-height="#height#" data-area="#area#"><label><input name="calc_tam" value="#searchUrl#" type="radio" class="hidden"/><span>Tamanho #variation#</span></label><input type="text" name="calc_quant" disabled/><p>rolos de #heightFormated# (A) X #widthFormated# (L)</p></li>'},instruction:"Informe as medidas em metros. Ex: 1,20m x 2,40",lossRatio:"20"};this.getSizes=function(success,error){error=error||null,success=success||null,$.ajax({url:"/"+config.an+"/dataentities/"+config.ac+"/search?_fields="+config.fields,type:"GET",headers:{"REST-Range":"resources=0-99","Content-Type":"application/json",Accept:"application/vnd.vtex.ds.v10+json"},success:function(data){data.sort(function(a,b){return a.order-b.order}),window.Calculadora.sizes=data,success&&success(data)},error:function(data){console.log("error",data,data.getResponseHeader(),data.statusCode()),error&&error(data)}})},this.sizeList=function(sizes){var list="<"+config.results.wrapper+">";console.log("hell",sizes.length),$.each(sizes,function(i,item){console.log("size",i,item);var li=config.results.result;$.each(item,function(i,prop){if(console.log("prop",i,prop),console.log(li),"height"==i||"width"==i){var replace=prop>=1?prop+" m":100*prop+" cm";li=li.replace("#"+i+"Formated#",replace)}li=li.replace(RegExp("#"+i+"#","g"),prop)}),list+=li}),list+="</"+config.results.wrapper+">",window.Calculadora.sizeList=list,$(".sizeList li span").click(function(){$(this).find("input").removeAttr("checked"),$(this).prev().attr("checked","checked");var myLink=$(this).prev().attr("value");$(".sizeList a").css("display","block"),$(".sizeList a").attr("href",myLink)})},this.renderSizes=function(list,el){el.html(list),console.log("list",Calculadora.sizeList)},this.alturaAprx=function(array,b){var a=null;return $.each(array,function(){console.log(this,b),(null==a||Math.abs(this.height-b)<Math.abs(a-b))&&(a=this.height)}),a},this.calcArea=function(width,height,lossRatio){width=width||null,height=height||null,lossRatio=lossRatio||null;var area=width*height;return console.log("Oarea",area),console.log("lossRatio?",lossRatio),lossRatio&&(area+=area*config.lossRatio/100),console.log("Farea",area),area}}window.Calculadora=new Calculator,$.fn.Calc_calculadora=function(){console.log("Calculadora",Calculadora),$(this).html('<form name="Calculadora"><fieldset><label>largura: <input name="calc_width">m</label><label>altura: <input name="calc_height">m</label></fieldset><p>As estampas da Decoratons tem sua repetição composta em 59x59cm, mediante isso, para um encaixe perfeito das estampas aconselhamos uma porcentagem extra em sua compra.</p><label><input type="checkbox" name="useLossRatio" class="hidden"/><span>Selecione aqui para confirmar essa adição.</span></label><span>Obs: Não utilize o adicional em estampas com listras verticais</span><button type="submit">Calcular</button></form>'),$(this).find("form input").mask("###0,00",{reverse:!0}),$(this).find("form").on("submit",function(e){e.preventDefault();var width=$(this).find('[name="calc_width"]')[0].value.replace(".","").replace(",","."),height=$(this).find('[name="calc_height"]')[0].value.replace(".","").replace(",",".");if(width.length>0&&width>0&&height.length>0&&height>0){console.log("Loss?",$(this).find('[name="useLossRatio"]').attr("checked"));var area=Calculadora.calcArea(width,height,!!$(this).find('[name="useLossRatio"]').attr("checked")),event=new CustomEvent("Calculadora.dimensaoAlterada");event.width=width,event.height=height,event.area=area,window.dispatchEvent(event),$(window).trigger("Calculadora.dimensaoAlterada")}else alert("Por favor, insira as dimensões!")})},$(".sizeList li span").click(function(){$(this).find("input").removeAttr("checked"),$(this).prev().attr("checked","checked");var myLink=$(this).prev().attr("value");$(".sizeList a").css("display","block"),$(".sizeList a").attr("href",myLink)}),$.fn.Calc_tamanhos=function(){var $this=$(this);Calculadora.getSizes(function(){Calculadora.sizeList(Calculadora.sizes),Calculadora.renderSizes(Calculadora.sizeList,$this),$this.append("<a href=\"javascript:alert('Por Favor, Selecione um Tamanho!')\">Comprar</a>")}),window[window.addEventListener?"addEventListener":"attachEvent"]("Calculadora.dimensaoAlterada",function(e){console.log("Alterado",e),$this.find(".tamanho").each(function(){$(this).find('input[name="calc_quant"]').val(Math.ceil(e.area/$(this).attr("data-area")))}),$this.find('.tamanho[data-height="'+Calculadora.alturaAprx(Calculadora.sizes,e.height)+'"]').each(function(){$(this).siblings().removeClass("match"),$(this).addClass("match"),$(this).find('input[type="radio"]').click(),$this.find("a").attr("href",$this.find('input[type="radio"]:checked')[0].value)})})}}(window,document,jQuery),$(".sizeList li span").click(function(){$(this).find("input").removeAttr("checked"),$(this).prev().attr("checked","checked");var myLink=$(this).prev().attr("value");$(".sizeList a").css("display","block"),$(".sizeList a").attr("href",myLink)}),function(window,document,$){"use strict";function Tickets(){var config={ac:"TD",an:"decoratons"};self=this,this["new"]=function(data,handlers){data=data||null,handlers=handlers||null,$.ajax({url:"/"+config.an+"/dataentities/"+config.ac+"/documents",data:JSON.stringify(data),type:"POST",headers:{"Content-Type":"application/json",Accept:"application/vnd.vtex.ds.v10+json"},success:function(data){console.log("Sucesso",data),handlers&&handlers.success&&handlers.success(data)},error:function(data){console.log("error",data),handlers&&handlers.error&&handlers.error(data)}})},this.sendFile=function(files,to,handlers){to=to||null,files=files||null,handlers=handlers||null,$.each(files,function(field,file){var send=new FormData;$.each(file,function(i,item){send.append(field,item)}),$.ajax({url:to.split(":")[1]+"/"+field+"/attachments",data:send,type:"POST",contentType:!1,processData:!1,success:function(data){handlers&&handlers.success&&handlers.success(data)},error:function(data){$.ajax({url:to,type:"DELETE","Content-Type":"application/json",Accept:"application/vnd.vtex.ds.v10+json",success:function(){console.log("Save error",error),handlers&&handlers.error&&handlers.error(data)}})}})})}}window.Ticket=new Tickets,$.fn.ticketForm=function(){var $this=$(this);$this.on("submit",function(e){e.preventDefault();var data=$this.serializeArray().reduce(function(obj,item){return obj[item.name]=item.value,obj},{}),files=new Object;$this.find('input[type="file"]').each(function(){files[this.name]=this.files}),Ticket["new"](data,{success:function(data){console.log("Ticket criado com sucesso",data),Ticket.sendFile(files,data.Href,{success:function(data){console.log("arquivos enviados",data)},erro:function(data){console.log("erro ao enviar arquivos",data)}})},error:function(data){console.log("Erro ao criar ticket",data)}})})}}(window,document,jQuery),function(window,document,$){"use strict";var __ec_dataEach=function(props){var el="";return props.data&&$.each(props.data,function(index,value){el+=" data-"+value.name+'="'+value.id+'"'}),el},__ec_propsComun=function(props){var el="";return el+=props.id?' id="'+props.id+'"':"",el+=props["class"]?' class="'+props["class"]+'"':"",el+=props.style?' style="'+props.style+'"':""},__ec_img=function(props){var img="\n<img";return img+=__ec_dataEach(props),img+=__ec_propsComun(props),img+=' src="'+props.src+'" ',img+=props.title?' title="'+props.title+'" ':"",img+=props.title?' alt="'+props.title+'" ':"",img+=props.width?' width="'+props.width+'" ':"",img+=props.height?' height="'+props.height+'"':"",img+="/>"},__ec_element=function(props){if("img"==props.type)return __ec_img(props);var el="";return el+="\n<"+props.type,el+=__ec_dataEach(props),el+=__ec_propsComun({id:props.id,"class":props["class"],style:props.style}),el+=">",el+=props.content?props.content:"",el+="</"+props.type+">\n"};window.__ec_img=__ec_img,window.__ec_propsComun=__ec_propsComun,window.__ec_dataEach=__ec_dataEach,window.__element=__ec_element}(window,document,jQuery),jQuery.fn.simulateClick=function(){return this.each(function(){if("createEvent"in document){var doc=this.ownerDocument,evt=doc.createEvent("MouseEvents");evt.initMouseEvent("click",!0,!0,doc.defaultView,1,0,0,0,0,!1,!1,!1,!1,0,null),this.dispatchEvent(evt)}else this.click()})};var body=$("body"),htmlBody=$("html, body"),$document=$(document),header=$("#header"),submenuDesktopWrapper=$(".js-submenu-wrap"),userSubmenu=$(".submenu-user"),sidePanelMobile=$(".side-panel"),mobileSubmenu=$(".submenu-mobile"),minicart=$(".minicart"),slide=$(".slide"),slideShelf=$(".slideShelf"),slideBrands=$(".servicos-e-cursos .servicos"),carousel=$(".shelf-carousel"),backToTop=$(".js-back-to-top"),shelf=$(".prateleira"),paginatedShelf=$(".prateleira[id*=ResultItems]"),orderList=$(".order-list"),formNews=$(".newsletter"),depCatBus=$(".dep-cat-bus"),duvidasFrequentes=$(".duvidas"),pagProduto=$(".produto"),sidebar=$(".sidebar");$(function(){function calcDesc(preco,desconto){desconto=desconto.match(/(\(\d+%\)|\(\d+\.\d{2}%\))/g)[0].split("%")[0].split("(")[1]/100,preco=preco.replace(".","").replace(",",".");var precoDesc=(preco*desconto).toFixed(2),total=(preco-precoDesc).toFixed(2);return total=total.replace(".",","),total=total.replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1.")}function unHide(t){setTimeout(function(){$("header").removeClass("ha-hide"),$("header").removeClass("ha-hidding")},t)}$('a[href*="#"]').click(function(event){event.preventDefault();var target=$(this).attr("href");try{var targetOffset=$(target).offset().top-250}catch(err){}$("html, body").animate({scrollTop:targetOffset},300)}),orderList.length>0&&(orderList.find("link").remove(),orderList.find(".page-header").unwrap(".container")),$(".search-toggle").click(function(){$(".main-header .search-box").toggleClass("--active")}),$(".tabs-destaque a").click(function(){$(".tabs-destaque a").removeClass("active");var guardaClass=$(this).attr("class"),findShelfs=$(this).parent(),teste=findShelfs.parent(),testeDois=teste.parent(),testeTres=testeDois.parent(),mamae=testeTres.find("div");mamae.removeClass("active"),$(".prateleiras-destaque div.shelf-"+guardaClass).addClass("active"),$(this).addClass("active"),$(".slick-next").simulateClick("click")}),$(".quantitySelector").each(function(){var $input=$(this).find('input[type="number"]');$input.before('<button class="qnt-more">+</button>'),$input.after('<button class="qnt-less">-</button>'),$(this).on("click","button.qnt-more",function(e){parseInt($input[0].value)<parseInt($input[0].attributes.max.value)&&$input[0].value++,$input.change()}),$(this).on("click","button.qnt-less",function(e){parseInt($input[0].value)>parseInt($input[0].attributes.min.value)&&$input[0].value--,$input.change()})}),$("body.produto").each(function(){$.ajax({url:"/api/catalog_system/pub/products/search?fq=productId:"+$("#___rc-p-id")[0].value,headers:{Accept:"application/json","Content-Type":"application/json"},success:function(data){},error:function(error){console.log("error",error)}})});try{$(".bread-crumb").find("li:first-child a").text("Home")}catch(e){}if($(".helperComplement").length&&$(".helperComplement").remove(),$(window).scroll(function(){var scroll=$(window).scrollTop();scroll>=450?$(".js-back-to-top").addClass("active"):$(".js-back-to-top").removeClass("active")}),body.on("click",".js-back-to-top",function(event){event.preventDefault(),htmlBody.animate({scrollTop:0},300)}),body.on("click",".bt-open-news",function(event){event.preventDefault(),htmlBody.animate({scrollTop:3500},300)}),body.on("click",".rating-click-here",function(event){event.preventDefault(),htmlBody.animate({scrollTop:3500},300)}),body.on("click",".btn-fast-buy",function(event){event.preventDefault();var url=$(this).attr("href");$.get(url,function(data){vtexjs.checkout.getOrderForm().done(function(orderForm){console.log(orderForm),htmlBody.animate({scrollTop:0},300)})})}),$(".banners-top.slider").slick({adaptiveHeight:!0,autoplay:!0,autoplaySpeed:5e3,pauseOnHover:!0,arrows:!1,dots:!0,draggable:!0,touchMove:!0,slidesToShow:1,slidesToScroll:1}),window.matchMedia("(max-width: 1024px)").matches&&$("body.home section.tipBar ul").slick({dots:!1,arrows:!1,draggable:!0,touchMove:!0,autoplay:!0,autoplaySpeed:2500,slidesToShow:2,mobileFirst:!0,slidesToScroll:2,adaptiveHeight:!0}),$(".shelf.slider").find("ul").slick({dots:!1,arrows:!0,draggable:!0,touchMove:!0,autoplay:!1,slidesToShow:2,mobileFirst:!0,slidesToScroll:1,prevArrow:'<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 46.02 46.02"><path d="M14.757 46.02a5.688 5.688 0 0 1-3.929-1.569 5.705 5.705 0 0 1-.204-8.063L23.382 22.97 10.637 9.645a5.703 5.703 0 0 1 8.242-7.884l16.505 17.253a5.707 5.707 0 0 1 .013 7.872L18.893 44.247a5.699 5.699 0 0 1-4.136 1.773z" fill="#FFF"/></svg></button>',nextArrow:'<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 46.02 46.02"><path d="M14.757 46.02a5.688 5.688 0 0 1-3.929-1.569 5.705 5.705 0 0 1-.204-8.063L23.382 22.97 10.637 9.645a5.703 5.703 0 0 1 8.242-7.884l16.505 17.253a5.707 5.707 0 0 1 .013 7.872L18.893 44.247a5.699 5.699 0 0 1-4.136 1.773z" fill="#FFF"/></svg></button>',adaptiveHeight:!0,responsive:[{breakpoint:767,settings:{slidesToShow:3}},{breakpoint:991,settings:{slidesToShow:4}}]}),slideBrands.length>0&&$(".home").find(".servicos-e-cursos .servicos").find(".slider").slick({adaptiveHeight:!0,autoplay:!1,arrows:!1,dots:!0,mobileFirst:!0,draggable:!0,touchMove:!0,slidesToShow:1,slidesToScroll:1,responsive:[{breakpoint:991,settings:{slidesToShow:1}},{breakpoint:767,settings:{slidesToShow:1}},{breakpoint:479,settings:{slidesToShow:1}}]}),$("header .js-open-mobile-menu").click(function(){$(this).toggleClass("active"),$("header .menu-header").toggleClass("slideActive")}),$("header nav.menu .has-sub .js-open-sub").click(function(){$(this).toggleClass("active"),$(this).next().toggleClass("slideActive")}),$(".prateleira li").each(function(){if($(this).find(".best-price").length){var desconto=$(this).find('p[class^="flag desconto-no-boleto"]').text(),preco=$(this).find(".best-price").text().replace(" ","").split("$")[1],total=calcDesc(preco,desconto);$(this).find(".price").append('<span class="preco-boleto">ou R$ '+total+" no boleto</span>")}}),$(".login-out-link").each(function(){var _this=$(this);vtexjs.checkout.getOrderForm().done(function(orderForm){orderForm.loggedIn&&(_this.attr("href","/logout"),_this.find("span").text("Sair"))})}),$(".prateleira li").each(function(){if($(this).find(".best-price").length){var preco=$(this).find(".best-price").text().replace(" ","").split("$")[1];preco=preco.replace(".","").replace(",","."),preco>200&&$(this).find(".flag-frete").append('<p class="flag frete-gratis">Frete grátis SP</p>')}}),sidebar.length>0)try{sidebar.find('input[type="checkbox"]').vtexSmartResearch({elemLoading:"",returnTopText:"",elemLoading:'<i class="shelf__loading"></i>',filterScrollTop:function(shelfOffset){return 20}})}catch(e){}var termoBusca=$("body.resultado-busca .searchResultsTime .resultado-busca-termo .value").text();$("body.resultado-busca h3.tlt-shelf").append(termoBusca);try{$document.ready(function(){$(".shipping-value").simulateClick("click"),$(".box-clipping:nth-child(3n+1)").addClass("colum-edit"),$(".box-clipping:nth-child(3n+2)").addClass("no-margin pull-text-left"),$(".box-clipping:nth-child(3n+3)").addClass("no-margin pull-text-right"),$(".buy-button").text("Comprar"),$(".active-desc").click(function(){$(this).next().slideToggle()}),0==$(".shelfRelacionados li").length&&$(".shelfRelacionados").remove()})}catch(e){}if($(window).scroll(function(){var scroll=$(window).scrollTop();scroll>=350?($("header").addClass("menu-persistente"),$("body").addClass("top-height-active")):($(".menu-persistente").addClass("ha-hidding"),$(".menu-persistente").addClass("ha-hide"),unHide(99),$("header").removeClass("menu-persistente"),$("body").removeClass("top-height-active"))}),pagProduto.length>0)try{$document.ready(function(){$(".selecao-sku .more").click(function(){var $input=$(this).prev();$input.val(+$input.val()+1);var opt_value=$input.val(),currentURL=($(this).next(),$(".buy-button").attr("href")),nomedoproduto=currentURL.split(/\&/)[0];$(".buy-button").removeAttr("href"),$(".buy-button").attr("href",nomedoproduto+"&qty="+opt_value+"&seller=1&redirect=false&sc=1")}),$(".selecao-sku .less").click(function(){var $input=$(this).next();$input.val(+$input.val()-1);var opt_value=$input.val(),currentURL=($(this).next(),$(".buy-button").attr("href")),nomedoproduto=currentURL.split(/\&/)[0];$(".buy-button").removeAttr("href"),$(".buy-button").attr("href",nomedoproduto+"&qty="+opt_value+"&seller=1&redirect=false&sc=1")})})}catch(e){}$(depCatBus).length>0&&(window.location.href.indexOf("OrderByTopSaleDESC")!=-1&&$(".main-category__orderBy li:nth-child(2) a").addClass("active"),window.location.href.indexOf("OrderByReleaseDateDESC")!=-1&&$(".main-category__orderBy li:nth-child(3) a").addClass("active"),window.location.href.indexOf("OrderByPriceDESC")!=-1&&$(".main-category__orderBy li:nth-child(4) a").addClass("active"),window.location.href.indexOf("OrderByPriceASC")!=-1&&$(".main-category__orderBy li:nth-child(5) a").addClass("active")),window.matchMedia("(max-width: 1365px)").matches&&$(".menu-header li").has(".submenu").find(" > a").each(function(){this.removeAttribute("href"),$(this).on("click",function(){$(this).siblings(".submenu").toggleClass("slideActive")})}),$(".close-modal, .bg_modal").click(function(){$(".modal-opacity").fadeOut(600),$("body").removeClass("modal-active"),$(".modal-content").remove()}),$(document).keyup(function(ev){27==ev.keyCode&&$(".modal-opacity").fadeOut(600),$("body").removeClass("modal-active")});try{$document.ajaxStop(function(){orderList.parents("html").removeClass("is-loading")})}catch(e){}try{$document.ready(function(){$(".btn-search").click(function(){$(".btn-buscar").simulateClick("click")})})}catch(e){}$(duvidasFrequentes).length>0&&$(".tab span").click(function(){$(this).toggleClass("active"),$(this).next().slideToggle()}),$("#insta-app").each(function(){if(window.matchMedia("(min-width:1025px)").matches){var Class="",elementClass=$(this).attr("class");elementClass&&(Class=elementClass),$(this).replaceWith('<ul id="insta-app" class="'+Class+'"></ul>');var count=16,userId="1657718611",accessToken="1657718611.4b09eb8.66504be972cb41e184a97bf07cea9434";$.ajax({url:"https://api.instagram.com/v1/users/"+userId+"/media/recent/?count="+count+"&access_token="+accessToken,dataType:"JSONP",jsonpCallback:"callback",type:"GET"}).done(function(data){var post=data.data;for(console.log(post),i=0;i<post.length;i++){var photo='<li><a href="'+post[i].link+'"><img src="'+post[i].images.thumbnail.url+'"/></a></li>';$("#insta-app").append(photo)}})}})}),$(window).load(function(){$("#vtexIdUI-auth-selector .modal-header .close").click(function(){window.location.href=window.location.href.split("/login?")[0]})}),$(window).load(function(){$("body").find("#divCompreJunto").each(function(){$(this).find("img").each(function(){this.src=this.src.replace(/-90-90/g,"-300-225"),this.width=300,this.height=225}),$(this).find(".buy").each(function(){var total=$(this).html().split("<br>")[1].split("<strong>")[0].split(":")[1];total='<span class="total">Valor total:<strong>'+total+"</strong></span>";var savings=$(this).find("strong").last().html().split(":")[1];savings='<span class="savings">Comprando junto você economiza:<strong>'+savings+"</strong></span>";var installments='<span class="installmetns">Por apenas '+$(this).find("strong").first().html()+" de "+$(this).find("strong:nth-child(2)").html()+"</span>";$(this).prepend(total+installments+savings)})})}),$(window).on("load",function(){$(".instaApp-feed").each(function(){var _this=$(this),elementClass=$(this).attr("class")||"",count=12,userId="559458055",accessToken="559458055.4bb98dd.99e6ba92aa6545f4a2a2b3c1b8a9e525";$.ajax({url:"https://api.instagram.com/v1/users/"+userId+"/media/recent/?count="+count+"&access_token="+accessToken,dataType:"JSONP",jsonpCallback:"callback",type:"GET"}).done(function(data){var post=data.data;console.log(post);var posts="";for(i=0;i<post.length;i++)posts+='<li class="insta-post"><a href="'+post[i].link+'"><img src="'+post[i].images.thumbnail.url+'"/></a></li>';_this.replaceWith('<ul class="'+elementClass+'">'+posts+"</ul>")})})}),$(document).ajaxStop(function(){$("button.bt-comprar").click(function(){var myLink=$(this).attr("datahref");window.location.href=myLink})}),$(document).ajaxComplete(function(){$("button.bt-comprar").click(function(){var myLink=$(this).attr("datahref");window.location.href=myLink})}),$(document).ready(function(){$(".txt-sz-16").css("font-size","14px")}),$(document).ready(function(){$(".txt-sz-30").css("font-size","27px")}),$(document).ready(function(){$(".ambiente-title").css("font-size","13px")});