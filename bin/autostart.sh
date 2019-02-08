#!/bin/sh -x
. /home/brett/.profile

test -r "$XDG_CONFIG_HOME"/xorg/xres && xrdb -load "$XDG_CONFIG_HOME"/xorg/xres
xrandr --dpi 110 &
lnch unclutter
