var appKey = 'AIzaSyBHQpYVwiVVT7wz1bAA0gnM3xF9oz1HftM';
var parts = 'snippet';
var channelId = 'UCQGzq-YXXgr7-uV4m2BbkbA';
var order = 'date';
var limite = '5';
function getVideos(appKey,parts,channelId,order){
	var url = 'https://www.googleapis.com/youtube/v3/search?order='+order+'&part='+parts+'&channelId='+channelId+'&maxResults='+limite+'&key='+appKey;
	var videos;
	$.ajax(url,{
		type: 'Get',
		async: false
	}).done(function(data, key, val){
		videos = data.items;
	});
	return videos;
}

var videos = getVideos(appKey,parts,channelId,order);
console.log(videos);
for(i = 0; i < videos.length; i++){
	var id = videos[i].id.videoId;
	var title = videos[i].snippet.title;
	var thumb = videos[i].snippet.thumbnails.medium.url;
	if(i==0){
		$('#yt-app #main-video').append('<iframe id="ytplayer" data-title="'+title+'" data-thumbnail="'+thumb+'" type="text/html" width="720" height="405" src="https://www.youtube.com/embed/'+id+'" frameborder="0" allowfullscreen>');
	}else{
		var miniVideo = '<li data-id="'+id+'" class="yt-video-item"><img class="yt-thumb" src="'+thumb+'"/><h3 class="yt-title">'+title+'</h3></li>';
		$('#yt-app #more-videos').append(miniVideo);
	}
}

$('#yt-app #more-videos li').click(function(){
	var mainVid = $('#yt-app #main-video iframe');
	var mainTitle = mainVid.attr('data-title');
	var mainThumb = mainVid.attr('data-thumbnail');
	var mainId = mainVid.attr('src').split('embed/')[1];
	var newTitle = $(this).find('h3').text();
	var newThumb = $(this).find('img').attr('src');
	var newUrl = "https://www.youtube.com/embed/" + $(this).attr('data-id');
	$('#yt-app #main-video iframe').attr('src',newUrl);
	$('#yt-app #main-video iframe').attr('data-thumbnail',newThumb);
	$('#yt-app #main-video iframe').attr('data-title',newTitle);
	$(this).fadeOut();
	$(this).remove();
	var miniVideo = '<li data-id="'+mainId+'" class="yt-video-item"><img class="yt-thumb" src="'+mainThumb+'"/><h3 class="yt-title">'+mainTitle+'</h3></li>';
	$('#yt-app #more-videos').append(miniVideo);
});