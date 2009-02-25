require 'rubygems'
require 'sinatra'
require 'lib/toca'
require 'json'
require 'yaml'
require 'haml'
require 'pp'

gem 'chriseppstein-compass', '~> 0.4'
require 'compass'
 
configure do
  Compass.configuration do |config|
    config.project_path = File.dirname(__FILE__)
    config.sass_dir = File.join('views', 'sass')
  end
end
 
config = YAML::load(File.open('conf/conf.yaml'))

$mp3dir = config[:mp3dir]
$server = config[:server]
$servers = config[:syndication] 
$servers << $server unless $servers.include? $server

def playlist_song(song)
  haml :_playlist_song, :locals => {:song => song, :info => ID3::get(song)}, :layout => false
end

def song_info_tab(song)
  haml :_song_info_tab, :locals => {:song => song, :info => ID3::get(song)}, :layout => false
end

def tree_song(dir = nil)
  haml :_tree_song, :locals => {:name => dir || $server , :info => Files.file_tree(dir || $mp3dir )}, :layout => false
end

def tree_song_tabs_dir(dir = nil)
  html=haml :_tree_song_tabs, :locals => {:name => dir, :info => Files.file_tree(dir)}, :layout => false
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
  haml :index
end

get '/tree/*' do
  dir = params[:splat].first || nil
  dir = nil unless dir =~ /./
  html = tree_song(dir)
  if params[:jsoncallback]
    content_type 'text/json', :charset => 'utf-8'
    params[:jsoncallback] + '(' + {:data => [html], :server => $server}.to_json + ')'
  else
    html
  end
end

get '/tree_tabs_dir/*' do
  dir = params[:splat].first || nil
  dir = nil unless dir =~ /./
  tree_song_tabs_dir(dir)
end


get '/playlist_song/*' do
  f = params[:splat].first
  html = playlist_song(f)
  if params[:jsoncallback]
    content_type 'text/json', :charset => 'utf-8'
    params[:jsoncallback] + '(' + {:data => [html], :server => $server}.to_json + ')'
  else
    html
  end
end

get '/song_info_tab/*' do
  f = params[:splat].first
  song_info_tab(f)
end

get '/song_image/*' do
  f = params[:splat].first
  image=ID3::get_image(f)
    
  if image
    puts "there's image"
    puts image[:mimetype]
    content_type image[:mimetype]
    image[:data]
  else
    puts "no image"
    "lero"
  end
  
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
    out += "http://#{$server}/song/" + f + "\n"
  }

  out
end
