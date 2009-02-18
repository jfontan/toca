function init(){
  $('#mp3s  span.song').click(function(){
    $.ajax({
      url: '/playlist_song/' + $(this).attr('id'),
      success: function(html){
        $('ul#songs').append(html)
        $('a.delete').click(function(){
          $(this).parents('li').remove();
          return(false);
        });
      }
     })
  })  
  $('ul#file_tree').treeview();
  
  


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


