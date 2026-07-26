import React from "react";
import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "DMCA Policy | NewFreeJobAlert",
  description: "Read the DMCA Policy of NewFreeJobAlert. Learn how to report copyrighted content or file a takedown notice.",
};

export default function DmcaPolicyPage() {
  return (
    <LegalLayout title="DMCA Policy" lastUpdated="July 26, 2026">
      <div className="space-y-6">
        <p className="leading-relaxed">
          <strong>NewFreeJobAlert</strong>, operated by <strong>PR Deep Solution Pvt. Ltd.</strong>, respects the intellectual property rights of others. In accordance with the Digital Millennium Copyright Act (DMCA), we will respond quickly to claims of copyright infringement committed on our website.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">1. Copyright Infringement Notification</h2>
        <p className="leading-relaxed">
          If you are a copyright owner, or authorized to act on behalf of one, please report alleged copyright infringements taking place on or through the site by completing a written DMCA Notice and sending it to our designated agent.
        </p>
        <p className="leading-relaxed">Your notice must contain the following information:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Identify the copyrighted work that you claim has been infringed.</li>
          <li>Identify the material or link you claim is infringing (include the exact URL).</li>
          <li>Provide your contact information (address, telephone number, and email address).</li>
          <li>Include both of the following statements:
            <ul className="list-circle pl-6 mt-1 space-y-1">
              <li><em>"I hereby state that I have a good faith belief that the disputed use of the copyrighted material is not authorized by the copyright owner, its agent, or the law."</em></li>
              <li><em>"I hereby state that the information in this Notice is accurate and, under penalty of perjury, that I am the owner, or authorized to act on behalf of the owner, of the copyright."</em></li>
            </ul>
          </li>
          <li>Provide your physical or electronic signature.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 mt-6">2. Submission</h2>
        <p className="leading-relaxed">
          Please send the completed DMCA Notice to our copyright team via email at: <span className="text-primary font-bold">support@newfreejobalert.com</span>. We will review and remove the infringing material within 24 to 72 hours of receiving a valid notice.
        </p>
      </div>
    </LegalLayout>
  );
}
