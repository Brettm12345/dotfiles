#!/bin/sh
ws=$( xprop -root _NET_CURRENT_DESKTOP | sed -e 's/_NET_CURRENT_DESKTOP(CARDINAL) = //' )

case $ws in
    0)
        echo "www"
        ;;
    1)
        echo "music"
        ;;
    2)
        echo "chat"
        ;;
    3)
        echo "code"
        ;;
    4)
        echo "misc"
        ;;
    *)
        echo "hidden"
        ;;
esac
