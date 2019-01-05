if not type -q npm
  if test -d /usr/local/share/npm/bin
    if not contains /usr/local/share/npm/bin $PATH
      set PATH /usr/local/share/npm/bin $PATH
    end
  else if test -n "$NPM_DIR"; and test -d $NPM_DIR
    if not contains $NPM_DIR $PATH
      set PATH $NPM_DIR $PATH
    end
  else
    echo "plugin-node: npm is unavailable, either install it or set $NPM_DIR"
    echo "             in the config.fish file: set NPM_DIR /path/to/npm/dir"
  end
end

if not contains ./node_modules/.bin $PATH
  set PATH ./node_modules/.bin $PATH
end
