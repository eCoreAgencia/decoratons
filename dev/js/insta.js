$('#insta-app').each(function(){
	var elementClass = $(this).attr('class') || '';
	$(this).replaceWith('<ul id="insta-app" class="'+elementClass+'"></ul>');
	var count = 12;
	var userId = '559458055';
	var accessToken = '559458055.4bb98dd.99e6ba92aa6545f4a2a2b3c1b8a9e525';
	$.ajax({
	    url: 'https://api.instagram.com/v1/users/'+userId+'/media/recent/?count='+count+'&access_token='+accessToken,
	    dataType: 'JSONP',
	    jsonpCallback: 'callback',
	    type: 'GET',
	}).done(function(data){
		var post = data.data;
		console.log(post);
		for(i=0; i< post.length; i++){
			var photo = '<li class="insta-post"><a href="'+post[i].link+'"><img src="'+post[i].images.thumbnail.url+'"/></a></li>'
			$('#insta-app').append(photo);
		}
	});
});