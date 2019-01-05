function __bak_unbak
  __bak_parse_help $argv
  or begin
    set program $argv[2]
    for file in $argv[3..-1]
      set normalized (__bak_normalized $file)
      if test ! -e $file
        echo "File \"$file\" not exists! Cannot unbak \"$file\"."
      else if not __bak_is_bak $file
        echo "File \"$file\" don't meet bak files convention! Cannot unbak \"$file\"."
      else if test -e $normalized
        echo "File \"$normalized\" exists! Cannot unbak \"$file\"."
      else
        eval $program $file $normalized
      end
    end
  end
end
