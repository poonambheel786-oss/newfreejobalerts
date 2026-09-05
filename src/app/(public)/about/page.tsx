import React from "react";
import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import Link from "next/link";
import { ShieldCheck, UserCheck, Award, Mail, Building, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Editorial Team & Mission | NewFreeJobAlert",
  description: "Learn more about NewFreeJobAlert, an independent government recruitment news and educational updates portal owned by PR Deep Solution Pvt. Ltd. Meet our editorial team and review our verification standards.",
};

export default function AboutUsPage() {
  return (
    <LegalLayout title="About Us & Editorial Standards" lastUpdated="August 2026">
      <div className="space-y-8 text-slate-800 text-sm leading-relaxed">
        <p className="text-base leading-relaxed">
          Welcome to <strong>NewFreeJobAlert</strong>, India's premier independent portal for verified public sector employment news, competitive examination updates, syllabus roadmaps, and career calculators. Owned and operated by <strong>PR Deep Solution Pvt. Ltd.</strong>, we are committed to simplifying competitive exam preparations by providing structured, human-curated, and 100% verified notifications.
        </p>

        {/* Core Values / Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <p className="font-bold text-slate-900 flex items-center gap-1.5 text-primary text-sm">
              <ShieldCheck className="h-4 w-4" /> 100% Verified Sourcing
            </p>
            <p className="text-slate-600">Every notification is cross-referenced with primary government gazettes and official department servers.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <p className="font-bold text-slate-900 flex items-center gap-1.5 text-primary text-sm">
              <UserCheck className="h-4 w-4" /> Human Editorial Analysis
            </p>
            <p className="text-slate-600">We do not auto-scrape. Every post features custom preparation roadmaps, salary calculations, and eligibility breakdowns.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <p className="font-bold text-slate-900 flex items-center gap-1.5 text-primary text-sm">
              <Award className="h-4 w-4" /> Free Aspirant Utilities
            </p>
            <p className="text-slate-600">Equipped with interactive tools like our Age Calculator and 7th Pay Commission in-hand pay calculator.</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mt-6">Our Mission & Editorial Philosophy</h2>
        <p className="leading-relaxed">
          The public sector recruitment landscape in India can be daunting, with hundreds of commissions releasing disparate PDFs with complex reservation clauses, age calculation cut-offs, and pay matrix designations. Our mission is to bridge the information divide by:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Translating complex recruitment gazette jargon into clear, structured eligibility tables.</li>
          <li>Providing actionable 30/60-day study roadmaps and syllabus breakdowns.</li>
          <li>Warning candidates against common form-filling mistakes that lead to rejection.</li>
          <li>Directly linking official department portals and original notification PDFs for candidate verification.</li>
        </ul>

        {/* Editorial Board */}
        <h2 className="text-xl font-bold text-slate-900 mt-6">Editorial Board & Content Reviewers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-2">
            <p className="font-bold text-slate-900 text-sm">Prashant Sharma</p>
            <p className="text-primary font-semibold text-[11px]">Senior Examination Analyst & Career Coach</p>
            <p className="text-slate-600 leading-relaxed">
              Specializes in UPSC Civil Services and SSC recruitment patterns with over 8 years of experience mentoring civil service aspirants and analyzing cut-off trends.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-2">
            <p className="font-bold text-slate-900 text-sm">Aditi Rao</p>
            <p className="text-primary font-semibold text-[11px]">Public Sector HR Consultant</p>
            <p className="text-slate-600 leading-relaxed">
              Former banking and PSU recruitment panel advisor. Reviews salary structures, 7th CPC allowance rules, and reservation guidelines.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mt-6">Official Disclaimer & Non-Affiliation</h2>
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-950 p-4 rounded-xl text-xs font-semibold leading-relaxed space-y-2">
          <p>
            ⚠️ <strong>NewFreeJobAlert (newfreejobalert.com)</strong> is a privately operated educational and employment news portal owned by <strong>PR Deep Solution Pvt. Ltd.</strong> We are <strong>NOT</strong> affiliated with, endorsed by, or in any way officially connected to the Government of India, any State Government, Union Public Service Commission (UPSC), Staff Selection Commission (SSC), or any other examination authority.
          </p>
          <p className="font-normal text-slate-700">
            All trademarks, logos, and departmental emblems referenced belong to their respective statutory owners. For complete legal declarations, please visit our <Link href="/disclaimer" className="text-primary underline font-bold">Disclaimer Policy</Link>.
          </p>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mt-6">Publisher & Grievance Redressal</h2>
        <p className="leading-relaxed">
          In compliance with Indian Digital Media ethics and transparency standards:
        </p>
        <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-xl text-xs font-medium space-y-2 text-slate-700">
          <p><strong>Corporate Entity:</strong> PR Deep Solution Pvt. Ltd.</p>
          <p><strong>Grievance / Editorial Officer:</strong> Poonam Bheel</p>
          <p><strong>Support & Corrections Email:</strong> support@newfreejobalert.com</p>
          <p><strong>Registered Address:</strong> 1088 Purani Bheel Basti, Pokhran Marg Ramdeora, Dist Jaisalmer, Rajasthan, India - 345023</p>
          <p><strong>Operating Hours:</strong> Monday – Saturday, 9:30 AM to 6:30 PM IST</p>
        </div>
      </div>
    </LegalLayout>
  );
}
