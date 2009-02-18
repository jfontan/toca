
function add_song(song){
  $.ajax({
    url: '/playlist_song/' + song,
    success: function(html){
      $('ul#songs').append(html)
      $('a.delete').click(function(){
        $(this).parents('li').remove();
        return(false);
      });
    }
   })
}

function init(){
  $('#mp3s  span.song').click(function(){
    add_song($(this).attr('id'))
    return(false);
  })  

  $('#mp3s a.dir2playlist').click(function(){
    $(this).next('ul').find('span.song').each(function() {
      add_song($(this).attr('id'))
    })
    return(false);
                                  
  })


  $('ul#file_tree').treeview({collapsed : true});
  
  


  $('a#create_playlist').click(function(){
    songs = ""
    $('#playlist li.song').each(function(){
      songs += $(this).attr('id') + '|'
    })
    window.location = '/playlist/?songs=' + songs
    return(false);
  });

}

$(init)


