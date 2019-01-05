#!/bin/sh -x

. /home/brett/.profile

pgrep unclutter  || lnch unclutter
pgrep compton    || lnch compton --config "$XDG_CONFIG_HOME"/compton.conf -b
fuser 8080/tcp   || lnch serve -l 8080 "$HOME"/src/github.com/chloechantelle/issy
