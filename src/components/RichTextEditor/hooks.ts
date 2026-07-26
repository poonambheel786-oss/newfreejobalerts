'use client'

import React, { useEffect, RefObject } from "react";

interface HookProps {
  editorRef: RefObject<HTMLDivElement | null>;
  onCommand: (command: string, value?: string) => void;
  onImageInsert: (url: string) => void;
  readOnly?: boolean;
}

export function useEditorListeners({ editorRef, onCommand, onImageInsert, readOnly }: HookProps) {
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || readOnly) return;

    // Handle Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      const key = e.key.toLowerCase();

      if (key === "b") {
        e.preventDefault();
        onCommand("bold");
      } else if (key === "i") {
        e.preventDefault();
        onCommand("italic");
      } else if (key === "u") {
        e.preventDefault();
        onCommand("underline");
      } else if (key === "z") {
        e.preventDefault();
        onCommand("undo");
      } else if (key === "y") {
        e.preventDefault();
        onCommand("redo");
      }
    };

    // Handle Paste Images
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const items = e.clipboardData.items;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          e.preventDefault();
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              const base64 = evt.target?.result as string;
              if (base64) {
                onImageInsert(base64);
              }
            };
            reader.readAsDataURL(file);
          }
          break;
        }
      }
    };

    editor.addEventListener("keydown", handleKeyDown);
    editor.addEventListener("paste", handlePaste);

    return () => {
      editor.removeEventListener("keydown", handleKeyDown);
      editor.removeEventListener("paste", handlePaste);
    };
  }, [editorRef, onCommand, onImageInsert, readOnly]);
}
