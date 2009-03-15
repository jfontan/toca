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
  if file != $mp3dir && dir !~ /^#{ File.expand_path($mp3dir) }/ 
    raise "Path invalid"
  else
    return true
  end
end


def jasonp(data)
  content_type 'text/json'

  json = data.to_json

  if params[:jsoncallback]
    return(params[:jsoncallback] + '(' + json + ')')
  else
    return json
  end

end

#{{{ Controlers

get '/' do
  haml :index
end

get '/directory' do
  path= params[:path]
  path= $mp3dir if path== "Top"
  check_path(path)

  info = Finder.file_tree(path)

  jasonp(info)
end

get '/song_info' do
  path = params[:path]
  check_path(path)

  info =  ID3::get(path)
  info[:path] = path
  info[:name] = File.basename(path)

  jasonp(info)
end


get '/song' do
  name = params[:name]
  check_path(name)

  content_type 'audio/mpeg'
  File.open(name).read
end


get '/servers' do
  content_type 'text/json'
  $servers.to_json
end

