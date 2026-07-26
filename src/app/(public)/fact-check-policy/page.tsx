import React from "react";
import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Fact-Checking Policy | NewFreeJobAlert",
  description: "Learn about the Fact-Checking Policy at NewFreeJobAlert. We ensure every job vacancy, admit card, and result notification is verified.",
};

export default function FactCheckPolicyPage() {
  return (
    <LegalLayout title="Fact-Checking Policy" lastUpdated="July 26, 2026">
      <div className="space-y-6">
        <p className="leading-relaxed">
          At <strong>NewFreeJobAlert</strong>, operated by <strong>PR Deep Solution Pvt. Ltd.</strong>, we recognize the damage that misleading or fake employment alerts can cause to candidates. We follow a strict fact-checking framework to verify every piece of information before publication.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">1. Verification Hierarchy</h2>
        <p className="leading-relaxed">
          We verify information through a structured hierarchy:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Primary Verification:</strong> Cross-checking details directly from the official website of the conducting body (e.g. UPSC, SSC, state commissions).</li>
          <li><strong>Secondary Verification:</strong> Finding advertisements published in printed government publications like the weekly <em>Employment News (Rojgar Samachar)</em>.</li>
          <li><strong>Verification of Credentials:</strong> If a recruitment circular is circulated on social media but not yet on the official website, we hold the publication until the conducting authority publishes a confirmation or we verify its authenticity directly.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 mt-6">2. Warning Against Fake Recruitment Scams</h2>
        <p className="leading-relaxed">
          Fake recruitment advertisements and duplicate websites designed to scam candidates of application fees are common. As part of our fact-checking protocol, we verify that:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>The application link redirects to a secure government domain (ending in <code>.gov.in</code>, <code>.nic.in</code>, or validated servers).</li>
          <li>We flag and warn candidates about any suspicious or unverified job updates circulating in the media.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 mt-6">3. Reporting Inaccuracies</h2>
        <p className="leading-relaxed">
          If you notice any factual discrepancy in any of our listings, please contact us immediately at <span className="text-primary font-bold">support@newfreejobalert.com</span> with details, and our fact-checking team will review and update the content if necessary.
        </p>
      </div>
    </LegalLayout>
  );
}
