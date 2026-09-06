'use client'

import React, { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Save, AlertCircle, CheckCircle2, Plus, Trash2, Loader2,
  Sparkles, FileText, Calendar, Link2, HelpCircle, Search, Eye,
  Building, GraduationCap, MapPin, Download, ExternalLink, Zap,
  Layers, CheckSquare, Clock, DollarSign, Award, ChevronRight,
  RefreshCw, Copy, Check
} from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [contentSubTab, setContentSubTab] = useState<"overview" | "vacancy" | "selection" | "ageSalary" | "fees" | "howToApply" | "editorial">("overview");

  // Form Field States (for real-time preview & template injection)
  const [title, setTitle] = useState(initialJob?.title || "");
  const [department, setDepartment] = useState(initialJob?.department?.name || "");
  const [advtNumber, setAdvtNumber] = useState(initialJob?.advtNumber || "");
  const [vacancy, setVacancy] = useState(initialJob?.vacancy || "");
  const [qualification, setQualification] = useState(initialJob?.qualification?.name || "");
  const [selectedCategory, setSelectedCategory] = useState(initialJob?.category?.name || categories[0] || "Latest Jobs");
  const [selectedState, setSelectedState] = useState(initialJob?.state?.name || "All India");
  const [jobStatus, setJobStatus] = useState(initialJob?.status || "Published");

  // Dates
  const dates = initialJob?.importantDates ? (typeof initialJob.importantDates === 'string' ? JSON.parse(initialJob.importantDates) : initialJob.importantDates) : {};
  const [startDate, setStartDate] = useState(dates?.start ? (typeof dates.start === 'string' ? dates.start.split('T')[0] : "") : "");
  const [endDate, setEndDate] = useState(dates?.end ? (typeof dates.end === 'string' ? dates.end.split('T')[0] : "") : "");
  const [examDate, setExamDate] = useState(dates?.examDate || "");
  const [customDates, setCustomDates] = useState<{ label: string; value: string }[]>(dates?.customDates || []);

  // Links
  const [pdfUrl, setPdfUrl] = useState(initialJob?.pdfUrl || "");
  const [applyLink, setApplyLink] = useState(initialJob?.applyLink || "");
  const [admitCardLink, setAdmitCardLink] = useState(initialJob?.admitCardLink || "");
  const [resultLink, setResultLink] = useState(initialJob?.resultLink || "");
  const [answerKeyLink, setAnswerKeyLink] = useState(initialJob?.answerKeyLink || "");
  const [officialWebsite, setOfficialWebsite] = useState(initialJob?.officialWebsite || "");
  const [customLinks, setCustomLinks] = useState<{ label: string; value: string }[]>(dates?.customLinks || []);

  // Rich Content
  const [htmlContent, setHtmlContent] = useState(initialJob?.eligibility || "");
  const [selectionProcessHtml, setSelectionProcessHtml] = useState(initialJob?.selectionProcess || "");
  const [overviewHtml, setOverviewHtml] = useState(initialJob?.overview || "");
  const [vacancyDetailsHtml, setVacancyDetailsHtml] = useState(initialJob?.vacancyDetails || "");
  const [howToApplyHtml, setHowToApplyHtml] = useState(initialJob?.howToApply || "");
  const [ageLimitHtml, setAgeLimitHtml] = useState(initialJob?.ageLimit || "");
  const [salaryHtml, setSalaryHtml] = useState(initialJob?.salary || "");
  const [applicationFeesHtml, setApplicationFeesHtml] = useState(initialJob?.applicationFees || "");
  const [editorialSummaryHtml, setEditorialSummaryHtml] = useState(initialJob?.editorialSummary || "");

  // SEO
  const [metaTitle, setMetaTitle] = useState(initialJob?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialJob?.metaDescription || "");
  const [searchTags, setSearchTags] = useState(initialJob?.searchTags || "");

  // FAQs
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

  // Global Ctrl+S Keyboard Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        const form = document.getElementById("admin-job-form") as HTMLFormElement;
        if (form) {
          form.requestSubmit();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
      e.preventDefault();
    }
  };

  // Quick Preset Inserters for Popular Exams
  const applyPreset = (type: string) => {
    if (type === "ssc") {
      setTitle("SSC Combined Graduate Level (CGL) Examination 2026 Online Form");
      setDepartment("Staff Selection Commission (SSC)");
      setAdvtNumber("SSC/CGL/2026-HQ");
      setQualification("Bachelor's Degree in Any Discipline");
      setVacancy("17,727 (Tentative)");
      setSelectedCategory("SSC");
      setSelectedState("All India");
      setOfficialWebsite("https://ssc.gov.in");
      setApplicationFeesHtml("<p><strong>General / OBC / EWS:</strong> ₹100/-</p><p><strong>SC / ST / PwBD / Female:</strong> Exempted (Nil)</p><p><strong>Payment Mode:</strong> Online via UPI, Net Banking, Debit/Credit Card.</p>");
      setSelectionProcessHtml("<ol><li><strong>Tier 1 Exam:</strong> Computer Based Test (CBT) - Qualifying in nature</li><li><strong>Tier 2 Exam:</strong> Computer Based Test (Objective + Descriptive + Typing)</li><li><strong>Document Verification:</strong> Conducted by User Departments</li><li><strong>Final Merit List:</strong> Based on Tier 2 Performance</li></ol>");
      setAgeLimitHtml("<p><strong>Age Limit (as on 01/08/2026):</strong> 18 to 30 / 32 Years (Post-wise)</p><p><strong>Age Relaxation:</strong> OBC: +3 Years, SC/ST: +5 Years, PwBD: +10-15 Years as per DoPT rules.</p>");
      setSalaryHtml("<p><strong>Pay Matrix:</strong> Pay Level 4 to Level 8 (₹25,500 to ₹1,51,100)</p><p><strong>Allowances:</strong> Dearness Allowance (DA @ 50%), HRA, Transport Allowance, and Medical benefits.</p>");
    } else if (type === "railway") {
      setTitle("RRB NTPC (Graduate & Under Graduate) Recruitment 2026 Online Form");
      setDepartment("Railway Recruitment Boards (RRB)");
      setAdvtNumber("CEN 05/2026");
      setQualification("12th Pass / Graduate (Post-wise)");
      setVacancy("11,558 Posts");
      setSelectedCategory("Railway");
      setSelectedState("All India");
      setOfficialWebsite("https://rrbapply.gov.in");
      setApplicationFeesHtml("<p><strong>General / OBC / EWS:</strong> ₹500/- (₹400 refunded on appearing in CBT 1)</p><p><strong>SC / ST / Ex-SM / PwBD / Female:</strong> ₹250/- (Full refunded on appearing in CBT 1)</p>");
      setSelectionProcessHtml("<ol><li><strong>1st Stage CBT:</strong> Screening Test (100 Marks)</li><li><strong>2nd Stage CBT:</strong> Main Exam (120 Marks)</li><li><strong>Skill Test:</strong> Typing / CBAT (Post-wise)</li><li><strong>Document Verification & Medical Exam</strong></li></ol>");
      setAgeLimitHtml("<p><strong>Age Limit (as on 01/07/2026):</strong> 18 to 33 / 36 Years</p><p><strong>Age Relaxation:</strong> OBC: +3 Years, SC/ST: +5 Years as per Railway Board guidelines.</p>");
    } else if (type === "banking") {
      setTitle("IBPS PO / Management Trainee (CRP PO/MT-XIV) Recruitment 2026");
      setDepartment("Institute of Banking Personnel Selection (IBPS)");
      setAdvtNumber("IBPS/PO/2026");
      setQualification("Graduate in Any Stream");
      setVacancy("3,955 Posts");
      setSelectedCategory("Banking");
      setSelectedState("All India");
      setOfficialWebsite("https://www.ibps.in");
      setApplicationFeesHtml("<p><strong>General / OBC / EWS:</strong> ₹850/- (Inclusive of GST)</p><p><strong>SC / ST / PwBD:</strong> ₹175/-</p>");
      setSelectionProcessHtml("<ol><li><strong>Online Preliminary Exam:</strong> 100 Marks (1 Hour)</li><li><strong>Online Mains Exam:</strong> 225 Marks (Objective + Descriptive)</li><li><strong>Common Interview:</strong> 100 Marks (Conducted by Participating Banks)</li></ol>");
    } else if (type === "upsc") {
      setTitle("UPSC Civil Services (Preliminary) Examination 2026 Online Application");
      setDepartment("Union Public Service Commission (UPSC)");
      setAdvtNumber("05/2026-CSP");
      setQualification("Degree in Any Discipline from Recognized University");
      setVacancy("1,056 Posts");
      setSelectedCategory("UPSC");
      setSelectedState("All India");
      setOfficialWebsite("https://upsconline.nic.in");
      setApplicationFeesHtml("<p><strong>General / OBC / EWS Male:</strong> ₹100/-</p><p><strong>SC / ST / PwBD / All Females:</strong> Nil (Exempted)</p>");
      setSelectionProcessHtml("<ol><li><strong>Civil Services (Preliminary) Exam:</strong> GS Paper 1 + CSAT Paper 2 (Qualifying 33%)</li><li><strong>Civil Services (Main) Written Exam:</strong> 9 Papers (1750 Marks)</li><li><strong>Personality Test / Interview:</strong> 275 Marks</li></ol>");
    }
  };

  // Smart 1-Click FAQ Generator
  const generateFaqs = () => {
    const jobTitle = title || "this recruitment";
    const lastDate = endDate ? new Date(endDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "as specified in the notification";
    const deptName = department || "the official recruiting board";
    
    setFaqs([
      {
        q: `What is the last date to apply online for ${jobTitle}?`,
        a: `<p>The online application window closes on <strong>${lastDate}</strong>. Candidates are strongly advised to complete registration and fee payment before the deadline to avoid last-minute server congestion.</p>`
      },
      {
        q: `What is the minimum educational eligibility required?`,
        a: `<p>Candidates must possess <strong>${qualification || "the prescribed educational qualification"}</strong> from a recognized board or university as specified in the official notification.</p>`
      },
      {
        q: `What is the selection process for ${deptName}?`,
        a: selectionProcessHtml || `<p>The selection process generally comprises written/computer-based examination, skill test/typing (if applicable), followed by document verification and medical fitness examination.</p>`
      },
      {
        q: `What is the application fee for General and Reserved categories?`,
        a: applicationFeesHtml || `<p>Please refer to the application fees section above for category-wise relaxation and fee concession details.</p>`
      }
    ]);
  };

  const steps = [
    { id: 1, name: "Basic Info", icon: FileText, desc: "Title & Board" },
    { id: 2, name: "Dates & Links", icon: Calendar, desc: "Schedule & URLs" },
    { id: 3, name: "Rich Content", icon: Layers, desc: "Syllabus & Details" },
    { id: 4, name: "FAQ Schema", icon: HelpCircle, desc: "Rich Snippets" },
    { id: 5, name: "SEO & Publish", icon: Search, desc: "Meta & Launch" }
  ];

  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl space-y-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-white">Published Successfully!</h3>
              <p className="text-xs text-slate-400 font-medium">
                {initialJob ? "Notification changes have been synced to the live site." : "New recruitment notification is now live and indexed."}
              </p>
            </div>
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => window.location.href = "/control-panel/dashboard"}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                Go to Dashboard
              </button>
              {initialJob?.slug && (
                <a
                  href={`/jobs/${initialJob.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs py-2.5 rounded-xl transition-all"
                >
                  View Live Post ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <form 
        id="admin-job-form"
        action={formAction} 
        onSubmit={() => setLoading(true)} 
        onKeyDown={handleFormKeyDown} 
        className="space-y-6"
      >
        <input type="hidden" name="id" value={initialJob?.id || ""} />
        <input type="hidden" name="customDatesJson" value={JSON.stringify(customDates)} />
        <input type="hidden" name="customLinksJson" value={JSON.stringify(customLinks)} />
        <input type="hidden" name="faqSchemaJson" value={JSON.stringify(faqs)} />
        
        {/* Hidden Form Bindings for Rich Editors */}
        <textarea name="eligibility" value={htmlContent} onChange={(e) => setHtmlContent(e.target.value)} className="hidden" />
        <textarea name="selectionProcess" value={selectionProcessHtml} onChange={(e) => setSelectionProcessHtml(e.target.value)} className="hidden" />
        <textarea name="overview" value={overviewHtml} onChange={(e) => setOverviewHtml(e.target.value)} className="hidden" />
        <textarea name="vacancyDetails" value={vacancyDetailsHtml} onChange={(e) => setVacancyDetailsHtml(e.target.value)} className="hidden" />
        <textarea name="howToApply" value={howToApplyHtml} onChange={(e) => setHowToApplyHtml(e.target.value)} className="hidden" />
        <textarea name="ageLimit" value={ageLimitHtml} onChange={(e) => setAgeLimitHtml(e.target.value)} className="hidden" />
        <textarea name="salary" value={salaryHtml} onChange={(e) => setSalaryHtml(e.target.value)} className="hidden" />
        <textarea name="applicationFees" value={applicationFeesHtml} onChange={(e) => setApplicationFeesHtml(e.target.value)} className="hidden" />
        <textarea name="editorialSummary" value={editorialSummaryHtml} onChange={(e) => setEditorialSummaryHtml(e.target.value)} className="hidden" />

        {/* Top Floating Action Bar */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-4 z-40">
          <div className="flex items-center gap-3">
            <Link 
              href="/control-panel/dashboard" 
              className="p-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700/60"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white truncate max-w-xs sm:max-w-md">
                  {title || (initialJob ? "Edit Job Notification" : "New Job Entry")}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  jobStatus === "Published" 
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}>
                  {jobStatus}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Step {currentStep} of 5: {steps[currentStep - 1].name} • Tip: Press Ctrl+S anytime to save</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {/* Fast Presets Dropdown */}
            {!initialJob && (
              <div className="flex items-center gap-1 bg-slate-800/80 border border-slate-700/80 rounded-xl p-1 text-xs">
                <span className="text-[10px] font-bold text-violet-400 px-2 flex items-center gap-1">
                  <Zap className="h-3 w-3" /> Quick Fill:
                </span>
                <button
                  type="button"
                  onClick={() => applyPreset("ssc")}
                  className="px-2 py-1 rounded-lg text-[11px] font-bold text-slate-300 hover:text-white hover:bg-violet-600/30 transition-all cursor-pointer"
                >
                  SSC
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("railway")}
                  className="px-2 py-1 rounded-lg text-[11px] font-bold text-slate-300 hover:text-white hover:bg-violet-600/30 transition-all cursor-pointer"
                >
                  RRB
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("banking")}
                  className="px-2 py-1 rounded-lg text-[11px] font-bold text-slate-300 hover:text-white hover:bg-violet-600/30 transition-all cursor-pointer"
                >
                  Bank
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("upsc")}
                  className="px-2 py-1 rounded-lg text-[11px] font-bold text-slate-300 hover:text-white hover:bg-violet-600/30 transition-all cursor-pointer"
                >
                  UPSC
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-violet-600/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{initialJob ? "Save Changes" : "Publish Now"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {state?.error && (
          <div className="bg-rose-950/50 border border-rose-800/80 text-rose-300 p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold shadow-lg">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Unable to save</p>
              <p className="text-rose-300/90">{state.error}</p>
            </div>
          </div>
        )}

        {/* Main Grid: Steps & Work Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Modern Step Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-2">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl border text-left transition-all cursor-pointer group ${
                    isActive 
                      ? "bg-violet-950/40 border-violet-500/80 shadow-md shadow-violet-950/40" 
                      : isCompleted
                      ? "bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700"
                      : "bg-slate-900/40 border-slate-850/80 hover:bg-slate-850/60"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all shrink-0 ${
                    isActive 
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/30" 
                      : isCompleted
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
                  }`}>
                    {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black truncate ${isActive ? "text-violet-300" : "text-slate-300"}`}>
                        {step.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">0{step.id}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{step.desc}</p>
                  </div>
                </button>
              );
            })}

            {/* Quick Live Preview Snippet Card */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 space-y-3 mt-4">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5 text-violet-400" /> Live Card Preview</span>
                <span className="text-[10px] text-emerald-400 font-mono">Real-time</span>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {selectedCategory}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {selectedState}
                  </span>
                  {admitCardLink && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Admit Card
                    </span>
                  )}
                  {resultLink && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Result
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-white line-clamp-2 leading-snug">
                  {title || "Job Title will appear here..."}
                </p>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/60">
                  <span>Vacancy: <strong className="text-slate-200">{vacancy || "N/A"}</strong></span>
                  <span>End: <strong className="text-slate-200">{endDate || "N/A"}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content Area */}
          <div className="lg:col-span-9 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* STEP 1: BASIC INFO */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-violet-400" /> Step 1: Basic Information & Classification
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Enter main job title, recruitment board, vacancy count, and category.</p>
                </div>

                {/* Title */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-300">Job Title / Heading *</label>
                    <span className="text-[11px] text-slate-500">{title.length} characters</span>
                  </div>
                  <input 
                    type="text" 
                    name="title" 
                    required 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. SSC CGL Recruitment 2026 Online Form for 17,727 Vacancies" 
                    className="w-full h-12 px-4 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:bg-slate-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-all font-medium"
                  />
                </div>

                {/* 4 Classification Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Status *</label>
                    <select 
                      name="status" 
                      value={jobStatus}
                      onChange={(e) => setJobStatus(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-violet-500 focus:outline-none transition-all font-semibold cursor-pointer"
                    >
                      <option value="Published">Published (Live)</option>
                      <option value="Draft">Draft</option>
                      <option value="Unpublished">Unpublished</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Post Type *</label>
                    <select 
                      name="postType" 
                      value={postType}
                      onChange={(e) => setPostType(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-violet-500 focus:outline-none transition-all font-semibold cursor-pointer"
                    >
                      <option value="Latest Notifications">Latest Notifications</option>
                      <option value="Admit Cards">Admit Cards</option>
                      <option value="Results">Results</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Category *</label>
                    <select 
                      name="category" 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-violet-500 focus:outline-none transition-all font-semibold cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">State / Domicile *</label>
                    <select 
                      name="state" 
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-violet-500 focus:outline-none transition-all font-semibold cursor-pointer"
                    >
                      {states.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Organization & Advt Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Department / Organization *</label>
                    <input 
                      type="text" 
                      name="department" 
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Staff Selection Commission (SSC)" 
                      className="w-full h-11 px-4 bg-slate-955 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:border-violet-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Advertisement / Notification No.</label>
                    <input 
                      type="text" 
                      name="advtNumber" 
                      value={advtNumber}
                      onChange={(e) => setAdvtNumber(e.target.value)}
                      placeholder="e.g. Advt No. 04/2026" 
                      className="w-full h-11 px-4 bg-slate-955 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:border-violet-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Vacancy & Qualification */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Total Vacancies *</label>
                    <input 
                      type="text" 
                      name="vacancy" 
                      required
                      value={vacancy}
                      onChange={(e) => setVacancy(e.target.value)}
                      placeholder="e.g. 17727 or Various Posts" 
                      className="w-full h-11 px-4 bg-slate-955 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:border-violet-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Minimum Educational Qualification *</label>
                    <input 
                      type="text" 
                      name="qualification" 
                      required
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      placeholder="e.g. 10th Pass / 12th / Graduate / B.Tech" 
                      className="w-full h-11 px-4 bg-slate-955 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:border-violet-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: DATES & LINKS */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-400" /> Step 2: Recruitment Timeline & Official Portal URLs
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Define registration schedule, official notification PDF, apply online link, and admit card/result URLs.</p>
                </div>

                {/* Key Dates Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-955 p-4 rounded-2xl border border-slate-800/80">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Application Start Date</label>
                    <input 
                      type="date" 
                      name="startDate" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition-all cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Application Last Date *</label>
                    <input 
                      type="date" 
                      name="endDate" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition-all cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Exam Date / Info</label>
                    <input 
                      type="text" 
                      name="examDate" 
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      placeholder="e.g. September - October 2026"
                      className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Primary Action URLs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Official Notification PDF URL</label>
                    <input 
                      type="text" 
                      name="pdfUrl" 
                      value={pdfUrl}
                      onChange={(e) => setPdfUrl(e.target.value)}
                      placeholder="https://.../notification.pdf" 
                      className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Apply Online Portal Link</label>
                    <input 
                      type="text" 
                      name="applyLink" 
                      value={applyLink}
                      onChange={(e) => setApplyLink(e.target.value)}
                      placeholder="https://.../apply" 
                      className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Admit Card & Result Action Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-emerald-950/20 border border-emerald-800/40 p-4 rounded-2xl space-y-2">
                    <label className="block text-xs font-bold text-emerald-400 flex items-center justify-between">
                      <span>📥 Admit Card Download URL (Optional)</span>
                      <span className="text-[10px] text-emerald-500/80 font-normal">When released</span>
                    </label>
                    <input 
                      type="text" 
                      name="admitCardLink" 
                      value={admitCardLink}
                      onChange={(e) => setAdmitCardLink(e.target.value)}
                      placeholder="https://.../admit-card" 
                      className="w-full h-10 px-3 bg-slate-955 border border-emerald-900/60 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-all"
                    />
                    <p className="text-[10px] text-slate-400">Adds an instant "Download Admit Card" button on the post and features it in the Admit Cards column.</p>
                  </div>

                  <div className="bg-purple-950/20 border border-purple-800/40 p-4 rounded-2xl space-y-2">
                    <label className="block text-xs font-bold text-purple-400 flex items-center justify-between">
                      <span>🏆 Result / Merit List URL (Optional)</span>
                      <span className="text-[10px] text-purple-500/80 font-normal">When declared</span>
                    </label>
                    <input 
                      type="text" 
                      name="resultLink" 
                      value={resultLink}
                      onChange={(e) => setResultLink(e.target.value)}
                      placeholder="https://.../result" 
                      className="w-full h-10 px-3 bg-slate-955 border border-purple-900/60 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:border-purple-500 focus:outline-none transition-all"
                    />
                    <p className="text-[10px] text-slate-400">Adds an instant "Check Result" button on the post and features it in the Results column.</p>
                  </div>
                </div>

                {/* Additional Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Official Department Website</label>
                    <input 
                      type="text" 
                      name="officialWebsite" 
                      value={officialWebsite}
                      onChange={(e) => setOfficialWebsite(e.target.value)}
                      placeholder="https://ssc.gov.in" 
                      className="w-full h-11 px-4 bg-slate-955 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Answer Key Link (Optional)</label>
                    <input 
                      type="text" 
                      name="answerKeyLink" 
                      value={answerKeyLink}
                      onChange={(e) => setAnswerKeyLink(e.target.value)}
                      placeholder="https://.../answer-key" 
                      className="w-full h-11 px-4 bg-slate-955 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Custom Dates & Extra Links */}
                <div className="space-y-3 border-t border-slate-800 pt-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-300">Custom Event Dates & Custom Links</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCustomDates([...customDates, { label: "", value: "" }])}
                        className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-950/40 border border-indigo-800/40 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Date
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomLinks([...customLinks, { label: "", value: "" }])}
                        className="text-[11px] font-bold text-violet-400 hover:text-violet-300 bg-violet-950/40 border border-violet-800/40 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Extra Link
                      </button>
                    </div>
                  </div>

                  {customDates.map((cd, index) => (
                    <div key={index} className="flex gap-2 items-center bg-slate-955 p-3 rounded-xl border border-slate-800">
                      <input
                        type="text"
                        placeholder="Date Label (e.g. Mains Exam Date)"
                        value={cd.label}
                        onChange={(e) => {
                          const nd = [...customDates];
                          nd[index].label = e.target.value;
                          setCustomDates(nd);
                        }}
                        className="flex-1 h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 15-20 Dec 2026)"
                        value={cd.value}
                        onChange={(e) => {
                          const nd = [...customDates];
                          nd[index].value = e.target.value;
                          setCustomDates(nd);
                        }}
                        className="flex-1 h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setCustomDates(customDates.filter((_, idx) => idx !== index))}
                        className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {customLinks.map((cl, index) => (
                    <div key={index} className="flex gap-2 items-center bg-slate-955 p-3 rounded-xl border border-slate-800">
                      <input
                        type="text"
                        placeholder="Link Label (e.g. Syllabus PDF)"
                        value={cl.label}
                        onChange={(e) => {
                          const nl = [...customLinks];
                          nl[index].label = e.target.value;
                          setCustomLinks(nl);
                        }}
                        className="flex-1 h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:border-violet-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="URL (https://...)"
                        value={cl.value}
                        onChange={(e) => {
                          const nl = [...customLinks];
                          nl[index].value = e.target.value;
                          setCustomLinks(nl);
                        }}
                        className="flex-1 h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:border-violet-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setCustomLinks(customLinks.filter((_, idx) => idx !== index))}
                        className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: RICH CONTENT STUDIO (SUB-TABBED) */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Layers className="h-5 w-5 text-amber-400" /> Step 3: Recruitment Content & Syllabus Studio
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Switch between content tabs to write syllabus, selection stages, age limit, and fee details with 1-click templates.</p>
                </div>

                {/* Sub-Tab Navigation Bar */}
                <div className="flex flex-wrap gap-2 p-1.5 bg-slate-955 border border-slate-800 rounded-2xl">
                  {[
                    { id: "overview", label: "📝 Overview", filled: overviewHtml.length > 0 },
                    { id: "vacancy", label: "📊 Vacancy Table", filled: vacancyDetailsHtml.length > 0 },
                    { id: "selection", label: "🎯 Selection Process", filled: selectionProcessHtml.length > 0 },
                    { id: "ageSalary", label: "⏳ Age & Salary", filled: ageLimitHtml.length > 0 || salaryHtml.length > 0 },
                    { id: "fees", label: "💳 Fees & Mode", filled: applicationFeesHtml.length > 0 },
                    { id: "howToApply", label: "📌 How to Apply", filled: howToApplyHtml.length > 0 },
                    { id: "editorial", label: "✨ Editorial Note", filled: editorialSummaryHtml.length > 0 }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setContentSubTab(tab.id as any)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        contentSubTab === tab.id
                          ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                      }`}
                    >
                      <span>{tab.label}</span>
                      {tab.filled && (
                        <span className={`w-1.5 h-1.5 rounded-full ${contentSubTab === tab.id ? "bg-white" : "bg-emerald-400"}`} />
                      )}
                    </button>
                  ))}
                </div>

                {/* Sub-Tab 1: Overview */}
                {contentSubTab === "overview" && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">Recruitment Overview & Summary (Rich Text)</label>
                      <RichTextEditor 
                        value={overviewHtml}
                        onChange={setOverviewHtml}
                        placeholder="Write a clear recruitment overview highlighting the opening date, recruiting body, total posts, and key candidate instructions..."
                      />
                    </div>
                  </div>
                )}

                {/* Sub-Tab 2: Vacancy Details */}
                {contentSubTab === "vacancy" && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-300">Post-wise Vacancy Breakdown Table</label>
                      <button
                        type="button"
                        onClick={() => {
                          setVacancyDetailsHtml(`
                            <table style="width:100%; border-collapse:collapse; border:1px solid #cbd5e1;">
                              <thead>
                                <tr style="background-color:#f1f5f9; font-weight:bold; text-align:left;">
                                  <th style="padding:8px; border:1px solid #cbd5e1;">Post Name</th>
                                  <th style="padding:8px; border:1px solid #cbd5e1;">Total Posts</th>
                                  <th style="padding:8px; border:1px solid #cbd5e1;">Eligibility Criteria</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td style="padding:8px; border:1px solid #cbd5e1;">Post Group A</td>
                                  <td style="padding:8px; border:1px solid #cbd5e1;">500</td>
                                  <td style="padding:8px; border:1px solid #cbd5e1;">Degree in relevant discipline</td>
                                </tr>
                                <tr>
                                  <td style="padding:8px; border:1px solid #cbd5e1;">Post Group B</td>
                                  <td style="padding:8px; border:1px solid #cbd5e1;">1,200</td>
                                  <td style="padding:8px; border:1px solid #cbd5e1;">12th Pass / Equivalent</td>
                                </tr>
                              </tbody>
                            </table>
                          `);
                        }}
                        className="text-[11px] font-bold text-violet-400 hover:text-violet-300 bg-violet-950/40 border border-violet-800/40 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="h-3 w-3" /> Insert Vacancy Table Template
                      </button>
                    </div>
                    <RichTextEditor 
                      value={vacancyDetailsHtml}
                      onChange={setVacancyDetailsHtml}
                      placeholder="Insert or format post-wise vacancy distributions..."
                    />
                  </div>
                )}

                {/* Sub-Tab 3: Selection Process */}
                {contentSubTab === "selection" && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-300">Selection Stages & Examination Scheme</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectionProcessHtml(`
                              <ol>
                                <li><strong>Tier-1 Computer Based Test (CBT):</strong> Objective screening test covering Quantitative Aptitude, Reasoning, General Awareness, and English.</li>
                                <li><strong>Tier-2 Main Examination:</strong> Core subject knowledge and comprehension evaluation.</li>
                                <li><strong>Skill Test / Typing Test:</strong> Qualifying speed assessment where applicable.</li>
                                <li><strong>Document Verification (DV):</strong> Original certificate validation.</li>
                                <li><strong>Medical Examination:</strong> Standard fitness check as per service rules.</li>
                              </ol>
                            `);
                          }}
                          className="text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-950/40 border border-amber-800/40 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="h-3 w-3" /> Insert Standard CBT Stages
                        </button>
                      </div>
                    </div>
                    <RichTextEditor 
                      value={selectionProcessHtml}
                      onChange={setSelectionProcessHtml}
                      placeholder="Describe CBT phases, interview rules, physical fitness norms, and qualifying criteria..."
                    />
                  </div>
                )}

                {/* Sub-Tab 4: Age & Salary */}
                {contentSubTab === "ageSalary" && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-300">Age Limit & Category Relaxation</label>
                        <button
                          type="button"
                          onClick={() => {
                            setAgeLimitHtml(`
                              <p><strong>Minimum Age:</strong> 18 Years | <strong>Maximum Age:</strong> 30 / 32 Years (as on cut-off date)</p>
                              <p><strong>Category Age Relaxation:</strong></p>
                              <ul>
                                <li><strong>OBC (Non-Creamy Layer):</strong> 3 Years relaxation</li>
                                <li><strong>SC / ST:</strong> 5 Years relaxation</li>
                                <li><strong>PwBD (General/EWS):</strong> 10 Years relaxation</li>
                                <li><strong>PwBD (OBC):</strong> 13 Years relaxation</li>
                                <li><strong>PwBD (SC/ST):</strong> 15 Years relaxation</li>
                                <li><strong>Ex-Servicemen:</strong> As per Central / State Government norms</li>
                              </ul>
                            `);
                          }}
                          className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-950/40 border border-indigo-800/40 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="h-3 w-3" /> Insert Age Relaxation Table
                        </button>
                      </div>
                      <RichTextEditor 
                        value={ageLimitHtml}
                        onChange={setAgeLimitHtml}
                        placeholder="Specify cut-off date, age limits, and reservation relaxations..."
                      />
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-300">Salary / Pay Scale & Allowances</label>
                        <button
                          type="button"
                          onClick={() => {
                            setSalaryHtml(`
                              <p><strong>Pay Matrix:</strong> 7th Central Pay Commission (CPC) Pay Level 4 to Level 7 (₹25,500 to ₹1,42,400 Basic Pay)</p>
                              <p><strong>Allowances & Perks:</strong></p>
                              <ul>
                                <li>Dearness Allowance (DA @ 50%+)</li>
                                <li>House Rent Allowance (HRA based on X/Y/Z city classification)</li>
                                <li>Transport Allowance (TA) and DA on TA</li>
                                <li>National Pension Scheme (NPS) Contribution</li>
                                <li>Medical Insurance and LTC benefits</li>
                              </ul>
                            `);
                          }}
                          className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="h-3 w-3" /> Insert 7th CPC Salary Structure
                        </button>
                      </div>
                      <RichTextEditor 
                        value={salaryHtml}
                        onChange={setSalaryHtml}
                        placeholder="Enter pay matrix level, in-hand estimates, allowances, and perks..."
                      />
                    </div>
                  </div>
                )}

                {/* Sub-Tab 5: Application Fees */}
                {contentSubTab === "fees" && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-300">Application Fees & Payment Modes</label>
                      <button
                        type="button"
                        onClick={() => {
                          setApplicationFeesHtml(`
                            <p><strong>General / OBC / EWS Candidates:</strong> ₹100/-</p>
                            <p><strong>SC / ST / PwBD / All Female Candidates:</strong> Nil (Exempted from fee payment)</p>
                            <p><strong>Payment Mode:</strong> Online via Net Banking, Debit Card, Credit Card, or UPI on the official portal.</p>
                          `);
                        }}
                        className="text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-950/40 border border-amber-800/40 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="h-3 w-3" /> Insert Fee Template
                      </button>
                    </div>
                    <RichTextEditor 
                      value={applicationFeesHtml}
                      onChange={setApplicationFeesHtml}
                      placeholder="Specify category-wise application fees and payment methods..."
                    />
                  </div>
                )}

                {/* Sub-Tab 6: How to Apply */}
                {contentSubTab === "howToApply" && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-300">How to Apply Step-by-Step Instructions</label>
                      <button
                        type="button"
                        onClick={() => {
                          setHowToApplyHtml(`
                            <ol>
                              <li>Visit the official recruiting portal and complete One-Time Registration (OTR).</li>
                              <li>Log in with your registration number and password.</li>
                              <li>Navigate to the active recruitment link and fill in personal, educational, and communication details.</li>
                              <li>Upload scanned photograph, signature, and category certificate strictly adhering to size guidelines.</li>
                              <li>Pay the application fee (if applicable) through the integrated payment gateway.</li>
                              <li>Review all details and submit the application form. Take a printout for future reference.</li>
                            </ol>
                          `);
                        }}
                        className="text-[11px] font-bold text-blue-400 hover:text-blue-300 bg-blue-950/40 border border-blue-800/40 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="h-3 w-3" /> Insert 6-Step Guide Template
                      </button>
                    </div>
                    <RichTextEditor 
                      value={howToApplyHtml}
                      onChange={setHowToApplyHtml}
                      placeholder="Provide clear step-by-step instructions for form filling..."
                    />
                  </div>
                )}

                {/* Sub-Tab 7: Editorial Note */}
                {contentSubTab === "editorial" && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-300">Custom Editorial Summary (Optional)</label>
                    <RichTextEditor 
                      value={editorialSummaryHtml}
                      onChange={setEditorialSummaryHtml}
                      placeholder="Leave blank for automatic smart summary generation, or enter a custom editor's note..."
                    />
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: FAQ SCHEMA */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-fade-in">
                <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-purple-400" /> Step 4: Frequently Asked Questions (Schema.org)
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">FAQs appear in Google Search rich snippets and directly assist candidates.</p>
                  </div>
                  <button
                    type="button"
                    onClick={generateFaqs}
                    className="bg-purple-950/50 hover:bg-purple-900/60 border border-purple-800/60 text-purple-300 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                  >
                    <Sparkles className="h-4 w-4 text-purple-400" /> Auto-Generate Standard FAQs
                  </button>
                </div>

                {faqs.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-slate-800 rounded-3xl p-8 space-y-3 bg-slate-955">
                    <HelpCircle className="h-10 w-10 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400 font-medium">No FAQs added yet. Click below to generate standard questions or add manually.</p>
                    <button
                      type="button"
                      onClick={generateFaqs}
                      className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      ✨ Generate Standard FAQs
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="bg-slate-955 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 relative">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-extrabold text-purple-400">FAQ Question #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => setFaqs(faqs.filter((_, idx) => idx !== index))}
                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Question</label>
                          <input
                            type="text"
                            placeholder="e.g. What is the last date to apply?"
                            value={faq.q}
                            onChange={(e) => {
                              const newFaqs = [...faqs];
                              newFaqs[index].q = e.target.value;
                              setFaqs(newFaqs);
                            }}
                            className="w-full h-11 px-4 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-purple-500 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Answer (Rich Text)</label>
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
                  className="w-full py-3 border border-dashed border-slate-800 hover:border-purple-500 hover:text-purple-300 text-slate-400 text-xs font-semibold rounded-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-slate-955 hover:bg-slate-900"
                >
                  <Plus className="h-4 w-4" /> Add Another FAQ Item
                </button>
              </div>
            )}

            {/* STEP 5: SEO & PUBLISH */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Search className="h-5 w-5 text-emerald-400" /> Step 5: SEO Parameters & Google SERP Simulator
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Optimize search rankings and preview how this notification appears on Google Search.</p>
                </div>

                {/* Google Search SERP Simulator */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" /> Live Google Search Result Preview
                  </span>
                  <div className="bg-white p-4 rounded-xl space-y-1 border border-slate-200">
                    <p className="text-xs text-slate-700 flex items-center gap-1">
                      <span>https://www.newfreejobalerts.com</span>
                      <span className="text-slate-400">› jobs › {title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30) : "recruitment-notification"}</span>
                    </p>
                    <h3 className="text-base font-medium text-blue-700 hover:underline cursor-pointer line-clamp-1">
                      {metaTitle || (title ? `${title} - Apply Details, Syllabus & Result` : "Job Title will appear in search results")}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {metaDescription || `Apply for ${vacancy || "various"} posts in ${department || "Government Board"}. Minimum eligibility: ${qualification || "Graduate"}. Last date to apply: ${endDate || "N/A"}. Full syllabus and official link inside.`}
                    </p>
                  </div>
                </div>

                {/* Meta Title */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-300">Custom Meta Title (Optional)</label>
                    <span className={`text-[11px] font-mono ${metaTitle.length > 60 ? "text-amber-400" : "text-slate-500"}`}>
                      {metaTitle.length}/60 chars
                    </span>
                  </div>
                  <input 
                    type="text" 
                    name="metaTitle" 
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="e.g. SSC CGL Online Form 2026: Apply for 17,727 Vacancies" 
                    className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-all"
                  />
                </div>

                {/* Meta Description */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-300">Custom Meta Description (Optional)</label>
                    <span className={`text-[11px] font-mono ${metaDescription.length > 160 ? "text-amber-400" : "text-slate-500"}`}>
                      {metaDescription.length}/160 chars
                    </span>
                  </div>
                  <textarea 
                    name="metaDescription" 
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={3}
                    placeholder="e.g. Apply online for 17,727 vacancies in SSC CGL recruitment 2026. Check eligibility, exam dates, syllabus roadmap, and direct online application link." 
                    className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-all resize-y"
                  />
                </div>

                {/* Search Keywords */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Search Keywords & Tags (Comma-separated)</label>
                  <input 
                    type="text" 
                    name="searchTags" 
                    value={searchTags}
                    onChange={(e) => setSearchTags(e.target.value)}
                    placeholder="ssc cgl, ssc recruitment 2026, ssc admit card, govt jobs" 
                    className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Bottom Wizard Stepper Navigation */}
            <div className="flex justify-between items-center pt-6 border-t border-slate-800 mt-6">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-5 py-2.5 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  ← Back: {steps[currentStep - 2].name}
                </button>
              ) : (
                <div />
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-violet-900/30 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Next: {steps[currentStep].name}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs px-8 py-3 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>{initialJob ? "Save Notification Changes" : "Publish Job Notification"}</span>
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
