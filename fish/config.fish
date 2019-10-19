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

# Github
set -x GH_USER "brettm12345"
set -x GH_TOKEN "700ad8514f20eb1ce64cb380b90ebd97d176426b"

# Disable greeting
set -U fish_greeting

# Enable new fzf keybinds
set -U FZF_LEGACY_KEYBINDINGS 0

set -U FZF_PREVIEW "$XDG_CONFIG_HOME/fish/functions/__fzf_complete_preview"

# Set fzf default options
set -U FZF_DEFAULT_OPTS "--ansi --preview='fzf-preview {}' --height=40% --cycle --color='16,fg+:2,bg+:0,hl:4,hl+:4,prompt:4,pointer:8' --reverse"

set -U FZF_ENABLE_OPEN_PREVIEW 1

# Set fzf file preview command
set -U FZF_PREVIEW_FILE_CMD "bat --line-range :10 -p --color always"
set -U FZF_PREVIEW_DIR_CMD "exa -T -F --color=always -a --git-ignore"

# Set default fzf commands
set -U FZF_FIND_FILE_COMMAND "command fd -H -t f -p \$dir"
set -U FZF_OPEN_COMMAND "command fd -H -t f -p \$dir"
set -U FZF_CD_COMMAND "command fd -p -t d -d 5 \$dir"
set -U FZF_CD_WITH_HIDDEN_COMMAND "command fd -H -t d -d 5 -L -p \$dir"

eval (python -m virtualfish)
eval (direnv hook fish)

# tabtab source for serverless package
# uninstall by removing these lines or running `tabtab uninstall serverless`
[ -f /home/brett/usr/share/yarn/global/node_modules/tabtab/.completions/serverless.fish ]; and . /home/brett/usr/share/yarn/global/node_modules/tabtab/.completions/serverless.fish
# tabtab source for sls package
# uninstall by removing these lines or running `tabtab uninstall sls`
[ -f /home/brett/usr/share/yarn/global/node_modules/tabtab/.completions/sls.fish ]; and . /home/brett/usr/share/yarn/global/node_modules/tabtab/.completions/sls.fish
# tabtab source for slss package
# uninstall by removing these lines or running `tabtab uninstall slss`
[ -f /home/brett/usr/share/yarn/global/node_modules/tabtab/.completions/slss.fish ]; and . /home/brett/usr/share/yarn/global/node_modules/tabtab/.completions/slss.fish