function fish_vi_cursor --on-variable fish_bind_mode
    switch $fish_bind_mode
        case default
            echo -en "\x1b[\x32 q"
        case insert
            echo -en "\x1b[\x36 q"
        case replace_one
            echo -e -n "\x1b[\x33 q"
        case "*"
            echo -en "\x1b[\x32 q"
    end
end
