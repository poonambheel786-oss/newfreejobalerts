// src/app/(public)/blog/[slug]/share-buttons.tsx
'use client';

import React, { useState } from "react";
import { Link2, Check, Share2 } from "lucide-react";

interface Props {
  title: string;
  path: string; // e.g. "/blog/slug" or "/jobs/slug"
  shortPath?: string; // e.g. "/j/abc12345"
}

export default function ShareButtons({ title, path, shortPath }: Props) {
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.newfreejobalerts.com';
  const fullUrl = `${origin}${path}`;
  const shortUrl = shortPath ? `${origin}${shortPath}` : fullUrl;

  // Use full URL for standard shares, or short URL if available
  const shareUrl = shortUrl || fullUrl;
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(shareUrl);
  const whatsappText = encodeURIComponent(`${title}\n\n👉 Apply Online & Details:\n${shareUrl}`);
  const telegramText = encodeURIComponent(title);

  const handleCopy = async () => {
    const textToCopy = `${title}\n${shareUrl}`;
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `${title}\n`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        if ((err as Error).name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
      {/* WhatsApp Share */}
      <a
        href={`https://api.whatsapp.com/send?text=${whatsappText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
        title="Share on WhatsApp"
        aria-label="Share on WhatsApp"
      >
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.79 14.07c-.24.68-1.21 1.34-1.76 1.41-.5.06-1.15.09-3.7-0.96-2.91-1.2-4.8-4.17-4.95-4.36-.14-.19-1.19-1.58-1.19-3.02 0-1.44.75-2.15 1.02-2.44.27-.29.6-.36.8-.36.2 0 .4 0 .58.01.19.01.44-.07.69.52.25.6.86 2.09.93 2.24.07.15.12.33.02.53-.1.2-.15.33-.3.51-.15.18-.32.4-.46.54-.15.15-.31.32-.13.63.18.31.8 1.32 1.71 2.13 1.18 1.05 2.17 1.37 2.48 1.52.31.15.49.13.67-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.7-.16.28.1 1.77.83 2.07.98.3.15.5.23.58.36.08.13.08.77-.16 1.45z"/>
        </svg>
      </a>

      {/* Telegram Share */}
      <a
        href={`https://t.me/share/url?url=${encodedUrl}&text=${telegramText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-500 hover:text-white transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
        title="Share on Telegram"
        aria-label="Share on Telegram"
      >
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-2.01 1.28-5.69 3.77-.54.37-1.03.55-1.47.54-.48-.01-1.4-.27-2.09-.49-.84-.27-1.51-.42-1.45-.89.03-.25.38-.51 1.07-.78 4.2-1.83 7.01-3.04 8.42-3.64 4.01-1.68 4.84-1.97 5.39-1.98.12 0 .39.03.56.17.15.12.19.28.21.44-.01.12-.02.26-.04.4z"/>
        </svg>
      </a>

      {/* Facebook Share */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
        title="Share on Facebook"
        aria-label="Share on Facebook"
      >
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </a>

      {/* Twitter / X Share */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
        title="Share on X (Twitter)"
        aria-label="Share on X (Twitter)"
      >
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>

      {/* Copy Title + Link Button */}
      <button
        onClick={handleCopy}
        className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm hover:shadow ${
          copied
            ? "bg-emerald-600 text-white"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
        }`}
        title="Click to copy Title & Link"
        aria-label="Copy Title and Link"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 animate-in zoom-in-50 duration-200" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="h-4 w-4" />
            <span>Copy Link</span>
          </>
        )}
      </button>

      {/* Native Web Share Button (Mobile / Supported Browsers) */}
      <button
        onClick={handleNativeShare}
        className="sm:hidden p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 cursor-pointer shadow-sm"
        title="Share via App"
        aria-label="Share via App"
      >
        <Share2 className="h-4 w-4" />
      </button>
    </div>
  );
}
