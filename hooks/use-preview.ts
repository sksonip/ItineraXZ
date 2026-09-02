"use client";

import {
  useCallback,
  useState,
} from "react";

type PreviewMode =
  | "desktop"
  | "mobile";

type UsePreviewReturn = {
  isOpen: boolean;
  isFullscreen: boolean;
  mode: PreviewMode;

  open: () => void;
  close: () => void;
  toggle: () => void;

  enterFullscreen: () => void;
  exitFullscreen: () => void;
  toggleFullscreen: () => void;

  setMode: (mode: PreviewMode) => void;

  print: () => void;
};

export function usePreview(): UsePreviewReturn {
  const [isOpen, setIsOpen] =
    useState(false);

  const [isFullscreen, setIsFullscreen] =
    useState(false);

  const [mode, setMode] =
    useState<PreviewMode>("desktop");

  /* ====================================== */
  /* OPEN / CLOSE                            */
  /* ====================================== */

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setIsFullscreen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((current) => !current);
  }, []);

  /* ====================================== */
  /* FULLSCREEN                              */
  /* ====================================== */

  const enterFullscreen =
    useCallback(() => {
      setIsOpen(true);
      setIsFullscreen(true);
    }, []);

  const exitFullscreen =
    useCallback(() => {
      setIsFullscreen(false);
    }, []);

  const toggleFullscreen =
    useCallback(() => {
      setIsOpen(true);

      setIsFullscreen(
        (current) => !current
      );
    }, []);

  /* ====================================== */
  /* PRINT                                   */
  /* ====================================== */

  const print = useCallback(() => {
    /*
     * Give the preview a moment to render
     * before opening the browser print
     * dialog.
     */

    if (!isOpen) {
      setIsOpen(true);

      window.setTimeout(() => {
        window.print();
      }, 100);
    } else {
      window.print();
    }
  }, [isOpen]);

  return {
    isOpen,
    isFullscreen,
    mode,

    open,
    close,
    toggle,

    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,

    setMode,

    print,
  };
}

export default usePreview;