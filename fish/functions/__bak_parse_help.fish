function __bak_parse_help
  if [ (count $argv) -lt 3 ]
    __bak_help $argv[1]
  else
    return 1
  end
end
