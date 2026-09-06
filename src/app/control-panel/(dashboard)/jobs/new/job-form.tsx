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
  const [contentSubTab, setContentSubTab] = useState<"overview" | "vacancy" | "selection" | "ageSalary" | "fees" | "howToApply" | "editorial">("overview");

  // Form Field States
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

  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl space-y-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-900">Published Successfully!</h3>
              <p className="text-xs text-slate-500 font-medium">
                {initialJob ? "Notification changes have been updated and synced live." : "New recruitment notification is now published on the website."}
              </p>
            </div>
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => window.location.href = "/control-panel/dashboard"}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Go to Dashboard
              </button>
              {initialJob?.slug && (
                <a
                  href={`/jobs/${initialJob.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-all"
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
        className="space-y-8 max-w-5xl mx-auto pb-16"
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

        {/* Top Sticky Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-20 z-30">
          <div className="flex items-center gap-3">
            <Link 
              href="/control-panel/dashboard" 
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors border border-slate-200"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                  {title || (initialJob ? "Edit Job Notification" : "New Job Notification Entry")}
                </h1>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  jobStatus === "Published" 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  {jobStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500">Fill in the fields below and click Publish (or press Ctrl+S)</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {!initialJob && (
              <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs">
                <span className="text-[11px] font-bold text-blue-700 px-2 flex items-center gap-1">
                  <Zap className="h-3 w-3" /> Quick Pre-fill:
                </span>
                <button
                  type="button"
                  onClick={() => applyPreset("ssc")}
                  className="px-2 py-1 rounded-lg text-[11px] font-bold text-slate-700 hover:text-blue-700 hover:bg-white transition-all cursor-pointer"
                >
                  SSC
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("railway")}
                  className="px-2 py-1 rounded-lg text-[11px] font-bold text-slate-700 hover:text-blue-700 hover:bg-white transition-all cursor-pointer"
                >
                  RRB
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("banking")}
                  className="px-2 py-1 rounded-lg text-[11px] font-bold text-slate-700 hover:text-blue-700 hover:bg-white transition-all cursor-pointer"
                >
                  Bank
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("upsc")}
                  className="px-2 py-1 rounded-lg text-[11px] font-bold text-slate-700 hover:text-blue-700 hover:bg-white transition-all cursor-pointer"
                >
                  UPSC
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-blue-600/10 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{initialJob ? "Save Changes" : "Publish Notification"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {state?.error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold shadow-xs">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            <div>
              <p className="font-bold text-slate-900">Please fix the following error</p>
              <p className="text-rose-700">{state.error}</p>
            </div>
          </div>
        )}

        {/* SECTION 1: BASIC INFORMATION */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><FileText className="h-4 w-4" /></span>
              1. Basic Information & Classification
            </h2>
            <span className="text-xs text-slate-400 font-medium">Required fields marked with *</span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">Notification Title / Post Name *</label>
              <span className="text-[11px] text-slate-400">{title.length} chars</span>
            </div>
            <input 
              type="text" 
              name="title" 
              required 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. SSC CGL Recruitment 2026 Online Form for 17,727 Vacancies" 
              className="w-full h-11 px-4 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition-all font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status *</label>
              <select 
                name="status" 
                value={jobStatus}
                onChange={(e) => setJobStatus(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:border-blue-600 focus:outline-none transition-all font-medium cursor-pointer"
              >
                <option value="Published">Published (Live)</option>
                <option value="Draft">Draft</option>
                <option value="Unpublished">Unpublished</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Post Type *</label>
              <select 
                name="postType" 
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:border-blue-600 focus:outline-none transition-all font-medium cursor-pointer"
              >
                <option value="Latest Notifications">Latest Notifications</option>
                <option value="Admit Cards">Admit Cards</option>
                <option value="Results">Results</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
              <select 
                name="category" 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:border-blue-600 focus:outline-none transition-all font-medium cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">State / Domicile *</label>
              <select 
                name="state" 
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:border-blue-600 focus:outline-none transition-all font-medium cursor-pointer"
              >
                {states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Department / Organization *</label>
              <input 
                type="text" 
                name="department" 
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Staff Selection Commission (SSC)" 
                className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Advertisement / Notification No.</label>
              <input 
                type="text" 
                name="advtNumber" 
                value={advtNumber}
                onChange={(e) => setAdvtNumber(e.target.value)}
                placeholder="e.g. Advt No. 04/2026" 
                className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Total Vacancies *</label>
              <input 
                type="text" 
                name="vacancy" 
                required
                value={vacancy}
                onChange={(e) => setVacancy(e.target.value)}
                placeholder="e.g. 17727 or Various Posts" 
                className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Minimum Qualification *</label>
              <input 
                type="text" 
                name="qualification" 
                required
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="e.g. 10th Pass / 12th / Graduate / B.Tech" 
                className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: IMPORTANT DATES & OFFICIAL LINKS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Calendar className="h-4 w-4" /></span>
              2. Important Dates & Official Portal Links
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Enter registration timeline, PDF link, apply link, and admit card/result URLs.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Application Start Date</label>
              <input 
                type="date" 
                name="startDate" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:border-blue-600 focus:outline-none transition-all cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Application Last Date *</label>
              <input 
                type="date" 
                name="endDate" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:border-blue-600 focus:outline-none transition-all cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Exam Date / Timeline</label>
              <input 
                type="text" 
                name="examDate" 
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                placeholder="e.g. September - October 2026"
                className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Notification PDF URL</label>
              <input 
                type="text" 
                name="pdfUrl" 
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="https://.../notification.pdf" 
                className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Apply Online Portal Link</label>
              <input 
                type="text" 
                name="applyLink" 
                value={applyLink}
                onChange={(e) => setApplyLink(e.target.value)}
                placeholder="https://.../apply" 
                className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Dedicated Admit Card & Result Action Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl space-y-1.5">
              <label className="block text-xs font-bold text-emerald-900 flex items-center justify-between">
                <span>📥 Admit Card Download URL (Optional)</span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-md">When Released</span>
              </label>
              <input 
                type="text" 
                name="admitCardLink" 
                value={admitCardLink}
                onChange={(e) => setAdmitCardLink(e.target.value)}
                placeholder="https://.../admit-card" 
                className="w-full h-10 px-3 bg-white border border-emerald-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-none transition-all"
              />
              <p className="text-[11px] text-emerald-800">Shows a green "Download Admit Card" button on the post and features it in the Admit Cards column.</p>
            </div>

            <div className="bg-purple-50/70 border border-purple-200 p-4 rounded-xl space-y-1.5">
              <label className="block text-xs font-bold text-purple-900 flex items-center justify-between">
                <span>🏆 Result / Merit List URL (Optional)</span>
                <span className="text-[10px] text-purple-700 font-semibold bg-purple-100 px-2 py-0.5 rounded-md">When Declared</span>
              </label>
              <input 
                type="text" 
                name="resultLink" 
                value={resultLink}
                onChange={(e) => setResultLink(e.target.value)}
                placeholder="https://.../result" 
                className="w-full h-10 px-3 bg-white border border-purple-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:border-purple-600 focus:outline-none transition-all"
              />
              <p className="text-[11px] text-purple-800">Shows a purple "Check Result" button on the post and features it in the Results column.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Department Website</label>
              <input 
                type="text" 
                name="officialWebsite" 
                value={officialWebsite}
                onChange={(e) => setOfficialWebsite(e.target.value)}
                placeholder="https://ssc.gov.in" 
                className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Answer Key Link (Optional)</label>
              <input 
                type="text" 
                name="answerKeyLink" 
                value={answerKeyLink}
                onChange={(e) => setAnswerKeyLink(e.target.value)}
                placeholder="https://.../answer-key" 
                className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Custom Dates & Extra Links */}
          <div className="space-y-3 border-t border-slate-100 pt-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700">Custom Event Dates & Custom Links</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCustomDates([...customDates, { label: "", value: "" }])}
                  className="text-[11px] font-bold text-blue-700 hover:text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="h-3 w-3" /> Add Custom Date
                </button>
                <button
                  type="button"
                  onClick={() => setCustomLinks([...customLinks, { label: "", value: "" }])}
                  className="text-[11px] font-bold text-blue-700 hover:text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="h-3 w-3" /> Add Extra Link
                </button>
              </div>
            </div>

            {customDates.map((cd, index) => (
              <div key={index} className="flex gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <input
                  type="text"
                  placeholder="Date Label (e.g. Mains Exam Date)"
                  value={cd.label}
                  onChange={(e) => {
                    const nd = [...customDates];
                    nd[index].label = e.target.value;
                    setCustomDates(nd);
                  }}
                  className="flex-1 h-9 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
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
                  className="flex-1 h-9 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setCustomDates(customDates.filter((_, idx) => idx !== index))}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            {customLinks.map((cl, index) => (
              <div key={index} className="flex gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <input
                  type="text"
                  placeholder="Link Label (e.g. Syllabus PDF)"
                  value={cl.label}
                  onChange={(e) => {
                    const nl = [...customLinks];
                    nl[index].label = e.target.value;
                    setCustomLinks(nl);
                  }}
                  className="flex-1 h-9 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
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
                  className="flex-1 h-9 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setCustomLinks(customLinks.filter((_, idx) => idx !== index))}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: RECRUITMENT CONTENT & SYLLABUS STUDIO */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Layers className="h-4 w-4" /></span>
                3. Recruitment Details & Syllabus Content
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Select a section tab to enter details. Use quick template buttons to insert structured tables.</p>
            </div>
          </div>

          {/* Sub-Tabs Switcher */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 border border-slate-200 rounded-xl">
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
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  contentSubTab === tab.id
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/80"
                }`}
              >
                <span>{tab.label}</span>
                {tab.filled && (
                  <span className={`w-1.5 h-1.5 rounded-full ${contentSubTab === tab.id ? "bg-white" : "bg-emerald-500"}`} />
                )}
              </button>
            ))}
          </div>

          {/* Overview */}
          {contentSubTab === "overview" && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Recruitment Overview & Summary (Rich Text)</label>
              <RichTextEditor 
                value={overviewHtml}
                onChange={setOverviewHtml}
                placeholder="Write recruitment summary, important notifications, and candidate highlights..."
              />
            </div>
          )}

          {/* Vacancy Details */}
          {contentSubTab === "vacancy" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">Post-wise Vacancy Breakdown Table</label>
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
                  className="text-[11px] font-bold text-blue-700 hover:text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
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

          {/* Selection Process */}
          {contentSubTab === "selection" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">Selection Stages & Examination Scheme</label>
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
                  className="text-[11px] font-bold text-blue-700 hover:text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3 w-3" /> Insert Standard CBT Stages Template
                </button>
              </div>
              <RichTextEditor 
                value={selectionProcessHtml}
                onChange={setSelectionProcessHtml}
                placeholder="Describe CBT phases, interview rules, physical fitness norms, and qualifying criteria..."
              />
            </div>
          )}

          {/* Age & Salary */}
          {contentSubTab === "ageSalary" && (
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">Age Limit & Category Relaxation</label>
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
                    className="text-[11px] font-bold text-blue-700 hover:text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Insert Age Relaxation Template
                  </button>
                </div>
                <RichTextEditor 
                  value={ageLimitHtml}
                  onChange={setAgeLimitHtml}
                  placeholder="Specify cut-off date, age limits, and reservation relaxations..."
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">Salary / Pay Scale & Allowances</label>
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
                    className="text-[11px] font-bold text-blue-700 hover:text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Insert 7th CPC Salary Template
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

          {/* Application Fees */}
          {contentSubTab === "fees" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">Application Fees & Payment Modes</label>
                <button
                  type="button"
                  onClick={() => {
                    setApplicationFeesHtml(`
                      <p><strong>General / OBC / EWS Candidates:</strong> ₹100/-</p>
                      <p><strong>SC / ST / PwBD / All Female Candidates:</strong> Nil (Exempted from fee payment)</p>
                      <p><strong>Payment Mode:</strong> Online via Net Banking, Debit Card, Credit Card, or UPI on the official portal.</p>
                    `);
                  }}
                  className="text-[11px] font-bold text-blue-700 hover:text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
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

          {/* How to Apply */}
          {contentSubTab === "howToApply" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">How to Apply Step-by-Step Instructions</label>
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
                  className="text-[11px] font-bold text-blue-700 hover:text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3 w-3" /> Insert 6-Step Apply Guide Template
                </button>
              </div>
              <RichTextEditor 
                value={howToApplyHtml}
                onChange={setHowToApplyHtml}
                placeholder="Provide clear step-by-step instructions for form filling..."
              />
            </div>
          )}

          {/* Editorial Note */}
          {contentSubTab === "editorial" && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Custom Editorial Summary (Optional)</label>
              <RichTextEditor 
                value={editorialSummaryHtml}
                onChange={setEditorialSummaryHtml}
                placeholder="Leave blank for automatic smart summary generation, or enter a custom editor's note..."
              />
            </div>
          )}
        </div>

        {/* SECTION 4: FREQUENTLY ASKED QUESTIONS (FAQ SCHEMA) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><HelpCircle className="h-4 w-4" /></span>
                4. Frequently Asked Questions (FAQ Schema)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">FAQs appear in Google Search rich snippets and assist candidates.</p>
            </div>
            <button
              type="button"
              onClick={generateFaqs}
              className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <Sparkles className="h-4 w-4 text-blue-600" /> Auto-Generate Standard FAQs
            </button>
          </div>

          {faqs.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl p-6 space-y-3 bg-slate-50">
              <HelpCircle className="h-8 w-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">No FAQs added yet. Click below to generate standard questions or add manually.</p>
              <button
                type="button"
                onClick={generateFaqs}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                ✨ Generate Standard FAQs
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-700">FAQ Question #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => setFaqs(faqs.filter((_, idx) => idx !== index))}
                      className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Question</label>
                    <input
                      type="text"
                      placeholder="e.g. What is the last date to apply?"
                      value={faq.q}
                      onChange={(e) => {
                        const newFaqs = [...faqs];
                        newFaqs[index].q = e.target.value;
                        setFaqs(newFaqs);
                      }}
                      className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Answer (Rich Text)</label>
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
            className="w-full py-2.5 border border-dashed border-slate-300 hover:border-blue-600 hover:text-blue-700 text-slate-600 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-slate-50 hover:bg-slate-100"
          >
            <Plus className="h-4 w-4" /> Add Another FAQ Item
          </button>
        </div>

        {/* SECTION 5: SEO PARAMETERS & SERP SIMULATOR */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Search className="h-4 w-4" /></span>
              5. SEO Parameters & Google Search Simulator
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Optimize search snippet metadata and check preview.</p>
          </div>

          {/* Google Search Result Preview Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-blue-600" /> Live Google Search Snippet Preview
            </span>
            <div className="bg-white p-4 rounded-xl space-y-1 border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-600 flex items-center gap-1">
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

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">Custom Meta Title (Optional)</label>
              <span className={`text-[11px] font-mono ${metaTitle.length > 60 ? "text-amber-600" : "text-slate-400"}`}>
                {metaTitle.length}/60 chars
              </span>
            </div>
            <input 
              type="text" 
              name="metaTitle" 
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="e.g. SSC CGL Online Form 2026: Apply for 17,727 Vacancies" 
              className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">Custom Meta Description (Optional)</label>
              <span className={`text-[11px] font-mono ${metaDescription.length > 160 ? "text-amber-600" : "text-slate-400"}`}>
                {metaDescription.length}/160 chars
              </span>
            </div>
            <textarea 
              name="metaDescription" 
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={3}
              placeholder="e.g. Apply online for 17,727 vacancies in SSC CGL recruitment 2026. Check eligibility, exam dates, syllabus roadmap, and direct online application link." 
              className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none transition-all resize-y"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Search Keywords & Tags (Comma-separated)</label>
            <input 
              type="text" 
              name="searchTags" 
              value={searchTags}
              onChange={(e) => setSearchTags(e.target.value)}
              placeholder="ssc cgl, ssc recruitment 2026, ssc admit card, govt jobs" 
              className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* BOTTOM SUBMIT BAR */}
        <div className="flex justify-end items-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>{initialJob ? "Save Notification Changes" : "Publish Job Notification"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
}
