#!/bin/sh

BASEDIR=$(dirname "$0")

if command -v emacs > /dev/null; then
    echo "Installing doom emacs..."
    git clone git@github.com:/hlissner/doom-emacs "$HOME"/.emacs.d
    echo "Cloning emacs configuration..."
    git clone git@github.com:/Brettm12345/doom-emacs-literate-config "$HOME"/.config/doom
else
    echo "Emacs is not installed skipping emacs config"
fi

if command -v nvim > /dev/null; then
    echo "Cloning neovim configuration..."
    git clone git@github.com:/Brettm12345/vim-config "$HOME"/.config/nvim
else
    echo "Neovim is not installed skipping neovim config"
fi

if command -v go > /dev/null; then
    if test ! -x "$GOPATH"/bin/dotbro; then
        echo "Installing dotbro..."
        go get -u github.com/hypnoglow/dotbro
    fi
    echo "Symlinking dotfiles..."
    eval "$GOPATH"/bin/dotbro --config "$BASEDIR"/dotbro/config.toml
else
    echo "Go is not installed. Cannot install dotbro"
fi

echo "Install finished"
