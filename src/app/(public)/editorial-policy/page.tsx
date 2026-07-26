import React from "react";
import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Editorial Policy | NewFreeJobAlert",
  description: "Learn about the Editorial Policy of NewFreeJobAlert, our content integrity guidelines, sourcing ethics, and updates.",
};

export default function EditorialPolicyPage() {
  return (
    <LegalLayout title="Editorial Policy" lastUpdated="July 26, 2026">
      <div className="space-y-6">
        <p className="leading-relaxed">
          At <strong>NewFreeJobAlert</strong>, owned by <strong>PR Deep Solution Pvt. Ltd.</strong>, we follow a rigorous editorial process to deliver high-quality, authentic, and clear educational information and employment updates.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">1. Sourcing Guidelines</h2>
        <p className="leading-relaxed">
          Our writers and editors source information exclusively from public notices, official gazettes, department websites, and authentic educational bulletins. We do not publish speculative reports or rumors. Every news article, exam announcement, or job update is backed by verifiable primary sources.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">2. Content Review and Verification</h2>
        <p className="leading-relaxed">
          Before any post goes live, it goes through a verification process:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Primary Check:</strong> Our editors cross-reference the salary, eligibility, vacancy count, and application deadlines with the official PDF.</li>
          <li><strong>Link Verification:</strong> We verify that the "Apply Online" and "Syllabus/PDF" links point strictly to the official government servers or validated files.</li>
          <li><strong>Format Standardization:</strong> Information is formatted into clean, structured tables to prevent candidate confusion.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 mt-6">3. Objectivity and Neutrality</h2>
        <p className="leading-relaxed">
          We maintain absolute neutrality. We do not endorse any specific coachings, preparatory materials, or external entities. Our sole focus is presenting the facts of the recruitment drive objectively.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">4. Fact Updates and Corrections</h2>
        <p className="leading-relaxed">
          Government recruitments are highly dynamic, with dates and vacancies frequently being extended or modified. We actively monitor official portals and update our existing posts as soon as new guidelines are released. For more details on how we handle editing errors, please refer to our <a href="/correction-policy" className="text-primary underline">Correction Policy</a>.
        </p>
      </div>
    </LegalLayout>
  );
}
