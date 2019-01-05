function sk_install -d "Install system packages with skim" --wraps="xbps-install"
    for arg in $argv
        switch $arg
            case -\*\? --\*\?
                if test -e $install_opts
                    set install_opts "$arg"
                else
                    set install_opts "$install_opts $arg"
                end
            case \*
                set package_query "$arg"
        end
    end
    set package_list "xbps-query -Rs '{}'| sort"
    set packagename=''
    set packages (sk \
    --multi \
    --prompt='install > ' \
    --delimiter ' ' --nth 2 \
    --interactive \
    --no-hscroll \
    --cmd "$package_list" \
    --cmd-query "$package_query" \
    --preview="printf {} | cut -d ' ' -f 2 | pkg-info | head -n 100"\
    | cut -d ' ' -f 2)
    if test -n "$packages"
        sudo xbps-install $install_opts $packages
    end
end
