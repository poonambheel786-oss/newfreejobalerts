'use client'

import React, { useRef, useState, useEffect } from "react";
import styles from "./RichTextEditor.module.css";
import { RichTextEditorProps } from "./types";
import { insertHTMLAtCursor, generateHTMLTable } from "./utils";
import { useEditorListeners } from "./hooks";
import Toolbar from "./Toolbar";

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing your notes here...",
  autoFocus = false,
  readOnly = false,
  disabled = false
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHtmlMode, setIsHtmlMode] = useState(false);

  // Sync initial autofocus
  useEffect(() => {
    if (autoFocus && editorRef.current && !readOnly && !disabled) {
      editorRef.current.focus();
    }
  }, [autoFocus, readOnly, disabled]);

  // Handle document formatting command
  const handleCommand = (command: string, val: string = "") => {
    if (readOnly || disabled) return;
    document.execCommand(command, false, val);
    triggerChange();
  };

  const handleLink = () => {
    if (readOnly || disabled) return;
    const url = prompt("Enter link URL:");
    if (url) {
      // Use clean standard styling for inserted links
      const html = `<a href="${url}" target="_blank" class="text-primary font-bold hover:underline">${url}</a>`;
      insertHTMLAtCursor(html);
      triggerChange();
    }
  };

  // Helper to trigger state change
  const triggerChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Insert Table
  const handleTableInsert = (rows: number, cols: number) => {
    if (readOnly || disabled) return;
    const tableHtml = generateHTMLTable(rows, cols);
    insertHTMLAtCursor(tableHtml);
    triggerChange();
  };

  // Modify Table structure
  const handleTableModify = (action: string) => {
    if (readOnly || disabled) return;
    
    // Find the cell, row, and table element at current caret selection
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    let node: Node | null = selection.anchorNode;
    let cell: HTMLTableCellElement | null = null;
    let row: HTMLTableRowElement | null = null;
    let table: HTMLTableElement | null = null;

    while (node && node !== editorRef.current) {
      if (node.nodeName === "TD" || node.nodeName === "TH") {
        cell = node as HTMLTableCellElement;
      } else if (node.nodeName === "TR") {
        row = node as HTMLTableRowElement;
      } else if (node.nodeName === "TABLE") {
        table = node as HTMLTableElement;
        break;
      }
      node = node.parentNode;
    }

    if (!table || !row || !cell) {
      alert("Please place your cursor inside a table cell to modify it.");
      return;
    }

    if (action === "addRowAbove" || action === "addRowBelow") {
      const insertIndex = row.rowIndex + (action === "addRowBelow" ? 1 : 0);
      const newRow = table.insertRow(insertIndex);
      for (let i = 0; i < row.cells.length; i++) {
        const newCell = newRow.insertCell();
        newCell.className = "border border-slate-200 p-2 min-w-[60px]";
        newCell.innerHTML = "&nbsp;";
      }
    } else if (action === "addColumnLeft" || action === "addColumnRight") {
      const insertIndex = cell.cellIndex + (action === "addColumnRight" ? 1 : 0);
      Array.from(table.rows).forEach((r) => {
        const newCell = r.insertCell(insertIndex);
        newCell.className = "border border-slate-200 p-2 min-w-[60px]";
        newCell.innerHTML = "&nbsp;";
      });
    } else if (action === "deleteRow") {
      table.deleteRow(row.rowIndex);
    } else if (action === "deleteColumn") {
      const colIndex = cell.cellIndex;
      Array.from(table.rows).forEach((r) => {
        r.deleteCell(colIndex);
      });
    }

    triggerChange();
  };

  // Insert Image (Base64 or URL)
  const handleImageInsert = (url: string) => {
    if (readOnly || disabled) return;
    const imgHtml = `<img src="${url}" alt="Uploaded image" class="max-w-full h-auto rounded-lg my-2 select-all hover:ring-2 hover:ring-primary transition-all" />`;
    insertHTMLAtCursor(imgHtml);
    triggerChange();
  };

  // Keyboard and Paste listeners hook
  useEditorListeners({
    editorRef,
    onCommand: handleCommand,
    onImageInsert: handleImageInsert,
    readOnly: readOnly || disabled
  });

  // Calculate word and character count
  const getCounts = () => {
    const text = editorRef.current?.innerText || "";
    const cleanText = text.trim();
    const words = cleanText ? cleanText.split(/\s+/).length : 0;
    const chars = text.length;
    return { words, chars };
  };

  // Sync editor content with value prop without triggering resets on typing
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const { words, chars } = getCounts();

  return (
    <div className={`${styles.editorContainer} ${isFullscreen ? styles.fullscreen : ""}`}>
      {/* Toolbar */}
      <Toolbar 
        onCommand={handleCommand}
        onLink={handleLink}
        onTableInsert={handleTableInsert}
        onTableModify={handleTableModify}
        onImageInsert={handleImageInsert}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        isHtmlMode={isHtmlMode}
        onToggleHtmlMode={() => setIsHtmlMode(!isHtmlMode)}
      />

      {/* Editor Content Area */}
      {isHtmlMode ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          readOnly={readOnly}
          className={styles.htmlView}
        />
      ) : (
        <div 
          ref={editorRef}
          contentEditable={!readOnly && !disabled}
          onBlur={triggerChange}
          onInput={triggerChange}
          suppressContentEditableWarning
          data-placeholder={placeholder}
          className={`${styles.editorArea} prose prose-sm max-w-none bg-white`}
          style={{ minHeight: isFullscreen ? 'calc(100vh - 100px)' : '250px' }}
        />
      )}

      {/* Status Bar */}
      <div className={styles.statusbar}>
        <span>Mode: {isHtmlMode ? "HTML View" : "Visual WYSIWYG"}</span>
        <div className="flex gap-4">
          <span>Words: {words}</span>
          <span>Characters: {chars}</span>
        </div>
      </div>
    </div>
  );
}
