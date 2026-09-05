import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, BookOpen, HelpCircle, ArrowLeft, TrendingUp } from 'lucide-react';
import SalaryCalculatorClient from './salary-calc';

export const metadata: Metadata = {
  title: '7th Pay Commission Salary Calculator | In-Hand Monthly Take-Home Pay | NewFreeJobAlert',
  description: 'Calculate your exact in-hand salary for Central Government & State Govt jobs under 7th CPC. Complete calculation of Basic Pay, DA (50%+), HRA (X/Y/Z Cities), TA, and NPS deductions.',
  openGraph: {
    title: '7th Pay Commission Salary Calculator | NewFreeJobAlert',
    description: 'Calculate your exact in-hand salary for Central Government & State Govt jobs under 7th CPC.',
  }
};

export default function SalaryCalculatorPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the formula to calculate 7th Pay Commission In-Hand Salary?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'In-Hand Monthly Salary = Gross Salary - Deductions. Gross Salary = Basic Pay + Dearness Allowance (DA) + House Rent Allowance (HRA) + Transport Allowance (TA + DA on TA). Deductions include NPS (10% of Basic + DA), CGHS, CGEGIS, and Professional Tax.'
        }
      },
      {
        '@type': 'Question',
        name: 'What are the HRA rates for X, Y, and Z class cities?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Following the implementation of 50% Dearness Allowance, HRA rates are revised to: Tier X Cities (Metro cities like Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Ahmedabad, Pune) = 30% of Basic Pay; Tier Y Cities (Population > 5 Lakhs like Jaipur, Lucknow, Patna, Bhopal) = 20% of Basic Pay; Tier Z Cities (All other rural areas and small towns) = 10% of Basic Pay.'
        }
      },
      {
        '@type': 'Question',
        name: 'How much is deducted for NPS (National Pension System) every month?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Employees contribute 10% of their (Basic Pay + Dearness Allowance) towards the National Pension System (NPS), while the Central Government contributes a matching 14% into the employee Tier-I pension account.'
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
            <span className="text-slate-800 font-bold">7th CPC Salary Calculator</span>
          </nav>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors shrink-0 bg-slate-100 hover:bg-slate-200/70 px-4 py-2 rounded-xl border border-slate-200/40"
          >
            <ArrowLeft className="h-4 w-4" /> All Tools
          </Link>
        </div>

        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60">
            <TrendingUp className="h-3.5 w-3.5" /> 7th Central Pay Commission Matrix
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            7th Pay Commission Salary & In-Hand Pay Calculator
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Estimate your exact monthly gross salary, take-home in-hand pay, allowance structures, and pension deductions across central and state government posts.
          </p>
        </div>

        {/* Interactive Calculator Engine */}
        <SalaryCalculatorClient />

        {/* In-depth Educational Guide */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 text-slate-800 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> Understanding 7th Central Pay Commission (CPC) Pay Structures
          </h2>

          <p>
            Under the 7th Central Pay Commission, the previous system of Pay Bands and Grade Pays was consolidated into an indexed <strong>Pay Matrix</strong> consisting of Levels 1 through 18. Each recruitment post in central ministries, defense civilian establishments, autonomous bodies, and state departments is assigned a specific entry Pay Level.
          </p>

          <h3 className="text-base font-bold text-slate-900 pt-2">7th CPC Pay Matrix Hierarchy & Common Post Designations</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-slate-200 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-slate-800 text-white font-bold uppercase tracking-wider text-[11px]">
                  <th className="px-4 py-3 border border-slate-200">Pay Level</th>
                  <th className="px-4 py-3 border border-slate-200">Pre-Revised GP</th>
                  <th className="px-4 py-3 border border-slate-200">Starting Basic Pay</th>
                  <th className="px-4 py-3 border border-slate-200">Typical Exam / Post Example</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="px-4 py-3 font-bold text-slate-900 border border-slate-200">Level 1</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">1800 GP</td>
                  <td className="px-4 py-3 font-semibold text-emerald-700 border border-slate-200">₹18,000</td>
                  <td className="px-4 py-3 text-slate-700 border border-slate-200">SSC MTS, Railway Group D, Peon, Helper</td>
                </tr>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <td className="px-4 py-3 font-bold text-slate-900 border border-slate-200">Level 2</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">1900 GP</td>
                  <td className="px-4 py-3 font-semibold text-emerald-700 border border-slate-200">₹19,900</td>
                  <td className="px-4 py-3 text-slate-700 border border-slate-200">SSC CHSL (LDC / JSA), Police Constable</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="px-4 py-3 font-bold text-slate-900 border border-slate-200">Level 4</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">2400 GP</td>
                  <td className="px-4 py-3 font-semibold text-emerald-700 border border-slate-200">₹25,500</td>
                  <td className="px-4 py-3 text-slate-700 border border-slate-200">Postal Assistant, Tax Assistant, Railway ALP</td>
                </tr>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <td className="px-4 py-3 font-bold text-slate-900 border border-slate-200">Level 6</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">4200 GP</td>
                  <td className="px-4 py-3 font-semibold text-emerald-700 border border-slate-200">₹35,400</td>
                  <td className="px-4 py-3 text-slate-700 border border-slate-200">SSC JE, Sub-Inspector (Delhi Police / CAPF), Primary Teacher (PRT)</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="px-4 py-3 font-bold text-slate-900 border border-slate-200">Level 7</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">4600 GP</td>
                  <td className="px-4 py-3 font-semibold text-emerald-700 border border-slate-200">₹44,900</td>
                  <td className="px-4 py-3 text-slate-700 border border-slate-200">ASO in Central Secretariat / MEA, Income Tax Inspector, AIIMS Nursing Officer</td>
                </tr>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <td className="px-4 py-3 font-bold text-slate-900 border border-slate-200">Level 10</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">5400 GP (Class 1)</td>
                  <td className="px-4 py-3 font-semibold text-emerald-700 border border-slate-200">₹56,100</td>
                  <td className="px-4 py-3 text-slate-700 border border-slate-200">UPSC Civil Services (IAS, IPS, IFS), Assistant Commissioner, Assistant Professor</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-bold text-slate-900 pt-3">Key Allowance Components Explained</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <p className="font-bold text-slate-800">Dearness Allowance (DA)</p>
              <p className="leading-relaxed">Revised biannually (in January and July) based on the All India Consumer Price Index (AICPI-IW) to cushion against inflation.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <p className="font-bold text-slate-800">House Rent Allowance (HRA)</p>
              <p className="leading-relaxed">Categorized into Tier X (30%), Tier Y (20%), and Tier Z (10%) based on the population and cost of living in the posted city.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <p className="font-bold text-slate-800">Transport Allowance (TA)</p>
              <p className="leading-relaxed">Covers commuting costs. DA is also applicable on TA, multiplying the total commute reimbursement.</p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-indigo-500" /> Frequently Asked Questions (7th CPC Salary)
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
