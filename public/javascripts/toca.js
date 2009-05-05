function make_playlist(){
    playlist = "#EXTM3U\n";
    $('tr.song').each(function(){
      song = $(this).attr("data-path")
      server = $(this).attr("data-server")
      if ($(this).find('td:nth-child(2)').html() != ""){
        title = $(this).find('td:nth-child(2)').html();
      }else{
        title = song;
      }
      playlist += "#EXTINF, " + title + "\n"
      playlist += "http://" + server + "/song?name=" + song + "\n"
    })
    location = dataUrl(playlist,'audio/mpegurl');
    return(false);
}

function play_song(target){
  server = $(target).parents('.finder').attr('rel');
  url =  "http://" + server + $(target).attr('href');
  location = url;
  return(false);
}

function dir2playlist(){
  var dir = $(this).parent('.directory');
  var server = dir.parents('.finder').attr('data-server');
  var songs = $(dir).find('.file');

  $(songs).each(function(){song2playlist(this); return true});
  return(false);
}

function song2playlist(song){
  song = $(song);
  var server = song.parents('.finder').attr('data-server');
  var path = song.attr('data-path');
  var playlist = $('#playlist');

  jsonp("http://" + server + "/song_info?path=" +  path,
    function(info){
      var song = playlist_song(info, server);
      playlist.append(song);
  })
  return(false);
}

function replace_directory(){
  var dir = $(this).parent('.directory');
  var server = dir.parents('.finder').attr('data-server');
  var path = dir.attr('data-path');

  jsonp("http://" + server + "/directory?path=" +  path,
    function(info){
      var subdir = directory(info);
      dir.after(subdir);
      dir.remove();
  })
}

function make_current(target){
  target.siblings().removeClass('current');
  target.addClass('current');
  play();
}

function clear_playlist(){
  $('#playlist').find('.song').remove();
}

function init_servers(){
  $.ajax({
     url: '/servers',
     success: function(data){
       eval("servers= " + data);
       $(servers).each(function(){
         $('#finders').append(finder(this.toString()));
       })
     }
  })
}

function fit_size(){
  var height = $(window).height();
  var width = $(window).width();
  var offset = $('#content').offset();


  h = height - offset.top;
  w = width -  offset.left;

  $('#finders').height(h);
  $('#player').height(h);

  var finder_w = w * 0.30;
  var player_w = w * 0.60;

  $('body').width(width);
  $('#finders').width(finder_w);
  $('#player').width(player_w);

}

function init_toca(){
  init_soundmanager();
  init_servers();

  $("#playlist").tablesorter({
    headers: { 
        4: { sorter : 'float' }, 
        5: { sorter : 'float' } 
    } 
  })

  $('.clear_playlist').click(clear_playlist);

  $('#add_server_link').click(function(){
    server = $('#add_server_input').val()
    if ($('.finder').filter('[data-server='+server+']').length > 0){
      alert("Server " + server + " is already displayed");
    }else{
       $('#finders').append(finder(server));
    }
  })

  fit_size();
  $(window).resize(fit_size);
}

$(init_toca)



