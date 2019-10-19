#!/bin/sh

export XDG_CACHE_HOME="$HOME/var/cache"
export XDG_CONFIG_HOME="$HOME/.config"
export XDG_DATA_HOME="$HOME/usr/share"
export XDG_DESKTOP_DIR="$HOME/usr/dsk"
export XDG_DOWNLOAD_DIR="$HOME/tmp"
export XDG_DOCUMENTS_DIR="$HOME/usr/doc"
export XDG_MUSIC_DIR="$HOME/usr/msc"
export DOTFILES="$HOME/etc"
export XDG_PICTURES_DIR="$HOME/usr/img"
export XDG_VIDEOS_DIR="$HOME/usr/vid"
export NPM_CONFIG_USERCONFIG="$XDG_CONFIG_HOME/npm/config"
export PATH="$PATH:$HOME/bin:$XDG_DATA_HOME/npm-packages/bin:$XDG_DATA_HOME/cargo/bin:$HOME/.yarn/bin"
export TZ="America/New_York"
export GHQ_ROOT="$HOME/src"
export CFLAGS="-march=znver1 -02"
export CXXFLAGS="$CFLAGS"
export TERMINAL="termite -e fish"
export GOPATH="$HOME"
export BUILDDIR="/tmp/makepkg"
export BAT_THEME="Material-Theme-Palenight"
export MANPAGER="nvim -c 'set ft=man' -"
export GNUPGHOME="$XDG_CONFIG_HOME/gpg"
# export GTK2_RC_FILES="$XDG_CONFIG_HOME/gtk-2.0/gtkrc"
export SLACK_DEVELOPER_MENU=true
export FZF_DEFAULT_COMMAND="dash -c 'git ls-tree -r --name-only HEAD 2> /dev/null || fd -H --type f --ignore-file $XDG_CONFIG_HOME/git/gitignore . $HOME'"
export FZF_DEFAULT_OPTIONS="--cycle --color=16,fg+:2,bg+:0,hl:4,hl+:4,prompt:4,pointer:8"
export SKIM_DEFAULT_COMMAND="dash -c 'git ls-tree -r --name-only HEAD 2> /dev/null || fd -H --type f --ignore-file $XDG_CONFIG_HOME/git/gitignore . $HOME'"
export SKIM_DEFAULT_OPTIONS="--cycle --reverse --color=16,fg+:2,bg+:0,hl:4,hl+:4,prompt:4,pointer:8"
export TMUX_HOME="$XDG_CONFIG_HOME/tmux"
export TMUX_PLUGINS_HOME="$TMUX_HOME/plugins"
export TMUX_PLUGIN_MANAGER_PATH="$TMUX_HOME/plugins"
export BROWSER="chromium-snapshot"
export GOPATH="$HOME"
export BUILDDIR="/tmp/makepkg"
export BAT_THEME="Material-Theme-Palenight"
export MANPAGER="nvim -c 'set ft=man' -"
export GNUPGHOME="$XDG_CONFIG_HOME/gpg"
# export GTK2_RC_FILES="$XDG_CONFIG_HOME/gtk-2.0/gtkrc"
export SLACK_DEVELOPER_MENU=true
export FZF_DEFAULT_COMMAND="dash -c 'git ls-tree -r --name-only HEAD 2> /dev/null || fd -H --type f --ignore-file $XDG_CONFIG_HOME/git/gitignore . $HOME'"
export FZF_DEFAULT_OPTIONS="--cycle --color=16,fg+:2,bg+:0,hl:4,hl+:4,prompt:4,pointer:8"
export SKIM_DEFAULT_COMMAND="dash -c 'git ls-tree -r --name-only HEAD 2> /dev/null || fd -H --type f --ignore-file $XDG_CONFIG_HOME/git/gitignore . $HOME'"
export SKIM_DEFAULT_OPTIONS="--cycle --reverse --color=16,fg+:2,bg+:0,hl:4,hl+:4,prompt:4,pointer:8"
export TMUX_HOME="$XDG_CONFIG_HOME/tmux"
export TMUX_PLUGINS_HOME="$TMUX_HOME/plugins"
export TMUX_PLUGIN_MANAGER_PATH="$TMUX_HOME/plugins"
export BROWSER="chromium-snapshot"

export NVM_DIR="$HOME/.config/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
