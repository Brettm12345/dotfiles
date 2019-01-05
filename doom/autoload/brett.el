;;; private/brett/autoload.el -*- lexical-binding: t; -*-

;;;###autoload
(defun +brett/find-in-dotfiles ()
  "Open a file somewhere in ~/.dotfiles via a fuzzy filename search."
  (interactive)
  (doom-project-find-file (expand-file-name "~/etc")))

;;;###autoload
(defun +brett/browse-dotfiles ()
  "Browse the files in ~/.dotfiles."
  (interactive)
  (doom-project-browse (expand-file-name "~/etc")))

;;;###autoload
(defun +brett/find-notes-for-major-mode (&optional arg)
  "Find org mode documentation for current major mode"
  (interactive)
  (let ((default-directory (expand-file-name "code/" +org-dir)))
    (if arg
        (call-interactively #'find-file)
      (find-file
       (expand-file-name (concat (string-remove-suffix "-mode" (symbol-name major-mode)) ".org"))))))

;;;###autoload
(defun +brett/find-notes-for-project (&optional arg)
  "Find notes for the current project"
  (interactive)
  (let ((default-directory (expand-file-name "projects/" +org-dir)))
    (if arg
        (call-interactively #'find-file)
      (find-file
       (expand-file-name (concat (doom-project-name 'nocache) ".org"))))))


(provide 'brett)
;;; brett.el ends here
