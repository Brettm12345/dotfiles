#!/usr/bin/env fish
set -g SLIMFISH_PROMPT_SYMBOL '-'
set -g SLIMFISH_EXIT_STATUS_SYMBOL '↩'
set -x GITLINE_REPO_INDICATOR '${reset}'
set -x GITLINE_BRANCH '${blue}${branch}${reset}'
set -x GITLINE_REMOTE_COMMITS_PULL '${red}←${reset}${remote_commits_to_pull}'
set -x GITLINE_REMOTE_COMMITS_PUSH '${green}→${reset}${remote_commits_to_push}'
set -x GITLINE_REMOTE_COMMITS_PUSH_PULL '${remote_commits_to_pull}${yellow}⇄${reset}${remote_commits_to_push}'
set -x GITLINE_LOCAL_COMMITS_PUSH_PULL '${local_commits_to_pull}${yellow}⇅${reset}${remote_commits_to_push}'
