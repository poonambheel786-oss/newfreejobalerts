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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/control-panel/dashboard" className="flex items-center gap-2.5 font-extrabold text-lg text-blue-600 tracking-tight">
            <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
            <span className="text-slate-900">New<span className="text-blue-600">FreeJobAlert</span> <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md text-[10px] font-bold align-middle ml-1">ADMIN</span></span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            href="/" 
            target="_blank" 
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors bg-slate-100 hover:bg-slate-200/80 px-3.5 py-2 rounded-xl border border-slate-200/60"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Live Website
          </Link>
          <form action={logout}>
            <button 
              type="submit" 
              className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 transition-all border border-rose-200 hover:border-rose-600 bg-rose-50 px-3.5 py-2 rounded-xl cursor-pointer"
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
        <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between shrink-0 p-4 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto shadow-xs">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Main Menu</p>
              <Link 
                href="/control-panel/dashboard" 
                className="flex items-center gap-2.5 text-slate-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2.5 rounded-xl text-xs font-bold transition-all"
              >
                <LayoutDashboard className="h-4 w-4 text-blue-600" />
                Dashboard
              </Link>
            </div>

            {/* Notifications Menu Section */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
                <BellRing className="h-3.5 w-3.5 text-blue-600" />
                Notifications
              </p>
              <div className="space-y-0.5 pl-2 border-l border-slate-200 ml-3">
                <Link 
                  href="/control-panel/dashboard/jobs?type=Latest Notifications" 
                  className="flex items-center gap-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                >
                  <List className="h-3.5 w-3.5" />
                  View Notifications
                </Link>
                <Link 
                  href="/control-panel/jobs/new?type=Latest Notifications" 
                  className="flex items-center gap-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                >
                  <Plus className="h-3.5 w-3.5 text-blue-600" />
                  Add Notification
                </Link>
              </div>
            </div>

            {/* Results Menu Section */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                Results
              </p>
              <div className="space-y-0.5 pl-2 border-l border-slate-200 ml-3">
                <Link 
                  href="/control-panel/dashboard/jobs?type=Results" 
                  className="flex items-center gap-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                >
                  <List className="h-3.5 w-3.5" />
                  View Results
                </Link>
                <Link 
                  href="/control-panel/jobs/new?type=Results" 
                  className="flex items-center gap-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                >
                  <Plus className="h-3.5 w-3.5 text-emerald-600" />
                  Add Result
                </Link>
              </div>
            </div>

            {/* Admit Cards Menu Section */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-amber-600" />
                Admit Cards
              </p>
              <div className="space-y-0.5 pl-2 border-l border-slate-200 ml-3">
                <Link 
                  href="/control-panel/dashboard/jobs?type=Admit Cards" 
                  className="flex items-center gap-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                >
                  <List className="h-3.5 w-3.5" />
                  View Admit Cards
                </Link>
                <Link 
                  href="/control-panel/jobs/new?type=Admit Cards" 
                  className="flex items-center gap-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                >
                  <Plus className="h-3.5 w-3.5 text-amber-600" />
                  Add Admit Card
                </Link>
              </div>
            </div>

            {/* Blog Menu Section */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                Career Blog
              </p>
              <div className="space-y-0.5 pl-2 border-l border-slate-200 ml-3">
                <Link 
                  href="/control-panel/dashboard/blog" 
                  className="flex items-center gap-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                >
                  <List className="h-3.5 w-3.5" />
                  View Articles
                </Link>
                <Link 
                  href="/control-panel/blog/new" 
                  className="flex items-center gap-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                >
                  <Plus className="h-3.5 w-3.5 text-blue-600" />
                  Add Article
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <form action={logout}>
              <button 
                type="submit" 
                className="w-full flex items-center gap-2.5 text-rose-600 hover:bg-rose-50 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Logout Session
              </button>
            </form>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 sm:p-8 md:p-10 overflow-x-hidden bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
