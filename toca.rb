require 'sinatra'

$mp3dir = ARGV[0] 

def playlist_song(song)
  haml :_playlist_song, :locals => {:file => song}, :layout => false
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

get '/toca.css' do
  content_type 'text/css', :charset => 'utf-8'
  sass :"sass/toca" 
end
