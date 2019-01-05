function __bak_name
  # trim / for directories
  set file (echo $argv[1] | sed 's/\/*$//')
  echo "$file."(date +'%Y%m%d_%H%M%S')".bak"
end
