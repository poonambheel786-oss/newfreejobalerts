import React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 glass-header bg-surface/80 border-b border-outline-variant/20">
        <div className="flex items-center justify-between px-6 w-full max-w-[1280px] mx-auto h-16">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 rounded-full hover:bg-primary-container/10 transition-colors">
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/" className="flex items-center gap-3 font-bold text-xl text-primary tracking-tight">
              <img src="/logo.png" alt="PR Deep Solution Logo" className="h-9 w-9 object-contain rounded-lg shadow-sm" />
              <span>New<span className="text-on-background">FreeJobAlert</span></span>
            </Link>
          </div>

          {/* Horizontal Category Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors" href="/">Home</Link>
            <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors" href="/jobs?category=all-india-govt-jobs">All India Govt Jobs</Link>
            <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors" href="/jobs?category=state-govt-jobs">State Govt Jobs</Link>
            <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors" href="/jobs?category=bank-jobs">Bank Jobs</Link>
            <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors" href="/jobs?category=teaching-jobs">Teaching Jobs</Link>
            <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors" href="/jobs?category=railway-jobs">Railway Jobs</Link>
            <div className="relative group py-2">
              <div className="flex items-center gap-1 text-on-surface hover:text-primary font-semibold text-sm transition-colors cursor-pointer">
                More <span className="text-[10px]">▼</span>
              </div>
              <div className="absolute left-0 top-full w-52 rounded-lg shadow-xl bg-white border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 divide-y divide-slate-100 py-1">
                <Link className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors" href="/jobs?category=nursing-jobs">Nursing Jobs</Link>
                <Link className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors" href="/jobs?category=engineering-jobs">Engineering Jobs</Link>
                <Link className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors" href="/jobs?category=police-defence-jobs">Police/Defence Jobs</Link>
                <Link className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors" href="/jobs?category=agriculture-jobs">Agriculture Jobs</Link>
                <Link className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors" href="/jobs?category=college-entrance-exams">College Entrance Exams</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-16 min-h-screen flex flex-col flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 mt-auto py-8">
        <div className="max-w-[1280px] mx-auto px-6 text-center space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3 gap-y-2 text-xs font-semibold text-slate-500">
            <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
            <span className="text-slate-300">|</span>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
            <span className="text-slate-300">|</span>
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <span className="text-slate-300">|</span>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link>
            <span className="text-slate-300">|</span>
            <Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link>
            <span className="text-slate-300">|</span>
            <Link href="/editorial-policy" className="hover:text-primary transition-colors">Editorial Policy</Link>
            <span className="text-slate-300">|</span>
            <Link href="/fact-check-policy" className="hover:text-primary transition-colors">Fact Check Policy</Link>
            <span className="text-slate-300">|</span>
            <Link href="/cookie-policy" className="hover:text-primary transition-colors">Cookie Policy</Link>
            <span className="text-slate-300">|</span>
            <Link href="/dmca-policy" className="hover:text-primary transition-colors">DMCA Policy</Link>
            <span className="text-slate-300">|</span>
            <Link href="/correction-policy" className="hover:text-primary transition-colors">Correction Policy</Link>
          </div>
          <p className="text-xs text-on-surface-variant opacity-70">&copy; 2026 PR Deep Solution Pvt. Ltd. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
