function circle-crop
	convert $argv[1] -alpha on \( +clone -threshold -1 -negate -fill white -draw "circle 539,539 539,0" \) -compose copy_opacity -composite $argv[2]
end
