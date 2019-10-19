#!/bin/sh -x
. /home/brett/.profile

test -r "$XDG_CONFIG_HOME"/xorg/xres && xrdb -load "$XDG_CONFIG_HOME"/xorg/xres
xrandr --dpi 110 &
lnch unclutter
lnch wendy -m 2 -f ~/etc/termite/config "killall -USR1 termite && notify-send"
lnch wendy -m 2 -f ~/etc/xorg/xres -m 776 -f ~/etc/xorg/xres.d 
