function parse_git_branch -d "Parse current Git branch name"
    command git symbolic-ref --short HEAD 2>/dev/null

    or echo (command git show-ref --head -s --abbrev HEAD)[1]
end


function git_branch_prompt
    set --local git_branch (parse_git_branch) # current git branch
    set --local git_branch_color "$pure_color_yellow"

    echo "$git_branch_color$git_branch"
end

function git_dirty_prompt
    set --local git_dirty_symbol

    # Check if there are files to commit
    set --local is_git_dirty (command git status --porcelain --ignore-submodules ^/dev/null)
    if test -n "$is_git_dirty"
        set git_dirty_symbol "$pure_color_red $pure_symbol_git_dirty"
    else
        set git_dirty_symbol "$pure_color_green $pure_symbol_git_clean"
    end
    echo "$git_dirty_symbol"
end

function __pure_git_prompt
    # Check if is on a Git repository
    set --local is_git_repository (command git rev-parse --is-inside-work-tree ^/dev/null)
    if test -n "$is_git_repository"
        set --local git_prompt (git_branch_prompt)(git_dirty_prompt)
        echo $git_prompt
    end
end
