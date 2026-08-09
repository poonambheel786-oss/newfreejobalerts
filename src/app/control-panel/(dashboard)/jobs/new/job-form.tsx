'use client'

import React, { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle, CheckCircle2, Plus, Trash2, Loader2 } from "lucide-react";
import { createJob } from "../../../actions";
import RichTextEditor from "../../../../../components/RichTextEditor/RichTextEditor";

interface Props {
  states: string[];
  categories: string[];
  initialJob?: any;
  initialType?: string;
}

export default function JobForm({ states, categories, initialJob, initialType }: Props) {
  const [state, formAction, isPending] = useActionState(createJob, null);
  const [postType, setPostType] = useState(initialJob?.postType || initialType || "Latest Notifications");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [htmlContent, setHtmlContent] = useState(initialJob?.eligibility || "");
  const [selectionProcessHtml, setSelectionProcessHtml] = useState(initialJob?.selectionProcess || "");
  const [overviewHtml, setOverviewHtml] = useState(initialJob?.overview || "");
  const [vacancyDetailsHtml, setVacancyDetailsHtml] = useState(initialJob?.vacancyDetails || "");
  const [howToApplyHtml, setHowToApplyHtml] = useState(initialJob?.howToApply || "");
  const [ageLimitHtml, setAgeLimitHtml] = useState(initialJob?.ageLimit || "");
  const [salaryHtml, setSalaryHtml] = useState(initialJob?.salary || "");
  const [applicationFeesHtml, setApplicationFeesHtml] = useState(initialJob?.applicationFees || "");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>(() => {
    if (initialJob?.faqSchema) {
      try {
        return typeof initialJob.faqSchema === 'string' 
          ? JSON.parse(initialJob.faqSchema) 
          : (initialJob.faqSchema as any) || [];
      } catch(e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    if (initialType && !initialJob) {
      setPostType(initialType);
    }
  }, [initialType, initialJob]);

  useEffect(() => {
    if (state) {
      setLoading(false);
      if (state.success) {
        setShowSuccessModal(true);
      }
    }
  }, [state]);

  // Helper to extract date string in format YYYY-MM-DD
  const formatDateValue = (dateObj: any) => {
    if (!dateObj) return "";
    try {
      const d = new Date(dateObj);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().split('T')[0];
    } catch (e) {
      return "";
    }
  };

  const dates = initialJob?.importantDates ? (typeof initialJob.importantDates === 'string' ? JSON.parse(initialJob.importantDates) : initialJob.importantDates) : {};
  const [customDates, setCustomDates] = useState<{label: string, value: string}[]>(dates?.customDates || []);
  const [customLinks, setCustomLinks] = useState<{label: string, value: string}[]>(dates?.customLinks || []);

  return (
    <>
      {/* Premium Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-slate-100 space-y-6 animate-scale-up">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Success!</h3>
              <p className="text-xs text-slate-500 font-medium">
                {initialJob ? "Job notification updated successfully." : "Job notification created successfully."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.location.href = "/control-panel/dashboard"}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      <form action={formAction} onSubmit={() => setLoading(true)} className="space-y-8">
        <input type="hidden" name="id" value={initialJob?.id || ""} />
        <input type="hidden" name="customDatesJson" value={JSON.stringify(customDates)} />
        <input type="hidden" name="customLinksJson" value={JSON.stringify(customLinks)} />
        <input type="hidden" name="faqSchemaJson" value={JSON.stringify(faqs)} />
        <textarea name="eligibility" value={htmlContent} onChange={(e) => setHtmlContent(e.target.value)} className="hidden" />
        <textarea name="selectionProcess" value={selectionProcessHtml} onChange={(e) => setSelectionProcessHtml(e.target.value)} className="hidden" />
        <textarea name="overview" value={overviewHtml} onChange={(e) => setOverviewHtml(e.target.value)} className="hidden" />
        <textarea name="vacancyDetails" value={vacancyDetailsHtml} onChange={(e) => setVacancyDetailsHtml(e.target.value)} className="hidden" />
        <textarea name="howToApply" value={howToApplyHtml} onChange={(e) => setHowToApplyHtml(e.target.value)} className="hidden" />
        <textarea name="ageLimit" value={ageLimitHtml} onChange={(e) => setAgeLimitHtml(e.target.value)} className="hidden" />
        <textarea name="salary" value={salaryHtml} onChange={(e) => setSalaryHtml(e.target.value)} className="hidden" />
        <textarea name="applicationFees" value={applicationFeesHtml} onChange={(e) => setApplicationFeesHtml(e.target.value)} className="hidden" />

        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/control-panel/dashboard" className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <ArrowLeft className="h-4 w-4 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-950 tracking-tight">{initialJob ? "Edit Job Notification" : "Create Job Entry"}</h1>
            <p className="text-xs text-slate-500 mt-1">Specify recruitment details, links, and SEO tags.</p>
          </div>
        </div>

        {/* Error Banner */}
        {state?.error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center gap-2 text-xs font-semibold">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            {state.error}
          </div>
        )}

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Step Navigation Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            {[
              { id: 1, name: "Basic Details", desc: "Step 1" },
              { id: 2, name: "Dates & Links", desc: "Step 2" },
              { id: 3, name: "Details & Content", desc: "Step 3" },
              { id: 4, name: "FAQs", desc: "Step 4" },
              { id: 5, name: "SEO & Publish", desc: "Step 5" }
            ].map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isActive 
                      ? "bg-violet-50/70 border-violet-200 shadow-sm" 
                      : "bg-white border-slate-100 hover:bg-slate-55/50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isActive 
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/10" 
                      : isCompleted
                      ? "bg-violet-100 text-violet-700"
                      : "bg-slate-150 text-slate-500"
                  }`}>
                    {step.id}
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{step.desc}</div>
                    <div className={`text-sm font-extrabold ${isActive ? "text-violet-900" : "text-slate-700"}`}>{step.name}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Form Content Wizard Card */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm space-y-6 relative">
            <div>
              <span className="text-[10px] font-extrabold text-violet-600 uppercase tracking-widest">{initialJob ? "Job Edit Wizard" : "Job Creation Wizard"}</span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1">
                {currentStep === 1 && "Basic Details"}
                {currentStep === 2 && "Dates & Links"}
                {currentStep === 3 && "Details & Content"}
                {currentStep === 4 && "Frequently Asked Questions"}
                {currentStep === 5 && "SEO & Publish"}
              </h2>
            </div>

            {/* STEP 1: BASIC DETAILS */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Title / Heading *</label>
                  <input 
                    type="text" 
                    name="title" 
                    required 
                    defaultValue={initialJob?.title || ""}
                    placeholder="e.g. SSC CGL Recruitment 2026 Online Form" 
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Status *</label>
                    <select 
                      name="status" 
                      defaultValue={initialJob?.status || "Published"}
                      className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                      <option value="Unpublished">Unpublished</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Post Type *</label>
                    <select 
                      name="postType" 
                      value={postType}
                      onChange={(e) => setPostType(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                    >
                      <option value="Latest Notifications">Latest Notifications</option>
                      <option value="Admit Cards">Admit Cards</option>
                      <option value="Results">Results</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Category *</label>
                    <select 
                      name="category" 
                      defaultValue={initialJob?.category?.name || categories[0]}
                      className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
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
                      defaultValue={initialJob?.state?.name || "All India"}
                      className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                    >
                      {states.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {postType === "Latest Notifications" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Department / Organization *</label>
                      <input 
                        type="text" 
                        name="department" 
                        defaultValue={initialJob?.department?.name || ""}
                        placeholder="e.g. Staff Selection Commission" 
                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Advertisement Number</label>
                      <input 
                        type="text" 
                        name="advtNumber" 
                        defaultValue={initialJob?.advtNumber || ""}
                        placeholder="e.g. SSC/CGL/2026/04" 
                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {postType === "Latest Notifications" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Total Vacancies *</label>
                      <input 
                        type="number" 
                        name="vacancy" 
                        defaultValue={initialJob?.vacancy || ""}
                        placeholder="e.g. 17727" 
                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Minimum Qualification *</label>
                      <input 
                        type="text" 
                        name="qualification" 
                        defaultValue={initialJob?.qualification?.name || ""}
                        placeholder="e.g. Graduate" 
                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: DATES & LINKS */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {postType === "Latest Notifications" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Start Date</label>
                      <input 
                        type="date" 
                        name="startDate" 
                        defaultValue={formatDateValue(dates?.start)}
                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">End Date</label>
                      <input 
                        type="date" 
                        name="endDate" 
                        defaultValue={formatDateValue(dates?.end)}
                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Exam Date Info</label>
                      <input 
                        type="text" 
                        name="examDate" 
                        defaultValue={dates?.examDate || ""}
                        placeholder="September - October 2026"
                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Dynamic Custom Dates */}
                {postType === "Latest Notifications" && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Custom Exam/Event Dates</label>
                    {customDates.map((cd, index) => (
                      <div key={index} className="flex gap-2 items-end bg-slate-55 p-3 rounded-2xl border border-slate-200/60 relative">
                        <div className="flex-1 space-y-1">
                          <label className="block text-[9px] font-bold text-slate-500 uppercase">Label</label>
                          <input
                            type="text"
                            placeholder="e.g. Mains Date"
                            value={cd.label}
                            onChange={(e) => {
                              const newDates = [...customDates];
                              newDates[index].label = e.target.value;
                              setCustomDates(newDates);
                            }}
                            className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="block text-[9px] font-bold text-slate-500 uppercase">Date / Info</label>
                          <input
                            type="text"
                            placeholder="e.g. 15-20 Nov 2026"
                            value={cd.value}
                            onChange={(e) => {
                              const newDates = [...customDates];
                              newDates[index].value = e.target.value;
                              setCustomDates(newDates);
                            }}
                            className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs focus:border-primary focus:outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setCustomDates(customDates.filter((_, idx) => idx !== index))}
                          className="p-2.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setCustomDates([...customDates, { label: "", value: "" }])}
                      className="w-full py-2.5 border border-dashed border-slate-200 hover:border-primary hover:text-primary text-slate-550 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-slate-50/50 hover:bg-white"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Date Field (e.g. Pre, Mains)
                    </button>
                  </div>
                )}

                {/* PDF & Apply Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                  {postType === "Latest Notifications" && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Notification PDF URL</label>
                      <input 
                        type="text" 
                        name="pdfUrl" 
                        defaultValue={initialJob?.pdfUrl || ""}
                        placeholder="S3 PDF Link" 
                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      {postType === "Latest Notifications" ? "Apply Link (Optional)" : "Download / Results Link (Optional)"}
                    </label>
                    <input 
                      type="text" 
                      name="applyLink" 
                      defaultValue={initialJob?.applyLink || ""}
                      placeholder="Official Link" 
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                  {postType === "Latest Notifications" && (
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Official Website</label>
                      <input 
                        type="text" 
                        name="officialWebsite" 
                        defaultValue={initialJob?.officialWebsite || ""}
                        placeholder="https://ssc.gov.in" 
                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                  )}
                </div>

                {/* Dynamic Custom Links */}
                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Custom Extra Links</label>
                  {customLinks.map((cl, index) => (
                    <div key={index} className="flex gap-2 items-end bg-slate-55 p-3 rounded-2xl border border-slate-200/60 relative">
                      <div className="flex-1 space-y-1">
                        <label className="block text-[9px] font-bold text-slate-500 uppercase">Link Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Answer Key, Admit Card"
                          value={cl.label}
                          onChange={(e) => {
                            const newLinks = [...customLinks];
                            newLinks[index].label = e.target.value;
                            setCustomLinks(newLinks);
                          }}
                          className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="block text-[9px] font-bold text-slate-500 uppercase">URL Link</label>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={cl.value}
                          onChange={(e) => {
                            const newLinks = [...customLinks];
                            newLinks[index].value = e.target.value;
                            setCustomLinks(newLinks);
                          }}
                          className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs focus:border-primary focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setCustomLinks(customLinks.filter((_, idx) => idx !== index))}
                        className="p-2.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCustomLinks([...customLinks, { label: "", value: "" }])}
                    className="w-full py-2.5 border border-dashed border-slate-200 hover:border-primary hover:text-primary text-slate-550 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-slate-50/50 hover:bg-white"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Link Field (e.g. Answer Key)
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: DETAILS & CONTENT */}
            {currentStep === 3 && (
              <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                {postType === "Latest Notifications" && (
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Overview (Rich Text)</label>
                    <RichTextEditor 
                      value={overviewHtml}
                      onChange={setOverviewHtml}
                      placeholder="Enter post overview or summary..."
                    />
                  </div>
                )}

                {postType === "Latest Notifications" && (
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Vacancy Details (Rich Text)</label>
                    <RichTextEditor 
                      value={vacancyDetailsHtml}
                      onChange={setVacancyDetailsHtml}
                      placeholder="Enter vacancy details table or text..."
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {postType === "Latest Notifications" ? "Eligibility / Details *" : "Description / HTML Content *"}
                  </label>
                  <RichTextEditor 
                    value={htmlContent}
                    onChange={setHtmlContent}
                    placeholder="Type eligibility or description details..."
                  />
                </div>

                {postType === "Latest Notifications" && (
                  <>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Age Limit</label>
                      <RichTextEditor 
                        value={ageLimitHtml}
                        onChange={setAgeLimitHtml}
                        placeholder="Enter age limit details (e.g. 18 to 30 years, age relaxation, etc.)..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Salary / Pay Scale</label>
                      <RichTextEditor 
                        value={salaryHtml}
                        onChange={setSalaryHtml}
                        placeholder="Enter salary or pay scale details..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Selection Process</label>
                      <RichTextEditor 
                        value={selectionProcessHtml}
                        onChange={setSelectionProcessHtml}
                        placeholder="Enter selection process details, stages, and criteria..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Application Fees</label>
                      <RichTextEditor 
                        value={applicationFeesHtml}
                        onChange={setApplicationFeesHtml}
                        placeholder="Enter application fees details for different categories..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">How to Apply (Rich Text)</label>
                      <RichTextEditor 
                        value={howToApplyHtml}
                        onChange={setHowToApplyHtml}
                        placeholder="Enter instructions on how to fill form and apply..."
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* STEP 4: FAQS */}
            {currentStep === 4 && (
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {faqs.length > 0 && (
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/60 relative animate-fade-in">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-extrabold text-slate-700">FAQ Question #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => setFaqs(faqs.filter((_, idx) => idx !== index))}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Question</label>
                          <input
                            type="text"
                            placeholder="e.g. What is the last date to apply?"
                            value={faq.q}
                            onChange={(e) => {
                              const newFaqs = [...faqs];
                              newFaqs[index].q = e.target.value;
                              setFaqs(newFaqs);
                            }}
                            className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Answer (Rich Text)</label>
                          <RichTextEditor
                            value={faq.a}
                            onChange={(val) => {
                              const newFaqs = [...faqs];
                              newFaqs[index].a = val;
                              setFaqs(newFaqs);
                            }}
                            placeholder="Type answer here..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setFaqs([...faqs, { q: "", a: "" }])}
                  className="w-full py-3 border border-dashed border-slate-200 hover:border-primary hover:text-primary text-slate-550 text-xs font-semibold rounded-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-slate-50/50 hover:bg-white"
                >
                  <Plus className="h-4.5 w-4.5" /> Add FAQ Item
                </button>
              </div>
            )}

            {/* STEP 5: SEO & PUBLISH */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Meta Title Tag (Optional)</label>
                  <input 
                    type="text" 
                    name="metaTitle" 
                    defaultValue={initialJob?.metaTitle || ""}
                    placeholder="e.g. SSC CGL Online Form 2026: Apply details here" 
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Meta Description (Optional)</label>
                  <textarea 
                    name="metaDescription" 
                    defaultValue={initialJob?.metaDescription || ""}
                    rows={3}
                    placeholder="e.g. Apply online for 17,727 vacancies in SSC CGL recruitment 2026..." 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-primary focus:outline-none transition-all resize-y"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Search Keywords / Tags (Comma-separated)</label>
                  <input 
                    type="text" 
                    name="searchTags" 
                    defaultValue={initialJob?.searchTags || ""}
                    placeholder="ssc cgl, ssc recruitment, govt jobs, ssc apply link" 
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Wizard Navigation Bar Footer */}
            <div className="flex justify-between items-center pt-6 border-t border-slate-100 mt-6">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Previous
                </button>
              ) : (
                <div />
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-violet-600/10 transition-all cursor-pointer"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-white font-bold text-xs px-8 py-2.5 rounded-xl shadow-lg shadow-primary/10 flex items-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {initialJob ? "Update Notification" : "Publish Notification"}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
