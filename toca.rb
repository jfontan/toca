require 'rubygems'
require 'sinatra'
require 'lib/toca'
require 'json'
require 'yaml'
require 'haml'
require 'pp'

#{{{ Compass

gem 'chriseppstein-compass', '~> 0.4'
require 'compass'
 
configure do
  Compass.configuration do |config|
    config.project_path = File.dirname(__FILE__)
    config.sass_dir = File.join('views', 'sass')
  end
end

get '/toca.css' do
  content_type 'text/css', :charset => 'utf-8'
  sass :"sass/toca", :sass => Compass.sass_engine_options
end




#{{{ Config 

config = YAML::load(File.open('conf/conf.yaml'))

$mp3dir = config[:mp3dir]
$server = config[:server]
$servers = config[:syndication] 
$servers << $server unless $servers.include? $server






#{{{ Helpers

def check_path(file)
  dir = File.expand_path(File.dirname(file))
  if dir !~ /^#{ File.expand_path($mp3dir) }/
    raise "Path invalid"
  else
    return true
  end
end


def jasonp(html)
  if params[:jsoncallback]
    content_type 'text/json'
    begin
      params[:jsoncallback] + '(' + {:html => html}.to_json + ')'
    rescue
      params[:jsoncallback] + '(' + {:html => html.to_utf8}.to_json + ')'
    end

  else
    html
  end
end

#{{{ Controlers

get '/' do
  haml :index
end

get '/finder' do

  html = haml :_finder, :layout => false
  
  jasonp(html)
end


get '/directory' do

  name = params[:name]
  name = $mp3dir if name == "Top"
  check_path(name)

  info = Finder.file_tree(name)
  info[:first] = true if name == $mp3dir

  html = haml :_directory, :layout => false, :locals => {:info => info}

  
  jasonp(html)
end

get '/song' do
  name = params[:name]
  check_path(name)

  content_type 'audio/mpeg'
  File.open(name).read
end

get '/playlist_song' do
  name = params[:name]
  check_path(name)

  info =  ID3::get(name)
  html = haml :_playlist_song, :layout => false, :locals => {:song =>  name, :info => info}

  jasonp(html)
end


get '/servers' do
  content_type 'text/json'
  $servers.to_json
end

