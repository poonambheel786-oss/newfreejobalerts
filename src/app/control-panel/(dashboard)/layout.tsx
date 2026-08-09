import React from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  BellRing, 
  FileText, 
  CheckCircle, 
  Plus, 
  List, 
  LogOut, 
  ExternalLink,
  BookOpen
} from "lucide-react";
import { logout } from "../actions";

export default function ControlPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 h-16 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/control-panel/dashboard" className="flex items-center gap-2.5 font-extrabold text-lg text-violet-400 tracking-tight">
            <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain brightness-110" />
            <span>New<span className="text-white">FreeJobAlert</span> <span className="bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded text-[10px] font-bold align-middle ml-1 animate-pulse">ADMIN</span></span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            target="_blank" 
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Live Website
          </Link>
          <form action={logout}>
            <button 
              type="submit" 
              className="flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-600 transition-all border border-rose-900/30 hover:border-rose-600 px-3.5 py-2 rounded-xl cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </form>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col justify-between shrink-0 p-4 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Main Menu</p>
              <Link 
                href="/control-panel/dashboard" 
                className="flex items-center gap-2.5 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2.5 rounded-xl text-xs font-bold transition-all"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </div>

            {/* Notifications Menu Section */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
                <BellRing className="h-3.5 w-3.5 text-blue-400" />
                Notifications
              </p>
              <div className="space-y-0.5 pl-2 border-l border-slate-800 ml-3">
                <Link 
                  href="/control-panel/dashboard/jobs?type=Latest Notifications" 
                  className="flex items-center gap-2 text-slate-400 hover:text-violet-400 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                >
                  <List className="h-3.5 w-3.5" />
                  View Notifications
                </Link>
                <Link 
                  href="/control-panel/jobs/new?type=Latest Notifications" 
                  className="flex items-center gap-2 text-slate-400 hover:text-violet-400 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Notification
                </Link>
              </div>
            </div>

            {/* Results Menu Section */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                Results
              </p>
              <div className="space-y-0.5 pl-2 border-l border-slate-800 ml-3">
                <Link 
                  href="/control-panel/dashboard/jobs?type=Results" 
                  className="flex items-center gap-2 text-slate-400 hover:text-violet-400 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                >
                  <List className="h-3.5 w-3.5" />
                  View Results
                </Link>
                <Link 
                  href="/control-panel/jobs/new?type=Results" 
                  className="flex items-center gap-2 text-slate-400 hover:text-violet-400 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Result
                </Link>
              </div>
            </div>

            {/* Admit Cards Menu Section */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-amber-400" />
                Admit Cards
              </p>
              <div className="space-y-0.5 pl-2 border-l border-slate-800 ml-3">
                <Link 
                  href="/control-panel/dashboard/jobs?type=Admit Cards" 
                  className="flex items-center gap-2 text-slate-400 hover:text-violet-400 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                >
                  <List className="h-3.5 w-3.5" />
                  View Admit Cards
                </Link>
                <Link 
                  href="/control-panel/jobs/new?type=Admit Cards" 
                  className="flex items-center gap-2 text-slate-400 hover:text-violet-400 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Admit Card
                </Link>
              </div>
            </div>

            {/* Blog Menu Section */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-violet-400" />
                Career Blog
              </p>
              <div className="space-y-0.5 pl-2 border-l border-slate-800 ml-3">
                <Link 
                  href="/control-panel/dashboard/blog" 
                  className="flex items-center gap-2 text-slate-400 hover:text-violet-400 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                >
                  <List className="h-3.5 w-3.5" />
                  View Articles
                </Link>
                <Link 
                  href="/control-panel/blog/new" 
                  className="flex items-center gap-2 text-slate-400 hover:text-violet-400 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Article
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4">
            <form action={logout}>
              <button 
                type="submit" 
                className="w-full flex items-center gap-2.5 text-rose-400 hover:bg-rose-950/20 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Logout Session
              </button>
            </form>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 sm:p-8 md:p-10 overflow-x-hidden bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}
