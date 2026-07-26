import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
            <Home className="h-3.5 w-3.5" />
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-900">{title}</span>
        </nav>

        {/* Hero Section */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm text-center md:text-left space-y-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            {title}
          </h1>
          <p className="text-xs text-slate-500 font-semibold">
            Last Updated: <span className="text-slate-700">{lastUpdated}</span>
          </p>
        </div>

        {/* Content Card */}
        <article className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm prose prose-slate max-w-none prose-headings:font-extrabold prose-headings:text-slate-950 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-950">
          {children}
        </article>

        {/* Legal Disclaimer Footer (Internal Quick Links) */}
        <div className="bg-slate-100/50 border border-slate-200/40 rounded-xl p-4 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Legal Navigation</p>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] font-bold text-slate-500">
            <Link href="/about" className="hover:text-primary transition-all">About</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-primary transition-all">Contact</Link>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-primary transition-all">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-primary transition-all">Terms</Link>
            <span>•</span>
            <Link href="/disclaimer" className="hover:text-primary transition-all">Disclaimer</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
