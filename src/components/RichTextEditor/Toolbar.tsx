'use client'

import React, { useState } from "react";
import { 
  Undo, Redo, Code, Heading1, Heading2, AlignLeft, AlignCenter, AlignRight, 
  Link2, Trash2, Bold, Italic, Underline, Strikethrough, List, ListOrdered, 
  Indent, Outdent, Palette, Paintbrush, Minus, Maximize, Minimize 
} from "lucide-react";
import styles from "./RichTextEditor.module.css";
import TableMenu from "./TableMenu";
import ImageUploader from "./ImageUploader";

interface Props {
  onCommand: (command: string, value?: string) => void;
  onLink: () => void;
  onTableInsert: (rows: number, cols: number) => void;
  onTableModify: (action: string) => void;
  onImageInsert: (url: string) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isHtmlMode: boolean;
  onToggleHtmlMode: () => void;
}

const COLORS = [
  "#000000", "#e06666", "#f6b26b", "#ffd966", "#93c47d",
  "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0", "#ffffff"
];

export default function Toolbar({
  onCommand, onLink, onTableInsert, onTableModify, onImageInsert,
  isFullscreen, onToggleFullscreen, isHtmlMode, onToggleHtmlMode
}: Props) {
  const [showTextColor, setShowTextColor] = useState(false);
  const [showBgColor, setShowBgColor] = useState(false);

  return (
    <div className={styles.toolbar}>
      {/* Undo/Redo */}
      <button type="button" onClick={() => onCommand("undo")} className={styles.toolbarButton} title="Undo"><Undo className="h-4 w-4" /></button>
      <button type="button" onClick={() => onCommand("redo")} className={styles.toolbarButton} title="Redo"><Redo className="h-4 w-4" /></button>
      <div className={styles.toolbarDivider}></div>

      {/* HTML Code View */}
      <button 
        type="button" 
        onClick={onToggleHtmlMode} 
        className={`${styles.toolbarButton} ${isHtmlMode ? "bg-slate-200" : ""}`} 
        title="HTML Source View"
      >
        <Code className="h-4 w-4" />
      </button>
      <div className={styles.toolbarDivider}></div>

      {/* Text Format Headers */}
      <button type="button" onClick={() => onCommand("formatBlock", "H1")} className={styles.toolbarButton} title="Heading 1"><Heading1 className="h-4 w-4" /></button>
      <button type="button" onClick={() => onCommand("formatBlock", "H2")} className={styles.toolbarButton} title="Heading 2"><Heading2 className="h-4 w-4" /></button>
      <button type="button" onClick={() => onCommand("formatBlock", "P")} className={`${styles.toolbarButton} font-bold text-xs`} title="Paragraph">P</button>
      <button type="button" onClick={() => onCommand("formatBlock", "BLOCKQUOTE")} className={`${styles.toolbarButton} font-serif italic text-xs`} title="Blockquote">“”</button>
      <div className={styles.toolbarDivider}></div>

      {/* Font Size Dropdown */}
      <select
        onChange={(e) => onCommand("fontSize", e.target.value)}
        className="h-8 bg-white border border-slate-200 rounded-lg text-xs font-semibold px-2 focus:outline-none"
        defaultValue="3"
      >
        <option value="1">Small</option>
        <option value="3">Normal</option>
        <option value="5">Large</option>
        <option value="7">Extra Large</option>
      </select>
      <div className={styles.toolbarDivider}></div>

      {/* Inline styles */}
      <button type="button" onClick={() => onCommand("bold")} className={styles.toolbarButton} title="Bold"><Bold className="h-4 w-4" /></button>
      <button type="button" onClick={() => onCommand("italic")} className={styles.toolbarButton} title="Italic"><Italic className="h-4 w-4" /></button>
      <button type="button" onClick={() => onCommand("underline")} className={styles.toolbarButton} title="Underline"><Underline className="h-4 w-4" /></button>
      <button type="button" onClick={() => onCommand("strikeThrough")} className={styles.toolbarButton} title="Strikethrough"><Strikethrough className="h-4 w-4" /></button>
      <div className={styles.toolbarDivider}></div>

      {/* Text Colors */}
      <div className="relative">
        <button 
          type="button" 
          onClick={() => { setShowTextColor(!showTextColor); setShowBgColor(false); }} 
          className={styles.toolbarButton} 
          title="Text Color"
        >
          <Palette className="h-4 w-4" />
        </button>
        {showTextColor && (
          <div className={styles.colorPickerPopup}>
            {COLORS.map((c) => (
              <div 
                key={c} 
                className={styles.colorSwatch} 
                style={{ backgroundColor: c }} 
                onClick={() => { onCommand("foreColor", c); setShowTextColor(false); }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <button 
          type="button" 
          onClick={() => { setShowBgColor(!showBgColor); setShowTextColor(false); }} 
          className={styles.toolbarButton} 
          title="Highlight Color"
        >
          <Paintbrush className="h-4 w-4" />
        </button>
        {showBgColor && (
          <div className={styles.colorPickerPopup}>
            {COLORS.map((c) => (
              <div 
                key={c} 
                className={styles.colorSwatch} 
                style={{ backgroundColor: c }} 
                onClick={() => { onCommand("hiliteColor", c); setShowBgColor(false); }}
              />
            ))}
          </div>
        )}
      </div>
      <div className={styles.toolbarDivider}></div>

      {/* Alignments */}
      <button type="button" onClick={() => onCommand("justifyLeft")} className={styles.toolbarButton} title="Align Left"><AlignLeft className="h-4 w-4" /></button>
      <button type="button" onClick={() => onCommand("justifyCenter")} className={styles.toolbarButton} title="Align Center"><AlignCenter className="h-4 w-4" /></button>
      <button type="button" onClick={() => onCommand("justifyRight")} className={styles.toolbarButton} title="Align Right"><AlignRight className="h-4 w-4" /></button>
      <div className={styles.toolbarDivider}></div>

      {/* Lists */}
      <button type="button" onClick={() => onCommand("insertUnorderedList")} className={styles.toolbarButton} title="Unordered List"><List className="h-4 w-4" /></button>
      <button type="button" onClick={() => onCommand("insertOrderedList")} className={styles.toolbarButton} title="Ordered List"><ListOrdered className="h-4 w-4" /></button>
      <button type="button" onClick={() => onCommand("indent")} className={styles.toolbarButton} title="Indent"><Indent className="h-4 w-4" /></button>
      <button type="button" onClick={() => onCommand("outdent")} className={styles.toolbarButton} title="Outdent"><Outdent className="h-4 w-4" /></button>
      <div className={styles.toolbarDivider}></div>

      {/* Media and Tables */}
      <button type="button" onClick={onLink} className={styles.toolbarButton} title="Insert Link"><Link2 className="h-4 w-4" /></button>
      <ImageUploader onInsertImage={onImageInsert} />
      <TableMenu onInsertTable={onTableInsert} onModifyTable={onTableModify} />
      <button type="button" onClick={() => onCommand("insertHorizontalRule")} className={styles.toolbarButton} title="Horizontal Rule"><Minus className="h-4 w-4" /></button>
      <button type="button" onClick={() => onCommand("removeFormat")} className={`${styles.toolbarButton} text-[10px] font-bold`} title="Clear Formatting">Clear</button>
      <div className={styles.toolbarDivider}></div>

      {/* Fullscreen Toggle */}
      <button 
        type="button" 
        onClick={onToggleFullscreen} 
        className="ml-auto p-1.5 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      >
        {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
      </button>
    </div>
  );
}
