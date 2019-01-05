function package_info -d "Show info about an installed package"
    if test -z $argv
        while read -l line
            set query "$line"
        end
    else
        set query "$argv"
    end
    set -l blue (set_color -o blue)
    set -l normal (set_color normal)
    echo $blue"Info:"$normal
    xbps-query -S $query | rg -0 -e "^\S*" --color ansi
    echo
    echo $blue"Dependencies:"$normal
    xbps-query -x $query
    echo
    echo $blue"Files:"$normal
    xbps-query -f $query
end

