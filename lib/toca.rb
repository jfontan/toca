require 'id3lib'
require 'iconv' 

class String
  def to_utf8
    Iconv.conv('utf-8','ISO-8859-1',  self)
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
    return directory if levels <= 0

    tree = {
      :name => directory,
      :files => [], 
      :directories => []
    }

    Dir.glob(File.join(directory, '*')).each{|f|
      if File.directory? f
        tree[:directories] << file_tree(f, levels - 1, filter) if has_music? f
      elsif f =~ /#{filter}/
        tree[:files] << f
      end
    }

    tree
  end
end

module ID3

  def self.get(file)
    tag = ID3Lib::Tag.new(file)
    {
      :title => tag.title,
      :album => tag.album,
      :artist => tag.artist,
      :track => tag.track,
    }
  end
  
  def self.get_image(file)
    ID3Lib::Tag.new(file).frame(:APIC)
  end
  
end

if __FILE__ == $0

  p Finder::file_tree('/home/miki/downloads/mp3', 2)

end
