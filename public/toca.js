function init(){
  $('span.song').click(function(){
    $.ajax({
      url: '/playlist_song/' + $(this).html(),
      success: function(html){
        $('ul#songs').append(html)
      }
     })
  })  
  $('ul#file_tree').treeview();

}

$(init)


