require 'rubygems'
require 'sinatra'
require 'sass/plugin'

$mp3dir = ARGV[0] 

def playlist_song(song)
  haml :playlist_song, :locals => {:file => song}, :layout => false
end

get '/' do
  @mp3s = `find #{$mp3dir} -name *.mp3`.split("\n")
  haml :index
end


get '/playlist_song/*' do
  f = params[:splat].first
  playlist_song(f)
end

post '/' do
  files = params[:files]
  puts files.join("\n")
end



__END__

@@ index

:javascript
  function init(){
    $('li.song').click(function(){
      $.ajax({
        url: '/playlist_song/' + $(this).html(),
        success: function(html){
          $('ul#songs').append(html)
        }
       })
    })  
  }

  $(init)


#mp3s
  %ul
    - @mp3s.each do |f|
      %li.song= f

#playlist
  %ul#songs
    = playlist_song("pepe")



@@ layout
%html
  %head
    %title Toca
    %script{ :type => "text/javascript", :src => "http://jqueryjs.googlecode.com/files/jquery-1.3.1.js"}
    %style{:type => "text/css"}
      :sass
        body
          font: 0.9em sans-serif
  %body
    #main
      = yield

@@ playlist_song
%li= file 
