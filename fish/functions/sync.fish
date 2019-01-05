function sync
	rsync --info=progress2 -auvz $argv
end
