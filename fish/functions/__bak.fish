function __bak
  __bak_parse_help $argv
  or begin
    set program $argv[2]
    for file in $argv[3..-1]
      eval $program $file (__bak_name $file)
    end
  end
end
