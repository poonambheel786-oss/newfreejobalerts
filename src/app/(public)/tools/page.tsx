import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, Calendar, ArrowRight, ShieldCheck, Sparkles, BookOpen, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Government Job Tools & Utilities | Age & Salary Calculators | NewFreeJobAlert",
  description: "Free student tools for government exam aspirants in India. Calculate exact age with category reservation rules, estimate 7th Pay Commission in-hand salaries, and check exam eligibility.",
  openGraph: {
    title: "Government Job Tools & Utilities | NewFreeJobAlert",
    description: "Free student calculators for government exam aspirants. Exact age with category relaxation and 7th CPC salary calculator.",
  }
};

export default function ToolsHubPage() {
  const tools = [
    {
      id: "age-calculator",
      title: "Govt Job Age & Eligibility Calculator",
      description: "Calculate your exact age (years, months, days) as of any recruitment cut-off date. Includes category-wise age relaxation rules for General, EWS, OBC, SC, ST, PwBD, and Ex-Servicemen.",
      href: "/tools/age-calculator",
      badge: "Most Popular",
      icon: Calendar,
      color: "bg-blue-50 text-blue-600 border-blue-200"
    },
    {
      id: "salary-calculator",
      title: "7th Pay Commission In-Hand Salary Calculator",
      description: "Estimate gross and net take-home monthly salaries across Pay Levels 1 to 14. Calculates Dearness Allowance (DA 50%+), HRA for Tier X/Y/Z cities, Transport Allowance, and NPS/PF deductions.",
      href: "/tools/salary-calculator",
      badge: "Updated 2026",
      icon: Calculator,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200"
    }
  ];

  return (
    <div className="mx-auto max-w-[1280px] w-full px-6 py-10 space-y-10 flex-grow">
      {/* Breadcrumb & Header */}
      <div className="space-y-3">
        <nav className="text-xs font-semibold text-slate-500 flex gap-2 items-center">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-800 font-bold">Candidate Tools & Calculators</span>
        </nav>
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" /> High-Utility Aspirant Resources
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Government Job Calculators & Tools
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Free, accurate, and instant calculation utilities designed specifically for competitive exam aspirants across UPSC, SSC, Banking, Railways, Defence, and State PSCs.
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl border ${tool.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {tool.badge}
                  </span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    <Link href={tool.href} className="hover:text-primary transition-colors">
                      {tool.title}
                    </Link>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  href={tool.href}
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-primary hover:bg-primary/95 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md shadow-primary/10 transition-all"
                >
                  <span>Launch Tool</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Educational Value Add Section */}
      <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" /> Why Use Our Aspirant Utilities?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-600">
          <div className="space-y-1.5">
            <p className="font-bold text-slate-800 text-sm">100% Policy-Accurate</p>
            <p className="leading-relaxed">All formulas and relaxation rules align strictly with DoPT (Department of Personnel and Training) guidelines and official 7th CPC gazette notifications.</p>
          </div>
          <div className="space-y-1.5">
            <p className="font-bold text-slate-800 text-sm">Privacy Guaranteed</p>
            <p className="leading-relaxed">All calculations run locally in your browser. We never collect, transmit, or store your personal dates of birth or financial inputs.</p>
          </div>
          <div className="space-y-1.5">
            <p className="font-bold text-slate-800 text-sm">Free Forever</p>
            <p className="leading-relaxed">Our tools are built by education analysts to help candidates navigate complex recruitment rules without paying subscription fees.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
