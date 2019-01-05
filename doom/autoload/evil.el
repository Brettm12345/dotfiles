;;; ~/.config/doom/autoload/evil.el -*- lexical-binding: t; -*-

;;;###autoload (autoload 'evil-motion-insert-newline-below "~/.config/doom/autoload/evil" nil t)
(evil-define-motion evil-motion-insert-newline-below (count)
  "Insert COUNT newlines below"
  :type line
  (save-excursion
    (dotimes (c (or count 1))
      (evil-insert-newline-below))))

;;;###autoload (autoload 'evil-motion-insert-newline-above "~/.config/doom/autoload/evil" nil t)
(evil-define-motion evil-motion-insert-newline-above (count)
  "Insert COUNT newlines above"
  :type line
  (save-excursion
    (dotimes (c (or count 1))
      (evil-insert-newline-above))))

;;;###autoload (autoload '+brett/sort "~/.config/doom/autoload/evil" nil t)
(evil-define-operator +brett/sort (beg end)
  "Sort lines with motion"
  (interactive "<r>")
  (sort-lines nil beg end))
