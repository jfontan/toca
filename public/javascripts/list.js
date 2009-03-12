function close(directory){
  $(directory).children('.contents').hide();
}

function open(directory){
  $(directory).children('.contents').show();
}


function toggle_directory(directory){
    if ($(directory).filter("[class*=closed]").length > 0){
      $(directory).addClass('open');                         
      $(directory).removeClass('closed');
      open(directory);
    }else{
      $(directory).addClass('closed');                         
      $(directory).removeClass('open');
      close(directory);
    }
} 

