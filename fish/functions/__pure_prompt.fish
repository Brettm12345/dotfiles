function __pure_prompt
    set --local virtualenv (__pure_virtualenv_prompt) # Python virtualenv name
    set --local pure_symbol (__pure_symbol_prompt $argv[1])

    echo (__pure_print_prompt $virtualenv $pure_symbol)
end
