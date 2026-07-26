import React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { prisma } from "@/lib/db";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch all states for Mega Menu
  let states: any[] = [];
  try {
    states = await prisma.state.findMany({
      orderBy: { name: "asc" }
    });
  } catch (e) {
    console.error("Failed to load states for mega menu:", e);
  }

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 glass-header bg-surface/80 border-b border-outline-variant/20">
        <div className="flex items-center justify-between px-6 w-full max-w-[1280px] mx-auto h-16 gap-4">
          <div className="flex items-center gap-4 shrink-0">
            <button className="lg:hidden p-2 rounded-full hover:bg-primary-container/10 transition-colors">
              <Menu className="h-5 w-5" />
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

          {/* Mobile Categories Navigation (Scrollable Slider) */}
          <div className="flex lg:hidden flex-1 items-center gap-4 overflow-x-auto whitespace-nowrap no-scrollbar py-2 max-w-full min-w-0 ml-4">
            <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors shrink-0" href="/">Home</Link>
            <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors shrink-0" href="/jobs?category=all-india-govt-jobs">All India Govt Jobs</Link>
            <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors shrink-0" href="/jobs?category=state-govt-jobs">State Govt Jobs</Link>
            <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors shrink-0" href="/jobs?category=bank-jobs">Bank Jobs</Link>
            <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors shrink-0" href="/jobs?category=teaching-jobs">Teaching Jobs</Link>
            <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors shrink-0" href="/jobs?category=railway-jobs">Railway Jobs</Link>
            <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors shrink-0" href="/jobs?category=nursing-jobs">Nursing Jobs</Link>
            <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors shrink-0" href="/jobs?category=engineering-jobs">Engineering Jobs</Link>
            <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors shrink-0" href="/jobs?category=police-defence-jobs">Police/Defence Jobs</Link>
            <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors shrink-0" href="/jobs?category=agriculture-jobs">Agriculture Jobs</Link>
            <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors shrink-0" href="/jobs?category=college-entrance-exams">College Entrance Exams</Link>
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
