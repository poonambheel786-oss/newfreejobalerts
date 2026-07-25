'use client'

import React, { useActionState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { createJob } from "../../actions";

interface Props {
  states: string[];
  categories: string[];
}

export default function JobForm({ states, categories }: Props) {
  const [state, formAction, isPending] = useActionState(createJob, null);

  useEffect(() => {
    if (state?.success) {
      alert("Job notification created successfully!");
      window.location.href = "/control-panel/dashboard";
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">Create Job Notification</h1>
          <p className="text-xs text-slate-500 mt-1">Fill out the detailed specifications for the public job post.</p>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md shadow-primary/10 flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
        >
          <Save className="h-4 w-4" />
          {isPending ? "Saving..." : "Publish Notification"}
        </button>
      </div>

      {/* Error Banner */}
      {state?.error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center gap-2 text-xs font-semibold">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          {state.error}
        </div>
      )}

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Core Info */}
        <div className="md:col-span-8 space-y-6">
          {/* Basic Details */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Basic Info</h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Job Title / Heading *</label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  placeholder="e.g. SSC CGL Recruitment 2026 Online Form" 
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Department / Organization *</label>
                  <input 
                    type="text" 
                    name="department" 
                    required 
                    placeholder="e.g. Staff Selection Commission" 
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Advertisement Number</label>
                  <input 
                    type="text" 
                    name="advtNumber" 
                    placeholder="e.g. SSC/CGL/2026/04" 
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Total Vacancies *</label>
                  <input 
                    type="number" 
                    name="vacancy" 
                    required 
                    placeholder="e.g. 17727" 
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Minimum Qualification *</label>
                  <input 
                    type="text" 
                    name="qualification" 
                    required 
                    placeholder="e.g. Graduate" 
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Status *</label>
                  <select 
                    name="status" 
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Category *</label>
                  <select 
                    name="category" 
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">State *</label>
                  <select 
                    name="state" 
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                  >
                    {states.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Eligibility */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Job Specifications</h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Detailed Eligibility Criteria</label>
                <textarea 
                  name="eligibility" 
                  rows={3} 
                  placeholder="Candidate must possess Bachelor Degree in any discipline..." 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all resize-y"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Age Limit</label>
                  <input 
                    type="text" 
                    name="ageLimit" 
                    placeholder="18 to 30 years" 
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Salary / Pay Scale</label>
                  <input 
                    type="text" 
                    name="salary" 
                    placeholder="Pay level 4 (25500 - 81100)" 
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Selection Process</label>
                <textarea 
                  name="selectionProcess" 
                  rows={2} 
                  placeholder="Tier-I CBT, Tier-II CBT, and interview..." 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Application Fees</label>
                <input 
                  type="text" 
                  name="applicationFees" 
                  placeholder="GEN/OBC: 100, SC/ST: Exempted" 
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Timelines and Links */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Important Dates</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Start Date</label>
                <input 
                  type="date" 
                  name="startDate" 
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">End Date</label>
                <input 
                  type="date" 
                  name="endDate" 
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Exam Date Info</label>
                <input 
                  type="text" 
                  name="examDate" 
                  placeholder="September - October 2026"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wide border-b border-slate-100 pb-2">Attachments & Links</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Notification PDF URL</label>
                <input 
                  type="text" 
                  name="pdfUrl" 
                  placeholder="S3 PDF Link" 
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Apply Link</label>
                <input 
                  type="text" 
                  name="applyLink" 
                  placeholder="Official Apply Page URL" 
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Official Website</label>
                <input 
                  type="text" 
                  name="officialWebsite" 
                  placeholder="https://ssc.gov.in" 
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
