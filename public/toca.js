sort_playlist = true

function set_actions(){
  $('#mp3s a.dir2playlist').click(function(){
    $(this).next('ul').find('span.song').each(function() {
      add_song($(this).attr('id'))
    })
    return(false);
  }).removeClass('a.dir2playlist')

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
    return(false)
    $(this).click();
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


