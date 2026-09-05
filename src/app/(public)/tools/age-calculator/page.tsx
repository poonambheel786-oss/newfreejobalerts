import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, HelpCircle, BookOpen, Calendar, ArrowLeft } from 'lucide-react';
import AgeCalculatorClient from './age-calc';

export const metadata: Metadata = {
  title: 'Government Job Age Calculator | Exact Age with Category Relaxation | NewFreeJobAlert',
  description: 'Calculate your exact age as of any government exam cut-off date. Includes official age relaxation rules for OBC (3 yrs), SC/ST (5 yrs), PwBD (10-15 yrs), and Ex-Servicemen for UPSC, SSC, Banking, and State PSCs.',
  openGraph: {
    title: 'Government Job Age Calculator | NewFreeJobAlert',
    description: 'Calculate your exact age as of any government exam cut-off date with official category relaxation rules.',
  }
};

export default function AgeCalculatorPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How is age calculated for government jobs in India?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'In Indian government exams (UPSC, SSC, IBPS, Railways, State PSCs), age is calculated in complete completed years, months, and days relative to a specific cut-off date mentioned in the official notification (often 1st January, 1st July, or 1st August of the exam year).'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the standard age relaxation for OBC candidates?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Candidates belonging to the Non-Creamy Layer (NCL) OBC category are eligible for 3 years of upper age relaxation in central and state government jobs.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the upper age relaxation for SC and ST candidates?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Scheduled Caste (SC) and Scheduled Tribe (ST) candidates receive 5 years of upper age relaxation across almost all central and state government recruitment exams.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do EWS candidates get age relaxation in government jobs?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Under central government rules, Economically Weaker Section (EWS) candidates receive 10% vacancy reservation but do not receive upper age relaxation, retaining the same age limit as the General/Unreserved category, unless specifically provided by certain state governments.'
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-[1280px] w-full px-6 py-10 space-y-10 flex-grow">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <nav className="text-xs font-semibold text-slate-500 flex gap-2 items-center">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-primary transition-colors">Tools</Link>
            <span>/</span>
            <span className="text-slate-800 font-bold">Age Calculator</span>
          </nav>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors shrink-0 bg-slate-100 hover:bg-slate-200/70 px-4 py-2 rounded-xl border border-slate-200/40"
          >
            <ArrowLeft className="h-4 w-4" /> All Tools
          </Link>
        </div>

        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/60">
            <Calendar className="h-3.5 w-3.5" /> Official Recruitment Utility
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Government Job Age & Eligibility Calculator
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Determine your precise age in years, months, and days on the target recruitment cut-off date with category-wise age relaxation rules as per DoPT guidelines.
          </p>
        </div>

        {/* Interactive Calculator Engine */}
        <AgeCalculatorClient />

        {/* Detailed Editorial & Policy Guide */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 text-slate-800 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> How Age Calculation Works for Government Exams
          </h2>

          <p>
            When applying for central (UPSC, SSC, RRB, IBPS) or state government jobs in India, eligibility is determined by your age on a strictly defined <strong>Cut-Off Date</strong> (also termed <em>Crucial Date for Determining Age Limit</em>). Even a difference of a single day past the cut-off date will disqualify a candidate from document verification.
          </p>

          <h3 className="text-base font-bold text-slate-900 pt-2">Official Category-Wise Age Relaxation Table (DoPT Norms)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-slate-200 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-slate-800 text-white font-bold uppercase tracking-wider text-[11px]">
                  <th className="px-4 py-3 border border-slate-200">Category / Reservation Class</th>
                  <th className="px-4 py-3 border border-slate-200">Upper Age Relaxation</th>
                  <th className="px-4 py-3 border border-slate-200">Mandatory Certificate Required</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="px-4 py-3 font-semibold text-slate-800 border border-slate-200">General (UR) / EWS</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">No relaxation (Standard post limit)</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">EWS Income & Asset Certificate (for EWS)</td>
                </tr>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <td className="px-4 py-3 font-semibold text-slate-800 border border-slate-200">Other Backward Classes (OBC - Non Creamy Layer)</td>
                  <td className="px-4 py-3 font-bold text-primary border border-slate-200">+3 Years</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">Valid Central OBC-NCL Certificate</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="px-4 py-3 font-semibold text-slate-800 border border-slate-200">Scheduled Castes (SC) / Scheduled Tribes (ST)</td>
                  <td className="px-4 py-3 font-bold text-primary border border-slate-200">+5 Years</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">Permanent Caste Certificate</td>
                </tr>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <td className="px-4 py-3 font-semibold text-slate-800 border border-slate-200">PwBD (Persons with Benchmark Disabilities) - General</td>
                  <td className="px-4 py-3 font-bold text-primary border border-slate-200">+10 Years</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">Disability Certificate (Min 40% disability)</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="px-4 py-3 font-semibold text-slate-800 border border-slate-200">PwBD + OBC (NCL)</td>
                  <td className="px-4 py-3 font-bold text-primary border border-slate-200">+13 Years (10 + 3)</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">Disability Certificate + OBC-NCL</td>
                </tr>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <td className="px-4 py-3 font-semibold text-slate-800 border border-slate-200">PwBD + SC / ST</td>
                  <td className="px-4 py-3 font-bold text-primary border border-slate-200">+15 Years (10 + 5)</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">Disability Certificate + SC/ST</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-800 border border-slate-200">Ex-Servicemen (ESM)</td>
                  <td className="px-4 py-3 font-bold text-primary border border-slate-200">+3 Years (after deducting military service)</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">Discharge Book / Service Certificate</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-bold text-slate-900 pt-3">Key Rules for Age Verification</h3>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
            <li><strong>Matriculation Certificate as Proof of Age:</strong> In virtually all government recruitments, only the date of birth recorded in your 10th Standard / Matriculation / Secondary School Certificate is accepted as valid proof. Affidavits, horoscope charts, or birth certificates with conflicting dates are rejected.</li>
            <li><strong>Crucial Cut-Off Date:</strong> Always check the notification text for the exact cut-off date (e.g., <em>“Candidates must be between 18 and 30 years of age as on 01-08-2026”</em>).</li>
            <li><strong>Cumulative Relaxation:</strong> Category relaxations for SC/ST/OBC cannot be added multiple times; however, PwBD candidates receive the 10-year disability relaxation in addition to their community quota (e.g. PwBD + SC = 15 years total).</li>
          </ul>
        </div>

        {/* FAQs */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-indigo-500" /> Frequently Asked Questions (Age Calculator)
          </h2>
          <div className="space-y-3">
            {faqSchema.mainEntity.map((faq, idx) => (
              <details key={idx} className="group border border-slate-100 rounded-xl bg-slate-50/50 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex justify-between items-center p-4 font-bold text-slate-900 text-xs sm:text-sm cursor-pointer select-none hover:bg-slate-100/50 transition-colors">
                  <span className="flex items-start gap-1.5 pr-4">
                    <span className="text-primary font-extrabold">Q.</span>
                    <span>{faq.name}</span>
                  </span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform text-xs">▼</span>
                </summary>
                <div className="px-4 pb-4 pt-1 border-t border-slate-100/50 text-xs sm:text-sm text-slate-600 leading-relaxed pl-8">
                  {faq.acceptedAnswer.text}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
