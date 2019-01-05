;; -*- no-byte-compile: t; -*-
;;; ~/.config/doom/packages.el

;; completion/company
(package! prescient)
(package! company-prescient)

;; completion/ivy
(package! all-the-icons-ivy)
(package! counsel-tramp)

;; emacs/dired
(package! peep-dired)
(package! diredfl)

;; feature/evil
(package! evil-lisp-state)

;; feature/snippets
(package! yasnippet-snippets)

;; lang/javascript
(package! import-js)
(package! yarn :recipe (:fetcher github :repo "jmfirth/yarn.el"))

;; lang/apache
(package! apache-mode)

;; lang/pkgbuild
(package! pkgbuild-mode)

;; lang/nginx
(package! nginx-mode)

;; lang/org
(package! ob-http)

;; lang/systemd
(package! systemd)

;; lang/sh
(package! flycheck-checkbashisms)

;; tools/tldr
(package! tldr)

;; ui/doom
(package! doom-themes :recipe (:fetcher github :repo "brettm12345/emacs-doom-themes" :files ("*.el" "themes/*.el")))
;; (package! doom-palenight-theme :recipe (:fetcher github :repo "brettm12345/doom-palenight-theme"))

;; ui/modeline
(package! doom-modeline)
(package! anzu)
(package! evil-anzu)

;; ui/indent-guides
(package! highlight-indent-guides)
