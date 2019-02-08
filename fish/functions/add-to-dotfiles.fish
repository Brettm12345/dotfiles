function add-to-dotfiles --argument name dir -d Adds a file or folder to dotfiles
	if test -z name; or test -z dir
		echo -e 'Usage: add-to-dotfiles [<name>] [<path>]'
		exit 1
	end
	if test ! -e $dir
		echo -e 'The directory does not exist'
		exit 1
	end
	set -l full_dir (readlink -f $dir)
	set -l relative_dir (realpath --relative-to="$HOME" "$full_dir")
	set -l dotfile_dir "$HOME/etc/$name"
	cp -r "$full_dir" "$dotfile_dir"
	ln -sf "$dotfile_dir" "$full_dir"
	echo "\"$name\" = \"$relative_dir\"" >> $HOME/etc/dotbro/config.toml
	echo "Success!"
end
