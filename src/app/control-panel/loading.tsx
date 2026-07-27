import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-md flex flex-col items-center space-y-3">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <div className="text-center">
          <p className="text-sm font-bold text-slate-800">Processing Request...</p>
          <p className="text-xs text-slate-400 font-medium">Loading details, please wait.</p>
        </div>
      </div>
    </div>
  );
}
