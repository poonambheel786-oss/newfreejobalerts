import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-[2px] z-[9999] flex flex-col items-center justify-center space-y-4">
      {/* Top Crawling Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-100 overflow-hidden">
        <div className="h-full bg-primary w-full animate-[loading-bar_1.5s_infinite_linear] origin-left"></div>
      </div>
      
      {/* Center Spinner */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
      
      <p className="text-xs font-bold text-slate-500 tracking-wider uppercase animate-pulse">Loading Updates...</p>
    </div>
  );
}
