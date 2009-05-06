require 'id3lib'
require 'iconv' 
require 'memoize'
include Memoize

class String
  $ic = Iconv.new('UTF-8//IGNORE', 'UTF-8')
  def to_utf8
    $ic.iconv(self+ ' ')[0..-2]
  end
end

module Finder
  
  def self.has_music?(directory, filter = '.*mp3$')
    Dir.glob(directory + '/*').each{|f|
      if File.directory? f
        return true if has_music? f
      elsif f =~ /#{filter}/
        return true
      end
    }
    return false
  end


  def self.file_tree(directory, levels = 1, filter = '.*mp3$')
    return File.basename(directory) if levels <= 0

    tree = {
      :path => directory,
      :name => File.basename(directory),
      :files => [], 
      :directories => []
    }

    Dir.glob(File.join(directory, '*')).sort.each{|f|
      f = f.to_utf8
      if File.directory? f
        tree[:directories] << file_tree(f, levels - 1, filter) if has_music? f
      elsif f =~ /#{filter}/
        tree[:files] << File.basename(f);
      end
    }

    tree
  end

  class << self
    memoize :file_tree
    memoize :has_music?
  end
end

module ID3

  def self.get(file)
    tag = ID3Lib::Tag.new(file)
    {
      :title => tag.title ? tag.title.to_utf8 : "",
      :album => tag.album ? tag.album.to_utf8 : "",
      :artist => tag.artist ? tag.artist.to_utf8 : "",
      :track => tag.track ? tag.track.to_utf8 : "",
    }
  end
  
  def self.get_image(file)
    ID3Lib::Tag.new(file).frame(:APIC)
  end
  
  class << self
    memoize :get
  end

end

if __FILE__ == $0

  p Finder::file_tree('/home/miki/downloads/mp3', 2)

end
