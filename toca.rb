require 'rubygems'
require 'sinatra'


$mp3dir = ARGV[0] 

get '/' do
  @mp3s = `find #{$mp3dir} -name *.mp3`.split("\n")
  haml :index
end


get '/playlist_song/*' do
  f = params[:splat].first
  haml :playlist_song, :locals => {:file => f}
end

post '/' do
  files = params[:files]
  puts files.join("\n")
end



__END__

@@ index

#mp3s
  %ul
    - @mp3s.each do |f|
      %li.song= f

#playlist
  %ul#songs
    = haml :playlist_song, :locals => {:file => 'prueba'} 


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

@@ layout
%html
  %head
    %title Toca
    %script{ :type => "text/javascript", :src => "http://jqueryjs.googlecode.com/files/jquery-1.3.1.js"}
  %body
    #main
    = yield

@@ playlist_song
%li= file 
