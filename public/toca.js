sort_playlist = true

function set_actions(){
  $('#mp3s a.dir2playlist').click(function(){
<<<<<<< HEAD:public/toca.js
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

=======
    $(this).next('ul').find('span.song').each(function() {
      add_song($(this).attr('id'))
    })
    return(false);
  }).removeClass('a.dir2playlist')
>>>>>>> f418ef39016a8f76f5dbc080545751689c9cc505:public/toca.js

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
<<<<<<< HEAD:public/toca.js
    $(this).click(function(){});
    return(false)
=======
    return(false)
    $(this).click();
>>>>>>> f418ef39016a8f76f5dbc080545751689c9cc505:public/toca.js
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

<<<<<<< HEAD:public/toca.js
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

function init(){
=======
function add_song(song){
  $.ajax({
    url: '/playlist_song/' + song,
    success: function(html){
      $('table#songs').append(html)
      update_playlist();
      set_actions();
    }
   })
}

function get_tree(sever, dir){
}

function initial_servers(){

  $(servers).each(function(){
    $.getJSON('http://' + this + '/tree/?jsoncallback=?',function(data){
        html = data.data;
        server = data.server;
        new_tree = $("<ul class='file_tree' rel='" + server + "'>" + html + "</ul>").treeview();
        alert(new_tree.attr('rel'))
        $('#mp3s').append(new_tree);
        set_actions();
     })
  })

}

function init(){
  $('#mp3s  span.song').click(function(){
    add_song($(this).attr('id'))

    return(false);
  })  

>>>>>>> f418ef39016a8f76f5dbc080545751689c9cc505:public/toca.js
  initial_servers();
  set_actions();

  $('ul.file_tree').treeview();

  $('a#create_playlist').click(function(){
    songs = ""
    $('#playlist tr.song').each(function(){
      songs += $(this).attr('id') + '|'
    })
    window.location = '/playlist/?songs=' + songs
    return(false);
  });

}

$(init)


