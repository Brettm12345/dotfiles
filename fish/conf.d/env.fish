# XDG
set -x XDG_CACHE_HOME "$HOME/var/cache"
set -x XDG_CONFIG_HOME "$HOME/.config"
set -x XDG_DATA_HOME "$HOME/usr/share"
set -x XDG_DESKTOP_DIR "$HOME/usr/dsk"
set -x XDG_DOWNLOAD_DIR "$HOME/tmp"
set -x XDG_DOCUMENTS_DIR "$HOME/usr/doc"
set -x XDG_MUSIC_DIR "$HOME/usr/msc"
set -x XDG_PICTURES_DIR "$HOME/usr/img"
set -x XDG_VIDEOS_DIR "$HOME/usr/vid"

# Directories
set -x GHQ_ROOT "$HOME/src"
set -x GOPATH "$HOME"
set -x CARGO_HOME "$XDG_DATA_HOME/cargo"
set -x GNUPGHOME "$XDG_CONFIG_HOME/gpg"

# Default programs
set -x BROWSER "chromium"
set -x EDITOR "nvim"
set -x IMGVIEW "sxiv -b"
set -x MANPAGER "nvim -c 'set ft=man' -"
set -x SHELL "/usr/bin/fish"
set -x VIDPLAY "mpv"

# Misc settings
set -x BAT_THEME "Material-Theme-Palenight"
set -x BUILDDIR "/tmp/makepkg"
set -x LESS "-F -g -i -M -R -S -w -X -z-4"
set -x MPD_HOST "localhost"

# Npm
set -x NPM_CONFIG_USERCONFIG "$XDG_CONFIG_HOME/npm/config"
set -x NPM_CONFIG_CACHE "$XDG_CACHE_HOME/npm"
set -x NODE_ENV "development"
set -x NPM_CONFIG_TMP "$XDG_RUNTIME_DIR/npm"
set -x NODENV_ROOT "$XDG_DATA_HOME/nodenv"
set -x NPM_DIR "$XDG_DATA_HOME/yarn/global/bin"

# Tmux
set -x TMUX_HOME "$XDG_CONFIG_HOME/tmux"
set -x TMUX_PLUGIN_MANAGER_PATH "$TMUX_HOME/plugins"

# FZF
set -x FZF_DEFAULT_COMMAND "sh -c 'git ls-tree -r --name-only HEAD 2> /dev/null || fd -H --type f --ignore-file $XDG_CONFIG_HOME/git/ignore . $HOME'"
set -x FZF_DEFAULT_OPTIONS "--cycle --color=16,fg+:2,bg+:0,hl:4,hl+:4,prompt:4,pointer:8 --border"

# Skim
set -x SKIM_DEFAULT_COMMAND "sh -c 'git ls-tree -r --name-only HEAD 2> /dev/null || fd -H --type f --ignore-file $XDG_CONFIG_HOME/git/ignore . $HOME'"
set -x SKIM_DEFAULT_OPTIONS "--cycle --color=16,fg+:2,bg+:0,hl:4,hl+:4,prompt:4,pointer:8 --border"

# Faster compilation
set -x CFLAGS "-march=znver1"
set -x CXXFLAGS "$CFLAGS"

# Path
set -U fish_user_paths "$HOME/bin" "$HOME/.cask/bin" "$HOME/.emacs.d/bin" "$NPM_DIR" "$CARGO_HOME/bin"
