function __bak_normalized
  set file $argv[1]
  echo "$file" | sed -E "s/$__bak_re/\1/g"
end
