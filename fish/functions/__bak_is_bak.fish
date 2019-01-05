function __bak_is_bak
  set file $argv[1]
  echo "$file" | grep -Eq $__bak_re
end
