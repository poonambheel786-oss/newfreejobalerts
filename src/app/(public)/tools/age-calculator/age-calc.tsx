'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle2, AlertCircle, RotateCcw, ArrowRight } from 'lucide-react';

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalMonths: number;
  categoryRelaxationYears: number;
  effectiveEligibleAge: number;
}

export default function AgeCalculatorClient() {
  const [dob, setDob] = useState('');
  const [asOnDate, setAsOnDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [category, setCategory] = useState('UR');
  const [targetMinAge, setTargetMinAge] = useState('18');
  const [targetMaxAge, setTargetMaxAge] = useState('30');
  const [result, setResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState('');

  const calculateAge = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!dob) {
      setError('Please enter your Date of Birth.');
      return;
    }
    if (!asOnDate) {
      setError('Please enter the Cut-off Date (As on Date).');
      return;
    }

    const birthDate = new Date(dob);
    const targetDate = new Date(asOnDate);

    if (isNaN(birthDate.getTime()) || isNaN(targetDate.getTime())) {
      setError('Invalid date entered. Please choose valid calendar dates.');
      return;
    }

    if (birthDate > targetDate) {
      setError('Date of Birth cannot be after the Cut-off Date.');
      return;
    }

    let years = targetDate.getFullYear() - birthDate.getFullYear();
    let months = targetDate.getMonth() - birthDate.getMonth();
    let days = targetDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      // Get days in previous month
      const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Category relaxation in years
    let relaxation = 0;
    if (category === 'OBC') relaxation = 3;
    else if (category === 'SC_ST') relaxation = 5;
    else if (category === 'PWBD_UR') relaxation = 10;
    else if (category === 'PWBD_OBC') relaxation = 13;
    else if (category === 'PWBD_SC_ST') relaxation = 15;
    else if (category === 'EX_SERVICEMEN') relaxation = 3;

    const diffTime = Math.abs(targetDate.getTime() - birthDate.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalMonths = years * 12 + months;

    const effectiveEligibleAge = years;

    setResult({
      years,
      months,
      days,
      totalDays,
      totalMonths,
      categoryRelaxationYears: relaxation,
      effectiveEligibleAge
    });
  };

  const handleReset = () => {
    setDob('');
    setAsOnDate(new Date().toISOString().split('T')[0]);
    setCategory('UR');
    setTargetMinAge('18');
    setTargetMaxAge('30');
    setResult(null);
    setError('');
  };

  const minAgeNum = parseInt(targetMinAge, 10) || 18;
  const maxAgeNum = parseInt(targetMaxAge, 10) || 30;
  const adjustedMaxAge = result ? maxAgeNum + result.categoryRelaxationYears : maxAgeNum;
  const isEligible = result ? (result.years >= minAgeNum && (result.years < adjustedMaxAge || (result.years === adjustedMaxAge && result.months === 0 && result.days === 0))) : false;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      <form onSubmit={calculateAge} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Date of Birth (DOB) *
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-primary focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Age Cut-Off Date (As on Date) *
            </label>
            <input
              type="date"
              value={asOnDate}
              onChange={(e) => setAsOnDate(e.target.value)}
              required
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-primary focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Reservation Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-primary focus:outline-none transition-all"
            >
              <option value="UR">General / UR (No relaxation)</option>
              <option value="EWS">EWS (No age relaxation)</option>
              <option value="OBC">OBC (Non-Creamy Layer) (+3 Years)</option>
              <option value="SC_ST">SC / ST (+5 Years)</option>
              <option value="PWBD_UR">PwBD (General) (+10 Years)</option>
              <option value="PWBD_OBC">PwBD (OBC) (+13 Years)</option>
              <option value="PWBD_SC_ST">PwBD (SC/ST) (+15 Years)</option>
              <option value="EX_SERVICEMEN">Ex-Servicemen (+3 Years after service)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Post Min Age (e.g. 18, 20, 21)
            </label>
            <input
              type="number"
              min="14"
              max="65"
              value={targetMinAge}
              onChange={(e) => setTargetMinAge(e.target.value)}
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-primary focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Post Max Age for UR (e.g. 27, 30, 32)
            </label>
            <input
              type="number"
              min="18"
              max="65"
              value={targetMaxAge}
              onChange={(e) => setTargetMaxAge(e.target.value)}
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-primary focus:outline-none transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md shadow-primary/10 transition-all cursor-pointer"
          >
            <Calendar className="h-4 w-4" /> Calculate Age & Eligibility
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-3 rounded-xl transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
      </form>

      {/* Results Display */}
      {result && (
        <div className="mt-8 pt-8 border-t border-slate-100 space-y-6 animate-fade-in">
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Exact Age Calculation Result</p>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl sm:text-5xl font-black text-emerald-400 tracking-tight">
                {result.years} <span className="text-lg sm:text-2xl font-semibold text-white">Years</span>
              </span>
              <span className="text-2xl sm:text-4xl font-bold text-emerald-300">
                {result.months} <span className="text-sm sm:text-xl font-medium text-slate-300">Months</span>
              </span>
              <span className="text-xl sm:text-3xl font-bold text-emerald-200">
                {result.days} <span className="text-xs sm:text-lg font-medium text-slate-400">Days</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Equivalent to <strong>{result.totalMonths} total months</strong> or <strong>{result.totalDays.toLocaleString()} total days</strong> lived as of the cut-off date.
            </p>
          </div>

          {/* Eligibility Card */}
          <div className={`p-6 rounded-2xl border ${isEligible ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' : 'bg-rose-50/80 border-rose-200 text-rose-950'}`}>
            <div className="flex items-start gap-3">
              {isEligible ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h4 className="text-base font-bold">
                  {isEligible ? 'Eligible for this Recruitment Post' : 'Age Limit Criteria Not Met'}
                </h4>
                <p className="text-xs leading-relaxed opacity-90">
                  {isEligible
                    ? `Your calculated age of ${result.years} years is within the prescribed age bracket (${minAgeNum} to ${adjustedMaxAge} years, including ${result.categoryRelaxationYears} years relaxation for ${category.replace(/_/g, ' ')}).`
                    : `The permissible age range for your category is ${minAgeNum} to ${adjustedMaxAge} years (including ${result.categoryRelaxationYears} years relaxation). Your calculated age is ${result.years} years, ${result.months} months.`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Quick Breakdown Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-slate-200 rounded-xl overflow-hidden">
              <tbody>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 font-bold text-slate-600 w-1/2 border-r border-slate-200">Date of Birth</th>
                  <td className="px-4 py-3 font-semibold text-slate-800">{dob}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 font-bold text-slate-600 border-r border-slate-200">Cut-Off Reference Date</th>
                  <td className="px-4 py-3 font-semibold text-slate-800">{asOnDate}</td>
                </tr>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 font-bold text-slate-600 border-r border-slate-200">Category Age Relaxation Applicable</th>
                  <td className="px-4 py-3 font-bold text-primary">+{result.categoryRelaxationYears} Years</td>
                </tr>
                <tr>
                  <th className="px-4 py-3 font-bold text-slate-600 border-r border-slate-200">Maximum Allowed Age for Your Category</th>
                  <td className="px-4 py-3 font-bold text-slate-900">{adjustedMaxAge} Years</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
