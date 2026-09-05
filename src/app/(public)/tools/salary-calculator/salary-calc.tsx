'use client';

import React, { useState } from 'react';
import { Calculator, RotateCcw, TrendingUp, Building, Percent, ShieldCheck } from 'lucide-react';

interface PayLevelData {
  level: number;
  gradePay: string;
  minBasic: number;
  maxBasic: number;
  typicalPost: string;
}

const payMatrixLevels: PayLevelData[] = [
  { level: 1, gradePay: "1800 GP", minBasic: 18000, maxBasic: 56900, typicalPost: "MTS, Group D, Peon, Helper" },
  { level: 2, gradePay: "1900 GP", minBasic: 19900, maxBasic: 63200, typicalPost: "LDC, Junior Clerk, Constable" },
  { level: 3, gradePay: "2000 GP", minBasic: 21700, maxBasic: 69100, typicalPost: "Head Constable, Forest Guard" },
  { level: 4, gradePay: "2400 GP", minBasic: 25500, maxBasic: 81100, typicalPost: "Tax Assistant, UDC, Postal Assistant, ALP" },
  { level: 5, gradePay: "2800 GP", minBasic: 29200, maxBasic: 92300, typicalPost: "Auditor, Accountant, Sub-Inspector (some states)" },
  { level: 6, gradePay: "4200 GP", minBasic: 35400, maxBasic: 112400, typicalPost: "Junior Engineer (JE), Sub-Inspector (Delhi/CPO), Primary Teacher" },
  { level: 7, gradePay: "4600 GP", minBasic: 44900, maxBasic: 142400, typicalPost: "ASO (CSS/MEA), Income Tax Inspector, GST Inspector, AIIMS Nursing Officer" },
  { level: 8, gradePay: "4800 GP", minBasic: 47600, maxBasic: 151100, typicalPost: "Assistant Audit Officer (AAO), Section Officer (Gazetted)" },
  { level: 9, gradePay: "5400 GP", minBasic: 53100, maxBasic: 167800, typicalPost: "Principal, Accounts Officer (PB-2)" },
  { level: 10, gradePay: "5400 GP (Class 1)", minBasic: 56100, maxBasic: 177500, typicalPost: "UPSC IAS / IPS / IFS (Entry), Assistant Commissioner, Assistant Professor" },
  { level: 11, gradePay: "6600 GP", minBasic: 67700, maxBasic: 208700, typicalPost: "Under Secretary, Executive Engineer, Deputy Collector (Senior)" },
  { level: 12, gradePay: "7600 GP", minBasic: 78800, maxBasic: 209200, typicalPost: "Deputy Secretary, Superintendent of Police" },
  { level: 13, gradePay: "8700 GP", minBasic: 123100, maxBasic: 215900, typicalPost: "Director, DIG of Police, Chief Engineer" },
  { level: 14, gradePay: "10000 GP", minBasic: 144200, maxBasic: 218200, typicalPost: "Joint Secretary to Govt of India" }
];

export default function SalaryCalculatorClient() {
  const [selectedLevel, setSelectedLevel] = useState<number>(7);
  const [basicPay, setBasicPay] = useState<number>(44900);
  const [cityTier, setCityTier] = useState<'X' | 'Y' | 'Z'>('X');
  const [daRate, setDaRate] = useState<number>(50); // Current DA standard rate

  const currentLevelObj = payMatrixLevels.find((l) => l.level === selectedLevel) || payMatrixLevels[6];

  const handleLevelChange = (lvl: number) => {
    setSelectedLevel(lvl);
    const obj = payMatrixLevels.find((l) => l.level === lvl);
    if (obj) {
      setBasicPay(obj.minBasic);
    }
  };

  // HRA Calculation (X: 30%, Y: 20%, Z: 10% after 50% DA trigger)
  let hraPercent = 30;
  if (cityTier === 'Y') hraPercent = 20;
  if (cityTier === 'Z') hraPercent = 10;
  const hraAmount = Math.round((basicPay * hraPercent) / 100);

  // Dearness Allowance (DA)
  const daAmount = Math.round((basicPay * daRate) / 100);

  // Transport Allowance (TA)
  let baseTa = 3600;
  if (selectedLevel >= 9) {
    baseTa = cityTier === 'X' ? 7200 : 3600;
  } else if (selectedLevel >= 3) {
    baseTa = cityTier === 'X' ? 3600 : 1800;
  } else {
    baseTa = cityTier === 'X' ? 1350 : 900;
  }
  const daOnTa = Math.round((baseTa * daRate) / 100);
  const totalTa = baseTa + daOnTa;

  // Gross Monthly Salary
  const grossSalary = basicPay + daAmount + hraAmount + totalTa;

  // Deductions
  // NPS (10% of Basic + DA)
  const npsDeduction = Math.round(((basicPay + daAmount) * 10) / 100);
  // CGHS (Central Govt Health Scheme)
  let cghs = 650;
  if (selectedLevel <= 5) cghs = 250;
  else if (selectedLevel <= 8) cghs = 450;
  else if (selectedLevel <= 11) cghs = 650;
  else cghs = 1000;

  // CGEGIS / Insurance
  const cgegis = 60;
  // Professional Tax (typical state average)
  const profTax = 200;

  const totalDeductions = npsDeduction + cghs + cgegis + profTax;
  const netInHandSalary = grossSalary - totalDeductions;
  const annualGross = grossSalary * 12;
  const annualInHand = netInHandSalary * 12;

  const handleReset = () => {
    handleLevelChange(7);
    setCityTier('X');
    setDaRate(50);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
      {/* Controls Form */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Pay Level Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              7th CPC Pay Level *
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => handleLevelChange(parseInt(e.target.value, 10))}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-primary focus:outline-none transition-all"
            >
              {payMatrixLevels.map((lvl) => (
                <option key={lvl.level} value={lvl.level}>
                  Level {lvl.level} ({lvl.gradePay})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-500 mt-1 truncate">
              {currentLevelObj.typicalPost}
            </p>
          </div>

          {/* Basic Pay Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Basic Pay (₹) *
            </label>
            <input
              type="number"
              min={currentLevelObj.minBasic}
              max={currentLevelObj.maxBasic}
              step={100}
              value={basicPay}
              onChange={(e) => setBasicPay(parseInt(e.target.value, 10) || currentLevelObj.minBasic)}
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-primary focus:outline-none transition-all"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Range: ₹{currentLevelObj.minBasic.toLocaleString()} - ₹{currentLevelObj.maxBasic.toLocaleString()}
            </p>
          </div>

          {/* City Tier Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Posting City Classification (HRA)
            </label>
            <select
              value={cityTier}
              onChange={(e) => setCityTier(e.target.value as any)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-primary focus:outline-none transition-all"
            >
              <option value="X">Tier X (30% HRA - Delhi, Mumbai, Bengaluru, etc.)</option>
              <option value="Y">Tier Y (20% HRA - Jaipur, Lucknow, Patna, Pune, etc.)</option>
              <option value="Z">Tier Z (10% HRA - Rural areas & Small towns)</option>
            </select>
          </div>
        </div>

        {/* DA Rate Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Current Dearness Allowance (DA Rate %)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="42"
                max="65"
                value={daRate}
                onChange={(e) => setDaRate(parseInt(e.target.value, 10))}
                className="w-full accent-primary h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-sm font-black text-primary px-3 py-1 bg-primary/10 rounded-lg shrink-0">
                {daRate}%
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 sm:pt-0">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset Default
            </button>
          </div>
        </div>
      </div>

      {/* Primary Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Net In-Hand Salary */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white rounded-2xl p-6 sm:p-8 space-y-2 shadow-lg shadow-emerald-700/10">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-200">
            Estimated In-Hand Monthly Take-Home
          </p>
          <p className="text-3xl sm:text-5xl font-black tracking-tight">
            ₹{netInHandSalary.toLocaleString('en-IN')}
            <span className="text-sm sm:text-lg font-normal text-emerald-100 ml-1.5">/ month</span>
          </p>
          <p className="text-xs text-emerald-100 pt-1">
            Annual Take-Home: <strong>₹{annualInHand.toLocaleString('en-IN')}</strong> (after standard deductions)
          </p>
        </div>

        {/* Gross Monthly Salary */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-2 shadow-lg shadow-slate-900/10">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Total Monthly Gross Pay (Pre-Deduction)
          </p>
          <p className="text-3xl sm:text-5xl font-black text-amber-400 tracking-tight">
            ₹{grossSalary.toLocaleString('en-IN')}
            <span className="text-sm sm:text-lg font-normal text-slate-300 ml-1.5">/ month</span>
          </p>
          <p className="text-xs text-slate-400 pt-1">
            Annual Gross Cost-to-Govt: <strong>₹{annualGross.toLocaleString('en-IN')}</strong>
          </p>
        </div>
      </div>

      {/* Detailed Salary Breakdown Table */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Complete Itemized Monthly Salary Slip
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Earnings Column */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-bold text-xs text-emerald-700 uppercase tracking-wider">
              (+) Allowances & Earnings
            </div>
            <table className="w-full text-xs text-left border-collapse">
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-3 text-slate-600">Basic Pay</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">₹{basicPay.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-600">Dearness Allowance (DA @ {daRate}%)</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">₹{daAmount.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-600">House Rent Allowance (HRA @ {hraPercent}%)</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">₹{hraAmount.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-600">Transport Allowance (TA + DA on TA)</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">₹{totalTa.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-emerald-50/50 font-bold text-emerald-900">
                  <td className="px-4 py-3">Total Gross Salary</td>
                  <td className="px-4 py-3 text-right">₹{grossSalary.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Deductions Column */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-bold text-xs text-rose-700 uppercase tracking-wider">
              (-) Mandatory Govt Deductions
            </div>
            <table className="w-full text-xs text-left border-collapse">
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-3 text-slate-600">NPS / National Pension (10% of Basic+DA)</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">₹{npsDeduction.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-600">CGHS (Health Scheme Contribution)</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">₹{cghs.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-600">CGEGIS (Insurance Scheme)</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">₹{cgegis.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-600">Professional Tax (Estimated State Tax)</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">₹{profTax.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-rose-50/50 font-bold text-rose-900">
                  <td className="px-4 py-3">Total Monthly Deductions</td>
                  <td className="px-4 py-3 text-right">₹{totalDeductions.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
