require 'id3lib'

module Files

  def self.has_music?(directory, filter = '.*mp3$')
    Dir.glob(directory + '/*').each{|f|
      if File.directory? f
        return true if Files.has_music? f
      elsif f =~ /#{filter}/
        return true
      end
    }
  end

  def self.file_tree(directory, filter = '.*mp3$')
    tree = {
      :files => [], 
      :directories => []
    }

    Dir.glob(directory + '/*').each{|f|
      if File.directory? f
        tree[:directories] << f if Files.has_music? f
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

  p Files::file_tree('/home/miki/downloads/mp3')
  p ID3.get('/home/miki/downloads/mp3//ox - american lo fi/Ox - [11] Awkward Beauty.mp3')

end
