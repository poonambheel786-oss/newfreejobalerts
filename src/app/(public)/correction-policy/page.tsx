import React from "react";
import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Correction Policy | NewFreeJobAlert",
  description: "Read the Correction Policy of NewFreeJobAlert to understand how we identify, correct, and transparently notify readers of errors.",
};

export default function CorrectionPolicyPage() {
  return (
    <LegalLayout title="Correction Policy" lastUpdated="July 26, 2026">
      <div className="space-y-6">
        <p className="leading-relaxed">
          At <strong>NewFreeJobAlert</strong>, owned by <strong>PR Deep Solution Pvt. Ltd.</strong>, we make every effort to publish error-free data. However, due to the high volume of government notifications, typographical mistakes or schedule date changes can occur. We are committed to correcting errors quickly and transparently.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">1. Reporting Errors</h2>
        <p className="leading-relaxed">
          If you identify any typo, wrong application fee, incorrect salary scale, or mismatched exam date in our listings, please let us know. You can send the correction details along with a link to the official notification to <span className="text-primary font-bold">support@newfreejobalert.com</span>.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">2. Evaluation Process</h2>
        <p className="leading-relaxed">
          Once we receive an error report:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Our editorial team immediately downloads the official notification PDF and cross-checks the reported detail.</li>
          <li>If the error is confirmed, we apply the correction within 12 hours of the report.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 mt-6">3. Transparency of Updates</h2>
        <p className="leading-relaxed">
          Major corrections (such as a change in the application deadline or exam dates) are updated directly in the job card and tables, and the page is refreshed so that all users have access to the latest details instantly.
        </p>
      </div>
    </LegalLayout>
  );
}
