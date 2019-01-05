function sve --description 'Add service to runit' --wraps "ls /etc/sv"
	sudo ln -s /etc/runit/sv/$argv /run/runit/service
end
