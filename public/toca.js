sort_playlist = true

function set_actions(){
  $('#mp3s a.dir2playlist').click(function(){
    server = $(this).parents('ul.file_tree').attr('rel')
    $(this).next('ul').find('span.song').each(function() {
      song = $(this).attr('id')
      add_song(server,song)
    })
    return(false);
  }).removeClass('dir2playlist')

  $('#mp3s  span.song2playlist').click(function(){
    song = $(this).attr('id')
    server = $(this).parents('ul.file_tree').attr('rel')
    add_song(server, song)

    return(false);
  }).removeClass('song2playlist')  

  $('a.delete').click(function(){
      $(this).parents('tr').remove();
      return(false);
    });

  $('li.lazyload').click(function(){
    server = $(this).parents('ul.file_tree').attr('rel')
    dir = $(this).attr('rel')
    item = this
    $.getJSON('http://' + server + '/tree/' + dir + '?jsoncallback=?',
      function(data){
        html = data.data;
        var new_item = $(""+html+"").insertBefore($(item))
        $(item).parents('ul.file_tree').treeview({ add: new_item });
        $(item).remove()
        set_actions();
      })
    $(this).click(function(){});
    return(false)
  }).removeClass('lazyload')

}


function update_playlist(){
    if (sort_playlist){
      $("table#songs").tablesorter(); 
      sort_playlist = false
    }else{
      $("table#songs").trigger("update").tableDnD(); 
    }
}

function add_song(server,song){
  $.getJSON('http://' + server + '/playlist_song/' + song + '?jsoncallback=?',
      function(data){
        html = data.data;
        $('table#songs tbody').append($("" + html + ""))
        update_playlist();
        set_actions();
      })
}

function initial_servers(){
  $(servers).each(function(){
    $.getJSON('http://' + this + '/tree/?jsoncallback=?',function(data){
        html = data.data;
        server = data.server;
        new_tree = $("<ul class='file_tree' rel='" + server + "'>" + html + "</ul>").treeview();
        $('#mp3s').append(new_tree);
        set_actions();
     })
  })

}

function make_playlist(){
    playlist = "#EXTM3U\n";
    $('tr.song').each(function(){
      song = $(this).attr("id")
      server = $(this).attr("rel")
      playlist += "#EXTINF, " + song + "\n"
      playlist += "http://" + server + "/song/" + song + "\n"
    })
    window.open(dataUrl(playlist,'audio/mpegurl'));  
    return(false);
}

function init_finder(){
  $('#tags').finder({
    title : 'Find the song',
    onItemSelect : function(listItem,eventTarget,finderObject){
        var anchor = $('a',listItem);
        var href = anchor.attr('title');

        // Debug is a function specified in Finder script for debugging purposes
        // Remove it if unnecessary
        debug('onItemSelect - URL: ',href);
        
        if(eventTarget.attr('class')=='add_song'){
          add_song('lobezno.dacya.ucm.es:4567', href);
          return false;
        }

        // By returning false, the url specified is not fetched
        // ie. Do not display new column if selected item is not an image
        //if(href.indexOf('.jpg') == -1) {return false;}
        
        return true;
      }
  });
}

function playlist(){
    list = []; 
    $('tr.song').each(function(){
      song = $(this).attr("id")
      server = $(this).attr("rel")
      //list.push("http://" + server + "/song/" + song)
      list.push("/song/" + song)
    })

    return(list.reverse())
}

function play(){
    list = playlist();
    song = list.pop();
    try{
    var song = soundManager.createSound({
        id: song,
        url: song,
        volume: 50
        });
    }catch(e){
        alert(e)
    }
    song.play();

    return(false);
}

soundManager.onerror = function(){
    $('ul#controls').find().remove();
    $('ul#controls').remove();
}

function init_toca(){
  initial_servers();
  set_actions();

  $('ul.file_tree').treeview();

  $('a#create_playlist').click(make_playlist)
  $('a#clear_playlist').click(function(){$('tr.song').remove()})
  
  init_finder();
  
  $('a.play').click(play)
}

$(init_toca)



