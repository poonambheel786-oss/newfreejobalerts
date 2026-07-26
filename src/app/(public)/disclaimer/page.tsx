import React from "react";
import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer | NewFreeJobAlert",
  description: "Read the Disclaimer of NewFreeJobAlert regarding the accuracy of information, source of data, and lack of government affiliation.",
};

export default function DisclaimerPage() {
  return (
    <LegalLayout title="Disclaimer" lastUpdated="July 26, 2026">
      <div className="space-y-6">
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-900 p-5 rounded-2xl text-xs font-semibold space-y-2">
          <p className="font-bold text-sm">⚠️ CRITICAL NOTICE & NON-AFFILIATION DISCLAIMER</p>
          <p>
            <strong>NewFreeJobAlert</strong> is an independent educational information portal. This website is <strong>NOT</strong> affiliated with, associated with, or endorsed by any Government Department, Recruitment Board, University, or Examination Authority. 
          </p>
          <p>
            The owners and authors of this portal do not represent any government agency. The sole purpose of this site is to aggregate publicly available recruitment notices for candidate convenience.
          </p>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mt-6">1. Information Accuracy</h2>
        <p className="leading-relaxed">
          While we strive to provide the most accurate and up-to-date information, the contents of this website are provided for informational and educational purposes only. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, notifications, dates, or links contained on this website. Any reliance you place on such information is strictly at your own risk.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">2. Official Sourcing and Direct Verification</h2>
        <p className="leading-relaxed">
          All job postings, exam syllabuses, results, and answer keys are compiled from official gazettes, department websites, and leading news publications. Although we verify every post before publishing, typing mistakes or administrative schedule updates can occur. 
        </p>
        <p className="leading-relaxed font-bold text-slate-800">
          We strongly advise all candidates to check the official notification PDF and visit the official website of the recruiting department/board before filling out any application forms, paying fees, or making final decisions.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">3. External Links</h2>
        <p className="leading-relaxed">
          Through this website, you can link to other websites that are not under the control of NewFreeJobAlert. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not imply a recommendation or endorsement of the views expressed within them. We are not responsible for any financial loss, inconvenience, or damage caused by the content of external websites.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">4. Financial Transactions</h2>
        <p className="leading-relaxed">
          NewFreeJobAlert never asks for fee payments or bank account details directly on our website. All application fee payments must be made strictly on the official, secure websites of the respective recruitment board or organization. We are not responsible for any fraudulent transactions conducted on unofficial third-party platforms.
        </p>
      </div>
    </LegalLayout>
  );
}
