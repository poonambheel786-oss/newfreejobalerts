import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";
import Link from "next/link";
import { Briefcase, Bell, Search, Menu, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "GovCareers | Official Government Recruitment Portal",
  description: "Access real-time recruitment notifications, official admit cards, and merit lists from all government departments in one place.",
  keywords: "Govt jobs, Free job alert, Admit card, Exam syllabus, Government scheme, SSC, UPSC, Bank jobs, Railway recruitment",
  authors: [{ name: "GovCareers Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light h-full">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-on-background min-h-screen flex flex-col font-sans antialiased">
        <Providers>
          {/* Top Navigation Bar */}
          <nav className="fixed top-0 w-full z-50 glass-header bg-surface/80 border-b border-outline-variant/20">
            <div className="flex items-center justify-between px-6 w-full max-w-[1280px] mx-auto h-16">
              <div className="flex items-center gap-4">
                <button className="md:hidden p-2 rounded-full hover:bg-primary-container/10 transition-colors">
                  <Menu className="h-5 w-5" />
                </button>
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary tracking-tight">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-md">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <span>Gov<span className="text-on-background">Careers</span></span>
                </Link>
              </div>

              {/* Horizontal Category Navigation */}
              <div className="hidden lg:flex items-center gap-6">
                <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors" href="/jobs?category=teaching">Teaching Exam</Link>
                <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors" href="/jobs?category=all-india">All India Govt Job</Link>
                <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors" href="/jobs?category=bank">Bank Exam</Link>
                <Link className="text-on-surface hover:text-primary font-semibold text-sm transition-colors" href="/jobs?category=railway">Railway Exam</Link>
                <div className="relative group cursor-pointer">
                  <div className="flex items-center gap-1 text-on-surface hover:text-primary font-semibold text-sm transition-colors">
                    More
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link 
                  href="/control-panel/dashboard" 
                  className="hidden sm:flex items-center gap-2 text-xs font-semibold text-primary bg-primary-container/10 hover:bg-primary-container/20 px-3 py-1.5 rounded-full transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Admin Panel
                </Link>
                <button className="p-2 text-outline hover:text-primary rounded-full hover:bg-slate-100 transition-colors">
                  <Search className="h-5 w-5" />
                </button>
                <button className="p-2 text-outline hover:text-primary rounded-full hover:bg-slate-100 transition-colors">
                  <Bell className="h-5 w-5" />
                </button>
              </div>
            </div>
          </nav>

          {/* Main Content Area */}
          <main className="pt-16 min-h-screen flex flex-col flex-grow">
            {children}
          </main>

          {/* Footer */}
          <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 mt-auto">
            <div className="max-w-[1280px] mx-auto px-6 py-4 text-center">
              <p className="text-xs text-on-surface-variant opacity-70">&copy; {new Date().getFullYear()} GovCareers. All rights reserved.</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
