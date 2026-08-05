import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import Header from "@/components/Header";

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
      {/* Interactive Navigation Header */}
      <Header states={states} />

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
            <Link href="/blog" className="hover:text-primary transition-colors text-primary font-bold">Career Blog</Link>
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
