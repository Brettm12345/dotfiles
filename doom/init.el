;;; init.el -*- lexical-binding: t; -*-

(setenv "SHELL" "/usr/bin/fish")
(setq explicit-shell-file-name "/usr/bin/fish")

(doom! :feature
       eval
       (evil +everywhere)
       file-templates
       (lookup
        +devdocs
        +docsets)
       snippets
       spellcheck
       (syntax-checker +childframe)
       workspaces

       :completion
       (company +auto +childframe)
       (ivy +fuzzy +childframe)

       :editor
       format
       lispy
       multiple-cursors
       parinfer
       rotate-text

       :ui
       (popup +all +defaults)
       (pretty-code +fira)
       doom
       doom-dashboard
       doom-quit
       evil-goggles
       fci
       hl-todo
       nav-flash
       neotree
       vc-gutter
       vi-tilde-fringe
       window-select

       :emacs
       (dired +icons)
       ediff
       electric
       eshell
       imenu
       hideshow
       term
       vc

       :tools
       editorconfig
       gist
       make
       magit
       password-store
       pdf
       rgb
       tmux
       upload

       :lang
       cc
       data
       emacs-lisp
       go
       (haskell +intero)
       markdown
       lua
       javascript
       (org
        +attach
        +babel
        +capture
        +export
        +present)
       php
       (python +conda +pyenv)
       rest
       rust
       (sh +fish)
       web

       :app
       (email +gmail)
       regex

       :config
       (default +bindings)
       literate)
