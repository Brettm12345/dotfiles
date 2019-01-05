#!/usr/bin/env fish
set -g -x LC_ALL en_US.utf8
set -g -x LC_LANG en_US.utf8
set -g -x LANG en_US.utf8

# Set hybrid keybindings (Emacs + Vim)
set -U fish_key_bindings fish_hybrid_key_bindings

# Switch between normal and insert mode with no delay
set -U cmd_duration 0

# Colorize the following commands
set -U grc_plugin_execs cat cvs df diff dig gcc g++ ip make mount mtr netstat ping ps tail traceroute wdiff

# Disable greeting
set -U fish_greeting

# Enable new fzf keybinds
set -U FZF_LEGACY_KEYBINDINGS 0

# Set fzf default options
set -U FZF_DEFAULT_OPTS "--reverse --color=16,fg+:2,bg+:0,hl:4,hl+:4,prompt:4,pointer:8"

# Enable fzf tab completion
set -U FZF_COMPLETE 1

# Set default fzf commands
set -U FZF_FIND_FILE_COMMAND "command fd -H -t f -L -p --ignore-file /home/brett/.config/git/ignore \$dir"
set -U FZF_OPEN_COMMAND "command fd -H -t f -L -p --ignore-file /home/brett/.config/git/ignore \$dir"
set -U FZF_CD_COMMAND "command fd -t d -d 5 -L -p \$dir"
set -U FZF_CD_WITH_HIDDEN_COMMAND "command fd -H -t d -d 5 -L -p \$dir"
