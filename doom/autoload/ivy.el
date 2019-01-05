;;; ~/.config/doom/autoload/ivy.el -*- lexical-binding: t; -*-

;;;###autoload (autoload 'counsel--hex-colors-action "~/.config/doom/autoload/ivy" nil t)
(defun counsel--hex-colors-action (string)
  "Jumps to the line that a color is on"
  (let* ((start 0)
         (end (length string)))
    (set-text-properties 0 (length string) nil string)
    (goto-line (string-to-number string))))

;;;###autoload (autoload 'counsel--hex-colors-candidates "~/.config/doom/autoload/ivy" nil t)
(defun counsel--hex-colors-candidates ()
  "Return a list of `counsel-hex-colors' candidates."
  (let ((matches))
    (save-match-data
      (save-excursion
        (with-current-buffer (current-buffer)
          (save-excursion
            (goto-char (point-min))
            (while (re-search-forward "\\(#\\(?:[0-9a-fA-F]\\{3\\}\\)+\\{1,4\\}\\)" nil t 1)
              (push
               (propertize
                (format-mode-line "%l")
                'hex
                (downcase
                 (match-string-no-properties 0)))
               matches)))))
      matches)))

;;;###autoload (autoload 'counsel-hex-colors "~/.config/doom/autoload/ivy" nil t)
(defun counsel-hex-colors ()
  "Open a list of hex colors in the current buffer to select with ivy"
  (interactive)
  (let* ((colors (counsel--hex-colors-candidates))
         (blank (make-string 10 ?\s))
         (fmt (format "%%-%ds %%s %%s"
                      (apply #'max 0 (mapcar #'string-width colors))))
         (ivy-format-function
          (counsel-colors--formatter
           (lambda (color)
             (let ((hex (get-text-property 0 'hex color)))
               (format fmt color
                       (propertize hex 'face (list :foreground hex))
                       (propertize blank 'face (list :background hex))))))))
    (ivy-read
     "Jump to color: " colors
     :require-match t
     :history 'counsel-hex-colors-history
     :sort t
     :action #'counsel--hex-colors-action)))
