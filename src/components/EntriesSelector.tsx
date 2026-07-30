'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function EntriesSelector({ 
  currentLimit, 
  options = [10, 20, 50, 100] 
}: { 
  currentLimit: number; 
  options?: number[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', e.target.value);
    params.set('page', '1'); // Reset to page 1 on limit change
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
      <span>Show</span>
      <select
        value={currentLimit}
        onChange={handleChange}
        className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 font-bold focus:outline-none focus:border-primary transition-colors cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <span>entries</span>
    </div>
  );
}
