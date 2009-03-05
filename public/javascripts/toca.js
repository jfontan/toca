function action(name, func){
  $('.' + name).click(
    function(){ 
      func(this); 
  }).removeClass(name);
}

function jsonp(url, process){
    if (url.match(/\?/)){
      url = url + '&jsoncallback=?';
    }else{
      url = url + '?jsoncallback=?';
    }
    
    $.getJSON(url,
      function(data){
        process(data.html);
        actions();
    })
}

function make_playlist(){
    playlist = "#EXTM3U\n";
    $('tr.playlistsong').each(function(){
      song = $(this).attr("id")
      server = $(this).attr("rel")
      if ($(this).find('td:nth-child(2)').html() != ""){
        title = $(this).find('td:nth-child(2)').html();
      }else{
        title = song;
      }
      playlist += "#EXTINF, " + title + "\n"
      playlist += "http://" + server + "/song?name=" + song + "\n"
    })
    window.open(dataUrl(playlist,'audio/mpegurl'));  
    return(false);
}

function fetch_directory(target){
  directory = $(target).attr('rel');
  server = $(target).parents('.finder').attr('rel');

  jsonp('http://' + server + '/directory?name=' + directory, 
    function(html){
      item = $("" + html + "")
      item.insertAfter(target);
      
      finder = $(target).parents('.finder');
      $(target).remove();
      finder.treeview({ add: item}); 
  })

}

function add_song2playlist(target){
  song = $(target).attr('rel');
  server = $(target).parents('.finder').attr('rel');

  jsonp('http://' + server + '/playlist_song?name=' + song, 
    function(html){
      item = $("" + html + "");
      $('#playlist').append(item);
      actions();
  })
}

function add_dir2playlist(target){
  songs = $(target).parent('li.directory').find('li.song');
  server = $(target).parents('.finder').attr('rel');

  $(songs).each(function(){
    name = $(this).attr('rel')
    jsonp('http://' + server + '/playlist_song?name=' + name, 
      function(html){
        item = $("" + html + "");
        $('#playlist').append(item);
        actions();
    })
  })
}


function actions(){
  action('lazyload', fetch_directory);
  action('song2playlist', add_song2playlist);
  action('dir2playlist', add_dir2playlist);
  action('delete_playlistsong',function(target){ $(target).parents('tr.playlistsong').remove()});
  action('set_current',function(target){ 
    $(target).parents('tr.playlistsong').siblings().removeClass('current');
    $(target).parents('tr.playlistsong').addClass('current');
    play();
  });
}

function init_toca(){
  actions();
  $('.finder').treeview();
  action('make_playlist', make_playlist);
  action('clear_playlist', function(){$('#playlist .playlistsong').remove()});
  init_soundmanager();
  
}

$(init_toca)



