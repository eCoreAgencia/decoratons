$('a[href*="#"]').click(function(event){
  event.preventDefault();
  var target = $(this).attr('href');
  try{
    var targetOffset = ($(target).offset().top) - 250;
  }
  catch(err){}
  $('html, body').animate({ scrollTop: targetOffset}, 300);
});