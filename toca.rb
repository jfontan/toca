require 'rubygems'
require 'sinatra'
require 'lib/toca'

gem 'chriseppstein-compass', '~> 0.4'
require 'compass'
 
configure do
  Compass.configuration do |config|
    config.project_path = File.dirname(__FILE__)
    config.sass_dir = File.join('views', 'sass')
  end
end
 

$mp3dir = ARGV[0] 

$host = "hoop.esi.ucm.es"
$port = Sinatra::Application::port

def playlist_song(song)
  haml :_playlist_song, :locals => {:song => song, :info => ID3::get(song)}, :layout => false
end

def tree_song(name, dir)
  haml :_tree_song, :locals => {:name => name, :info => dir}, :layout => false
end



def check_file(file) 
  dir = File.expand_path(File.dirname(file))
  if dir !~ /^#{ File.expand_path($mp3dir) }/
    return false
  else
    return true
  end

end

get '/' do
  @top_dir = Files.file_tree($mp3dir,'.*mp3$')
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
  sass :"sass/toca", :sass => Compass.sass_engine_options
end

get '/song/*' do

  file = params[:splat].first
  if check_file(file)
    content_type 'audio/mpeg'
    File.open(file).read
  else
    "Error: Path not permited"
  end
end

get '/playlist/' do
  content_type 'audio/x-mpegurl'

  songs = params[:songs].split(/\|/).select{|f| f =~ /./}


  out = "#EXTM3U\n"
  songs.each{|f|
    out += "#EXTINF, #{File.basename(f)}\n"
    out += "http://#{$host}:#{$port}/song/" + f + "\n"
  }

  out
end
