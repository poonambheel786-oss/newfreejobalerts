import React from "react";
import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | NewFreeJobAlert",
  description: "Learn more about NewFreeJobAlert, an independent government recruitment news and educational updates portal owned by PR Deep Solution Pvt. Ltd.",
};

export default function AboutUsPage() {
  return (
    <LegalLayout title="About Us" lastUpdated="July 26, 2026">
      <div className="space-y-6">
        <p className="text-base leading-relaxed">
          Welcome to <strong>NewFreeJobAlert</strong>, your premier destination for real-time government recruitment news, educational notices, and career updates. Operated by <strong>PR Deep Solution Pvt. Ltd.</strong>, we are committed to simplifying the job search process by offering accurate, structured, and timely notifications.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">Our Mission</h2>
        <p className="leading-relaxed">
          Our core mission is to empower job seekers, students, and professionals across the country by providing easy access to public employment news. We compile scattered recruitment notices into single, easy-to-read job cards so that no candidate misses an opportunity due to a lack of timely information.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">What We Cover</h2>
        <p className="leading-relaxed">
          We cover a wide spectrum of educational and employment-related updates, including:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Government Job Notifications:</strong> Central, State, and PSU vacancies.</li>
          <li><strong>Admit Cards:</strong> Official download links and exam dates.</li>
          <li><strong>Results & Merit Lists:</strong> Prompt announcements of exam selections.</li>
          <li><strong>Answer Keys & Syllabus:</strong> Official answers and detailed exam pattern layouts.</li>
          <li><strong>Educational News:</strong> Admission notices, scholarships, and academic guidelines.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 mt-6">Our Information Sourcing</h2>
        <p className="leading-relaxed">
          Accuracy is our highest priority. All information posted on NewFreeJobAlert is carefully sourced from:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Official Gazette publications and employment news bulletins.</li>
          <li>Official recruitment portals of central, state departments, and commissions.</li>
          <li>Authentic universities and education board circulars.</li>
        </ul>
        <p className="leading-relaxed">
          We always strive to include links to the official department websites and official notification PDFs in our posts, enabling candidates to verify details directly from the source.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">Important Disclaimer</h2>
        <p className="bg-amber-500/10 border border-amber-500/20 text-amber-900 p-4 rounded-xl text-xs font-semibold">
          ⚠️ <strong>NewFreeJobAlert</strong> is an independent educational information portal. We are <strong>NOT</strong> affiliated with, associated with, or endorsed by any Government Department, Recruitment Board, University, or Examination Authority. For details, please read our full <Link href="/disclaimer" className="text-primary underline">Disclaimer</Link>.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">About the Company</h2>
        <p className="leading-relaxed">
          <strong>NewFreeJobAlert</strong> is proudly owned and operated by:
        </p>
        <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl text-xs font-medium space-y-1">
          <p><strong>Company Name:</strong> PR Deep Solution Pvt. Ltd.</p>
          <p><strong>Contact Email:</strong> support@newfreejobalert.com</p>
          <p><strong>Business Office:</strong> Jaipur, Rajasthan, India</p>
        </div>
      </div>
    </LegalLayout>
  );
}
