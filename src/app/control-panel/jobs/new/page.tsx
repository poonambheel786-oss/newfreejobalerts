'use client'

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";

export default function CreateJobPage() {
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    advtNumber: "",
    vacancy: "",
    qualification: "",
    eligibility: "",
    ageLimit: "",
    salary: "",
    selectionProcess: "",
    applicationFees: "",
    startDate: "",
    endDate: "",
    examDate: "",
    examPattern: "",
    syllabus: "",
    pdfUrl: "",
    officialWebsite: "",
    applyLink: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <div className="bg-slate-900 text-white py-4 mb-8">
        <div className="mx-auto max-w-5xl px-4 flex items-center justify-between">
          <Link href="/control-panel/dashboard" className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Control Panel
          </Link>
          <span className="text-xs font-bold text-slate-400">GovCareers Job Composer</span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-950 tracking-tight">Create Job Notification</h1>
              <p className="text-xs text-slate-500 mt-1">Fill out the detailed specifications for the public job post.</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md shadow-primary/10 flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Publish Notification"}
            </button>
          </div>

          {/* Success Banner */}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-2 text-xs font-semibold">
              <CheckIcon className="h-4 w-4 text-emerald-600 shrink-0" />
              Job notification created successfully! Dynamic routes generated and sitemap updated.
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
                      value={formData.title} 
                      onChange={handleChange}
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
                        value={formData.department} 
                        onChange={handleChange}
                        placeholder="e.g. Staff Selection Commission" 
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Advertisement Number</label>
                      <input 
                        type="text" 
                        name="advtNumber" 
                        value={formData.advtNumber} 
                        onChange={handleChange}
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
                        value={formData.vacancy} 
                        onChange={handleChange}
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
                        value={formData.qualification} 
                        onChange={handleChange}
                        placeholder="e.g. Graduate" 
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                      />
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
                      value={formData.eligibility} 
                      onChange={handleChange}
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
                        value={formData.ageLimit} 
                        onChange={handleChange}
                        placeholder="18 to 30 years" 
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Salary / Pay Scale</label>
                      <input 
                        type="text" 
                        name="salary" 
                        value={formData.salary} 
                        onChange={handleChange}
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
                      value={formData.selectionProcess} 
                      onChange={handleChange}
                      placeholder="Tier-I CBT, Tier-II CBT, and interview..." 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Application Fees</label>
                    <input 
                      type="text" 
                      name="applicationFees" 
                      value={formData.applicationFees} 
                      onChange={handleChange}
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
                      value={formData.startDate} 
                      onChange={handleChange}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">End Date</label>
                    <input 
                      type="date" 
                      name="endDate" 
                      value={formData.endDate} 
                      onChange={handleChange}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Exam Date Info</label>
                    <input 
                      type="text" 
                      name="examDate" 
                      value={formData.examDate} 
                      onChange={handleChange}
                      placeholder="September - October 2026"
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Attachments & Links</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Notification PDF URL</label>
                    <input 
                      type="text" 
                      name="pdfUrl" 
                      value={formData.pdfUrl} 
                      onChange={handleChange}
                      placeholder="S3 PDF Link" 
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Apply Link</label>
                    <input 
                      type="text" 
                      name="applyLink" 
                      value={formData.applyLink} 
                      onChange={handleChange}
                      placeholder="Official Apply Page URL" 
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Official Website</label>
                    <input 
                      type="text" 
                      name="officialWebsite" 
                      value={formData.officialWebsite} 
                      onChange={handleChange}
                      placeholder="https://ssc.gov.in" 
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
