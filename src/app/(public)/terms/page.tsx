import React from "react";
import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Terms and Conditions | NewFreeJobAlert",
  description: "Read the Terms and Conditions of NewFreeJobAlert before using our government recruitment updates and educational services.",
};

export default function TermsConditionsPage() {
  return (
    <LegalLayout title="Terms & Conditions" lastUpdated="July 26, 2026">
      <div className="space-y-6">
        <p className="leading-relaxed">
          Welcome to <strong>NewFreeJobAlert</strong>! These terms and conditions outline the rules and regulations for the use of NewFreeJobAlert's Website, owned by <strong>PR Deep Solution Pvt. Ltd.</strong>.
        </p>

        <p className="leading-relaxed font-semibold text-slate-800">
          By accessing this website, we assume you accept these terms and conditions. Do not continue to use NewFreeJobAlert if you do not agree to take all of the terms and conditions stated on this page.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">1. Intellectual Property Rights</h2>
        <p className="leading-relaxed">
          Unless otherwise stated, PR Deep Solution Pvt. Ltd. and/or its licensors own the intellectual property rights for all material on NewFreeJobAlert. All intellectual property rights are reserved. You may access this from NewFreeJobAlert for your own personal use subjected to restrictions set in these terms and conditions.
        </p>
        <p className="leading-relaxed">You must not:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Republish material from NewFreeJobAlert for commercial use.</li>
          <li>Sell, rent, or sub-license material from NewFreeJobAlert.</li>
          <li>Reproduce, duplicate, or copy material from NewFreeJobAlert.</li>
          <li>Redistribute content from NewFreeJobAlert (unless content is specifically made for redistribution).</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 mt-6">2. Content Accuracy & Information Source</h2>
        <p className="leading-relaxed">
          Our website displays information relating to examination notices, admit cards, answer keys, results, and syllabus. We gather this data from government websites, official notifications, and education circulars. While we make every effort to verify the accuracy of the information, we cannot guarantee its complete correctness. Candidates must verify the official websites before taking any action.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">3. User Conduct</h2>
        <p className="leading-relaxed">
          You agree to use this website only for lawful purposes. You are prohibited from violating or attempting to violate the security of the website, using automated scripts, or copying the site's layout or structure.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">4. Hyperlinking to our Content</h2>
        <p className="leading-relaxed">
          Organizations may link to our home page or notifications without prior written approval, provided the link is not deceptive and does not falsely imply sponsorship or endorsement.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">5. Limitation of Liability</h2>
        <p className="leading-relaxed">
          In no event shall PR Deep Solution Pvt. Ltd., nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this website. We shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this website.
        </p>
      </div>
    </LegalLayout>
  );
}
