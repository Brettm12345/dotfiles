if not which hub >/dev/null
  echo "Please install 'hub' first!"
else
  eval (hub alias -s)
  complete -c hub -w git
end
