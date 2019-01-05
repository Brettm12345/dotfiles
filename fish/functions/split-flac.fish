function split-flac
	shnsplit -f *.cue *.flac -o flac
mkdir Album
mv split-track* Album
mv *.cue Album
mv *.log Album
beet imp Album
rm -rf Album
end
