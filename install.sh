#!/bin/sh

BASEDIR=$(dirname "$0")

setupFish() {
    if command -v fish > /dev/null; then
        echo "Installing fisher..."
        curl https://git.io/fisher --create-dirs -sLo $XDG_CONFIG_HOME/fish/functions/fisher.fish > /dev/null
        echo "Installing plugins..."
        fish -c fisher > /dev/null
        read -p "Do you wish to setup neovim (y/n)" yn
        case $yn in
            [Yy]* ) chsh -s /usr/bin/fish;;
            [Nn]* ) echo "Keeping default shell..."
        esac
    else
        echo "Please install fish-shell"
    fi
}

setupEmacs() {
    if command -v emacs > /dev/null; then
        cd "$HOME"/.emacs.d
        make
    else
        echo "Please install emacs"
    fi
}

setupNvim() {
    if command -v nvim > /dev/null; then
        cd "$BASEDIR"/nvim
        if command -v pip3 > /dev/null; then
            echo "Setting up python virtual environment..."
            ./venv.sh > /dev/null
            echo "Installing plugins..."
            make > /dev/null
            echo "Setting colorscheme..."
            nvim --cmd 'set t_ti= t_te= nomore' -N -U NONE -i NONE \
                -c "try | colorscheme palenight | finally | call confirm('') | qall! | endtry"
        else
            echo "Please install python 3"
        fi
        cd ../
    else
        echo "Please install neovim"
    fi
}

if command -v go > /dev/null; then
    if test ! -x "$GOPATH"/bin/dotbro; then
        echo "Installing dotbro..."
        go get -u github.com/hypnoglow/dotbro
    fi
    echo "Symlinking dotfiles..."
    eval "$GOPATH"/bin/dotbro --config "$BASEDIR"/dotbro/config.toml
else
    echo "Please install go. Cannot install dotbro"
    exit 1
fi

read -p "Do you wish to setup neovim (y/n)" yn
case $yn in
    [Yy]* ) setupNvim;;
    [Nn]* ) echo "Skipping neovim setup..."
esac

read -p "Do you wish to setup emacs (y/n)" yn
case $yn in
    [Yy]* ) setupEmacs;;
    [Nn]* ) echo "Skipping emacs setup..."
esac

read -p "Do you wish to setup fish-shell (y/n)" yn
case $yn in
    [Yy]* ) setupFish;;
    [Nn]* ) echo "Skipping fish setup..."
esac

echo "Install finished!"
