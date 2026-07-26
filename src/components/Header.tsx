'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Award, Newspaper, FileText } from "lucide-react";

interface StateItem {
  id: string;
  name: string;
  slug: string;
}

interface HeaderProps {
  states: StateItem[];
}

export default function Header({ states }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 glass-header bg-surface/90 border-b border-outline-variant/20 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 w-full max-w-[1280px] mx-auto h-16 gap-4">
          <div className="flex items-center gap-4 shrink-0">
            {/* Hamburger Button for Mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-primary-container/10 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/" className="flex items-center gap-3 font-bold text-xl text-primary tracking-tight shrink-0">
              <img src="/logo.png" alt="PR Deep Solution Logo" className="h-9 w-9 object-contain mix-blend-multiply" />
              <span>New<span className="text-on-background">FreeJobAlert</span></span>
            </Link>
          </div>

          {/* Desktop Categories Navigation (Visible on lg and above) */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-6">
            <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors shrink-0" href="/">Home</Link>
            <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors shrink-0" href="/jobs?category=all-india-govt-jobs">All India Govt Jobs</Link>
            
            {/* State Govt Jobs Mega Menu */}
            <div className="relative group py-2 shrink-0">
              <div className="flex items-center gap-1 text-on-surface hover:text-primary font-semibold text-sm transition-colors cursor-pointer select-none">
                State Govt Jobs <span className="text-[10px]">▼</span>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-[900px] xl:w-[1000px] rounded-2xl shadow-2xl bg-white border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-6">
                <div className="grid grid-cols-4 border-t border-l border-slate-100 rounded-xl overflow-hidden bg-white">
                  {states.map((st) => (
                    <Link 
                      key={st.id} 
                      href={`/jobs?state=${st.slug}`}
                      className="text-xs font-semibold text-slate-700 hover:text-primary hover:bg-slate-50/50 px-4 py-3 border-r border-b border-slate-100 transition-colors block text-left"
                    >
                      {st.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors shrink-0" href="/jobs?category=bank-jobs">Bank Jobs</Link>
            <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors shrink-0" href="/jobs?category=teaching-jobs">Teaching Jobs</Link>
            <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors shrink-0" href="/jobs?category=railway-jobs">Railway Jobs</Link>
            <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors shrink-0" href="/jobs?category=police-defence-jobs">Police/Defence Jobs</Link>

            {/* More Dropdown */}
            <div className="relative group py-2 shrink-0">
              <div className="flex items-center gap-1 text-on-surface hover:text-primary font-semibold text-sm transition-colors cursor-pointer select-none">
                More <span className="text-[10px]">▼</span>
              </div>
              <div className="absolute right-0 top-full w-52 rounded-lg shadow-xl bg-white border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 divide-y divide-slate-100 py-1">
                <Link className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors" href="/jobs?category=nursing-jobs">Nursing Jobs</Link>
                <Link className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors" href="/jobs?category=engineering-jobs">Engineering Jobs</Link>
                <Link className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors" href="/jobs?category=agriculture-jobs">Agriculture Jobs</Link>
                <Link className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors" href="/jobs?category=college-entrance-exams">College Entrance Exams</Link>
                <Link className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors" href="/jobs?type=admit-cards">Admit Cards</Link>
                <Link className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors" href="/jobs?type=results">Results</Link>
              </div>
            </div>
          </div>

          {/* Mobile Categories Scrollbar (Always visible on mobile below navigation) */}
          <div className="flex lg:hidden flex-1 items-center gap-4 overflow-x-auto whitespace-nowrap no-scrollbar py-2 max-w-full min-w-0 ml-2">
            <Link className="text-on-surface hover:text-primary font-semibold text-xs transition-colors shrink-0" href="/">Home</Link>
            <Link className="text-on-surface hover:text-primary font-semibold text-xs transition-colors shrink-0" href="/jobs?category=all-india-govt-jobs">All India</Link>
            <Link className="text-on-surface hover:text-primary font-semibold text-xs transition-colors shrink-0" href="/jobs?category=state-govt-jobs">State Jobs</Link>
            <Link className="text-on-surface hover:text-primary font-semibold text-xs transition-colors shrink-0" href="/jobs?category=bank-jobs">Bank</Link>
            <Link className="text-on-surface hover:text-primary font-semibold text-xs transition-colors shrink-0" href="/jobs?category=teaching-jobs">Teaching</Link>
            <Link className="text-on-surface hover:text-primary font-semibold text-xs transition-colors shrink-0" href="/jobs?category=railway-jobs">Railway</Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer (Side Menu Overlay) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
          />

          {/* Sidebar Drawer */}
          <div className="relative w-80 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col z-50 animate-slide-in overflow-y-auto no-scrollbar">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5 font-bold text-base text-primary">
                <img src="/logo.png" alt="Logo" className="h-7 w-7 object-contain mix-blend-multiply" />
                <span>NewFreeJobAlert</span>
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-5 flex-grow space-y-6">
              {/* Main Categories Section */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Navigation</h3>
                <div className="grid grid-cols-1 gap-1">
                  <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                    Home
                  </Link>
                  <Link href="/jobs?category=all-india-govt-jobs" className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                    All India Govt Jobs
                  </Link>
                </div>
              </div>

              {/* Browse Categories Section */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Job Categories</h3>
                <div className="grid grid-cols-1 gap-1">
                  <Link href="/jobs?category=bank-jobs" className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                    <span>Bank Jobs</span>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">Live</span>
                  </Link>
                  <Link href="/jobs?category=teaching-jobs" className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                    <span>Teaching Jobs</span>
                  </Link>
                  <Link href="/jobs?category=railway-jobs" className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                    <span>Railway Jobs</span>
                  </Link>
                  <Link href="/jobs?category=police-defence-jobs" className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                    <span>Police & Defence Jobs</span>
                  </Link>
                  <Link href="/jobs?category=nursing-jobs" className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                    <span>Nursing Jobs</span>
                  </Link>
                  <Link href="/jobs?category=engineering-jobs" className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                    <span>Engineering Jobs</span>
                  </Link>
                  <Link href="/jobs?category=agriculture-jobs" className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                    <span>Agriculture Jobs</span>
                  </Link>
                  <Link href="/jobs?category=college-entrance-exams" className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                    <span>College Entrance Exams</span>
                  </Link>
                </div>
              </div>

              {/* Updates Section */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Updates & Cards</h3>
                <div className="grid grid-cols-1 gap-1">
                  <Link href="/jobs?type=admit-cards" className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <span>Admit Cards</span>
                  </Link>
                  <Link href="/jobs?type=results" className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                    <Award className="h-4 w-4 text-slate-400" />
                    <span>Results</span>
                  </Link>
                </div>
              </div>

              {/* States Section */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Browse by State</h3>
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {states.slice(0, 14).map((st) => (
                    <Link 
                      key={st.id} 
                      href={`/jobs?state=${st.slug}`}
                      className="px-2.5 py-2 text-center text-xs font-semibold text-slate-600 hover:text-primary bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors block border border-slate-100"
                    >
                      {st.name.replace(/ &.*/, "")}
                    </Link>
                  ))}
                  <Link 
                    href="/jobs?category=state-govt-jobs"
                    className="col-span-2 px-2.5 py-2 text-center text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors block"
                  >
                    View All States
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/50 text-center">
              <p className="text-[10px] font-medium text-slate-400">&copy; 2026 PR Deep Solution Pvt. Ltd.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
