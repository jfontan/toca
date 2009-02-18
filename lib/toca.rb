module Files

  def self.file_tree(directory, filter = '.*mp3$')

    tree = {
      :files => [], 
      :directories => {}
    }
    Dir.glob(directory + '/*').each{|f|
      if File.directory? f
        sub_tree = Files::file_tree(f, filter)
        tree[:directories][f] = sub_tree if sub_tree[:files].any? || sub_tree[:directories].keys.any?
      elsif f =~ /#{filter}/
        tree[:files] << f
      end
    }

    tree
  end

end

if __FILE__ == $0

  p  Files::file_tree('/home/miki/downloads/mp3')

end
