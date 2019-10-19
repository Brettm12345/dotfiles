function fish_vi_cursor --on-variable fish_bind_mode
    switch $fish_bind_mode
        case default
            echo -en "\x1b[\x32 q"
            set -g SPACEFISH_CHAR_SYMBOL ❮
            set -g fish_color_cwd green
        case insert
            echo -en "\x1b[\x36 q"
            set -g SPACEFISH_CHAR_SYMBOL ❯
            set -g fish_color_cwd cyan
        case replace_one
            echo -e -n "\x1b[\x33 q"
            set -g fish_color_cwd red
        case "*"
            echo -en "\x1b[\x36 q"
    end
end
