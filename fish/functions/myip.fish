function myip
	curl -s checkip.dyndns.org | grep -Eo '[0-9\.]+'
end
