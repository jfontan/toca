function jsonp(url, process){
    if (url.match(/\?/)){
      url = url + '&jsoncallback=?';
    }else{
      url = url + '?jsoncallback=?';
    }
    
    $.getJSON(url,
      function(data){
        process(data);
    })
}


function tag(name){
  return($("<" + name + "></" + name + ">"));
}

jQuery.fn.dataAttr = function(names){
  return this.each(function() {
     $(this).attr('data-' + name);
   })
}


function span(text){
  return(tag('span').html(text));
}

function finder_file(name, path){
  var file = tag('li');
  file.addClass('file').attr('data-path', path.replace(/\/$/,'') +  '/' + name);
  file.append(span(name));
  file.find('span').click(song2playlist);

  return(file);
}

function is_lazy(info){
  return(info.path == undefined);
}

function lazy_directory(name, path){
  var dir = tag('li');
  dir.addClass('lazyload').addClass('directory').attr('data-path', path.replace(/\/$/,'') +  '/' + name);
  dir.append(span(name));
  dir.find('span').click(replace_directory);

  return(dir);
}

function directory_contents(directories, files, path){
  var contents = tag('ul').addClass('contents');

  $(directories).each(function(){
    var subdirectory = directory(this, path)
    contents.append(subdirectory);
  })

  $(files).each(function(){
    var file = finder_file(this.toString(), path)
    contents.append(file);
  })

  return(contents);
}


function complete_directory(info){
  var path = info.path;
  var name = info.name;
  var directories = info.directories;
  var files = info.files;


  var dir = tag('li');
  dir.addClass('directory').attr('data-path', path);
  dir.append(span(name));
  dir.append(tag('a').attr('href','#').html('add').click(dir2playlist));
  
  var contents = directory_contents(directories, files, path);
  
  dir.append(contents);
  dir.find('span').click(function(){toggle_directory($(this).parent('.directory'))});
  return(dir);
}

function directory(info, path){
  if (is_lazy(info)){
    return(lazy_directory(info.toString(), path));
  }else{
    return(complete_directory(info));
  }
}


function playlist_song(info, server){
  var song = tag('tr').addClass('song').attr('data-server', server).attr('data-path', info.path);
  var file = tag('td').addClass('file').html(info.name);

  file.prepend(tag('a').attr('href','#').html('del').click(function(){$(this).parents('tr').remove()}));
  file.prepend(tag('a').attr('href','#').html('play').click(function(){make_current($(this).parents('tr'))}));
  song.append(file);

  song.append(tag('td').addClass('title').html(info.title));
  song.append(tag('td').addClass('artist').html(info.artist));
  song.append(tag('td').addClass('album').html(info.album));
  song.append(tag('td').addClass('track').html(info.track));

  return(song);
}

function finder(server){
  var fdr = tag('ul');
  fdr.attr('data-server',server).addClass('finder');
  fdr.append(span(server));
  fdr.find('span').click(function(){toggle_directory($(this).parent('.finder'))});
 
  jsonp("http://" + server + "/directory?path=Top" ,
    function(info){
      fdr.append(directory_contents(info.directories, info.files, info.path));
  })
 
  return(fdr);
}
