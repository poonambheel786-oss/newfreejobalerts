// src/app/(public)/blog/[slug]/share-buttons.tsx
'use client';

import React from "react";
import { Link2 } from "lucide-react";

interface Props {
  title: string;
  path: string; // e.g. "/blog/slug" or "/jobs/slug"
}

export default function ShareButtons({ title, path }: Props) {
  const handleCopyLink = () => {
    const url = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  const encodedTitle = encodeURIComponent(title);
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${path}` : `https://www.newfreejobalerts.com${path}`;
  const encodedUrl = encodeURIComponent(shareUrl);

  return (
    <div className="flex items-center gap-2">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors cursor-pointer"
        title="Share on Facebook"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors cursor-pointer"
        title="Share on Twitter"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      </a>
      <button
        onClick={handleCopyLink}
        className="p-2 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors cursor-pointer"
        title="Copy Link"
      >
        <Link2 className="h-4 w-4" />
      </button>
    </div>
  );
}
