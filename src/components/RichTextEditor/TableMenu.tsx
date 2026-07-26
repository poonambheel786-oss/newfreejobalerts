'use client'

import React, { useState } from "react";
import { Grid3X3, Plus, Trash2, ArrowUpCircle, ArrowDownCircle, ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import styles from "./RichTextEditor.module.css";

interface Props {
  onInsertTable: (rows: number, cols: number) => void;
  onModifyTable: (action: string) => void;
}

export default function TableMenu({ onInsertTable, onModifyTable }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [gridSize, setGridSize] = useState({ r: 3, c: 3 });

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={styles.toolbarButton}
        title="Table Menu"
      >
        <Grid3X3 className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 bg-white border border-slate-200 rounded-xl p-4 shadow-xl z-50 w-56 space-y-3">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Insert Grid Table</p>
            <div className="flex gap-2 items-center">
              <input 
                type="number" 
                value={gridSize.r} 
                min={1} 
                max={15} 
                onChange={(e) => setGridSize({ ...gridSize, r: parseInt(e.target.value) || 3 })}
                className="w-12 h-8 border border-slate-200 rounded text-center text-xs font-semibold"
              />
              <span className="text-xs font-semibold text-slate-400">x</span>
              <input 
                type="number" 
                value={gridSize.c} 
                min={1} 
                max={15} 
                onChange={(e) => setGridSize({ ...gridSize, c: parseInt(e.target.value) || 3 })}
                className="w-12 h-8 border border-slate-200 rounded text-center text-xs font-semibold"
              />
              <button
                type="button"
                onClick={() => {
                  onInsertTable(gridSize.r, gridSize.c);
                  setIsOpen(false);
                }}
                className="flex-grow bg-primary text-white text-xs font-bold h-8 rounded hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Insert
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-2 space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Modify Selected Table</p>
            
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => onModifyTable("addRowAbove")}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-primary hover:bg-slate-50 p-1.5 rounded transition-all text-left"
              >
                <ArrowUpCircle className="h-3 w-3" /> Add Row (A)
              </button>
              <button
                type="button"
                onClick={() => onModifyTable("addRowBelow")}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-primary hover:bg-slate-50 p-1.5 rounded transition-all text-left"
              >
                <ArrowDownCircle className="h-3 w-3" /> Add Row (B)
              </button>
              <button
                type="button"
                onClick={() => onModifyTable("addColumnLeft")}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-primary hover:bg-slate-50 p-1.5 rounded transition-all text-left"
              >
                <ArrowLeftCircle className="h-3 w-3" /> Add Col (L)
              </button>
              <button
                type="button"
                onClick={() => onModifyTable("addColumnRight")}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-primary hover:bg-slate-50 p-1.5 rounded transition-all text-left"
              >
                <ArrowRightCircle className="h-3 w-3" /> Add Col (R)
              </button>
              <button
                type="button"
                onClick={() => onModifyTable("deleteRow")}
                className="flex items-center gap-1 text-[10px] font-bold text-rose-600 hover:bg-rose-50 p-1.5 rounded transition-all text-left"
              >
                <Trash2 className="h-3 w-3" /> Delete Row
              </button>
              <button
                type="button"
                onClick={() => onModifyTable("deleteColumn")}
                className="flex items-center gap-1 text-[10px] font-bold text-rose-600 hover:bg-rose-50 p-1.5 rounded transition-all text-left"
              >
                <Trash2 className="h-3 w-3" /> Delete Col
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
