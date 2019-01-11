function tmux -d "Attach to existing tmux session if possible" --wrap tmux
	if test (count $argv) -gt 0
		command tmux -f $TMUX_HOME/tmux.conf $argv
	else
		command tmux -f $TMUX_HOME/tmux.conf attach-session -d >/dev/null ^&1
		or command tmux -f $TMUX_HOME/tmux.conf
	end
end
