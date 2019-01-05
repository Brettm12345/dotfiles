function fish_hybrid_key_bindings --description "Vi-style bindings that inherit emacs-style bindings in all modes"
    for mode in default insert visual
        fish_default_key_bindings -M $mode
    end
    fish_vi_key_bindings --no-erase
    # jk to exit insert mode
    bind -M insert -m default jk backward-char force-repaint
    # Correctly bind sudope
    bind -M insert -m default \cs sudope
end
