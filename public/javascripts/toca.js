function action(name, func){
  $('.' + name).click(
    function(){ 
      return(func(this)); 
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
        try{
          html = zip_inflate(data.html_zip)
          process(html);
        }catch(e){
          html = data.html
        }
        process(html);
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
    location = dataUrl(playlist,'audio/mpegurl');
    return(false);
}

function fetch_directory(target){
  directory = $(target).attr('rel');
  server = $(target).parents('.finder').attr('rel');

  jsonp('http://' + server + '/directory?name=' + directory, 
    function(html){
      item = $(html)
      item.insertAfter(target);
      
      finder = $(target).parents('.finder');
      $(target).remove();
  })

}

function insert_in_playlist(html){
    item = $(html);
    item.attr('rel',server);
    $('#playlist').append(item);
    $('#playlist').trigger("update");
    $('#playlist').tableDnD();
    actions();
}

function add_song2playlist(target){
  song = $(target).attr('rel');
  server = $(target).parents('.finder').attr('rel');

  jsonp('http://' + server + '/playlist_song?name=' + song, 
    function(html){
      insert_in_playlist(html);
  })
}

function add_dir2playlist(target){
  songs = $(target).parent('li.dir').find('li.song');
  server = $(target).parents('.finder').attr('rel');

  $(songs).each(function(){
    name = $(this).attr('rel')
    jsonp('http://' + server + '/playlist_song?name=' + name, 
      function(html){
        insert_in_playlist(html);
    })
  })
}

function play_song(target){
  server = $(target).parents('.finder').attr('rel');
  url =  "http://" + server + $(target).attr('href');
  location = url;
  return(false);
}

function open_close(target){
  directory = $(target).parent('.dir');
  toggle_directory(directory);
}

function actions(){
  action('lazy', fetch_directory);
  action('play_song',play_song);
  action('song2pl', add_song2playlist);
  action('dir2pl', add_dir2playlist);
  action('delete_playlistsong',function(target){ $(target).parents('tr.playlistsong').remove()});
  action('set_current',function(target){ 
    $(target).parents('tr.playlistsong').siblings().removeClass('current');
    $(target).parents('tr.playlistsong').addClass('current');
    play();
  });

  action('open_close', open_close)
}

function get_server_finder(server){
  jsonp('http://' + server + '/finder', 
    function(html){
      item = $("" + html + "");
      item.attr('rel', server);
      item.children('li').children('span').html("" + server + "");
      item.appendTo($('#finders'));
  })
}

function update_finders(){
  $.ajax({
    url: '/servers',
    success: function(data){
      eval("servers =" + data);
      $(servers).each(function(){
        get_server_finder(this);
      })
    }
  })
}

function init_toca(){
  update_finders();
  actions();
  action('make_playlist', make_playlist);
  action('clear_playlist', function(){$('#playlist .playlistsong').remove()});
  init_soundmanager();

  $("#playlist").tablesorter({
    headers: { 
        4: { sorter : 'float' }, 
        5: { sorter : 'float' } 
    } 
  })

  $('#add_server_link').click(function(){
    server = $('#add_server_input').val()
    if ($('.finder').filter('[rel='+server+']').length > 0){
      alert("Server " + server + " is already displayed");
    }else{
      get_server_finder(server);
    }
  })
}

$(init_toca)



