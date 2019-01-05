# Dotfiles :fire::fire:

<p align="center">
  <a href="https://xkcd.com/1319/">
    <img src="https://imgs.xkcd.com/comics/automation.png" />
  </a>
</p>

## System info
* browser: `Chromium`
* colorscheme: `Material Palenight`
* desktop font: `Noto Sans ExtraCondensed Semibold`
* desktop-enviroment: `KDE/Plasma`
* editor: `Emacs`
* gtk theme: `Flat-Remix`
* icon theme: `Papirus`
* login manager: `Lightdm webkit2`
* os: `Arch Linux`
* resolution: `3440x1440`
* shell: `Fish`
* terminal editor: `Neovim`
* terminal font: `Iosevka Term Custom`
* terminal: `Termite`


## Instalation
Set `DOTFILES` to whatever you want.
I personally use `~/etc`.
Make sure the enviroment variables `$XDG_CONFIG_HOME` and `$XDG_DATA_HOME` are
set.
### Dependencies
* git 
* Go (required for installation)
* Dotbro (installed with install.sh, is used to symlink files)
``` shell
export DOTFILES="${HOME}/etc"
git clone git://github.com/Brettm12345/dotfiles "$DOTFILES"
eval "$DOTFILES"/install.sh
```

## File Structure
```
/home/brett
├── bin
│   ├── ghq
│   ├── [...]
│   ├── wall-e
│   ├── sgrid
├── etc
│   ├── emacs
│   ├── nvim
│   ├── [...]
│   ├── wm
│   └── xorg
├── org
│   ├── code
│   ├── [...]
│   └── projects
├── src
│  ├── github.com
|      ├── brettm12345
|      ├── [...]
│      └── hlissner
│   ├── [...]
│   ├── gitlab.com
├── tmp
│   └── dwl
├── usr
│   ├── doc
│   ├── img
│   ├── [...]
│   ├── msc
│   └── vid
└── var
    ├── cache
    ├── [...]
    ├── mpd
    └── rtorrent
```

## Screenshots
### Emacs/Chromium
![screenshot](https://i.redd.it/iohg4qda05721.png)
### Window settings
![screenshot](https://ptpimg.me/qpq64p.png)
### Ncmpcpp/Cava/Tmux
![screenshot](https://ptpimg.me/1yf338.png)
### Tmux/Neovim
![screenshot](https://ptpimg.me/gvv9l9.png)
### Discord
![screenshot](https://ptpimg.me/hzo19i.png)
### File manager
![screenshot](https://ptpimg.me/5a7yiw.png)

