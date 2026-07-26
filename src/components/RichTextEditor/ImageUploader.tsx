'use client'

import React, { useRef, useState } from "react";
import { Image, UploadCloud, Loader2 } from "lucide-react";
import styles from "./RichTextEditor.module.css";
import { insertHTMLAtCursor } from "./utils";

interface Props {
  onInsertImage: (url: string) => void;
}

export default function ImageUploader({ onInsertImage }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    setIsLoading(true);
    // Standard FileReader to convert file to base64 string
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      if (base64) {
        onInsertImage(base64);
      }
      setIsLoading(false);
      setIsOpen(false);
    };
    reader.onerror = () => {
      alert("Failed to read image file.");
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={styles.toolbarButton}
        title="Upload Image"
      >
        <Image className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 bg-white border border-slate-200 rounded-xl p-4 shadow-xl z-50 w-64 space-y-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Upload Local Image</p>
          
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
              dragActive 
                ? "border-primary bg-primary/5" 
                : "border-slate-200 hover:border-primary hover:bg-slate-50/50"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <span className="text-xs text-slate-500 font-semibold">Processing image...</span>
              </>
            ) : (
              <>
                <UploadCloud className="h-8 w-8 text-slate-400" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-700 block">Select File</span>
                  <span className="text-[10px] text-slate-400 font-medium block">Drag & Drop or Paste</span>
                </div>
              </>
            )}
          </div>

          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
