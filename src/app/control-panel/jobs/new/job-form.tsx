'use client'

import React, { useActionState, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle, Bold, Italic, Underline, Strikethrough, Code, Heading1, Heading2, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link2, CheckCircle2 } from "lucide-react";
import { createJob } from "../../actions";

interface Props {
  states: string[];
  categories: string[];
  initialJob?: any;
}

export default function JobForm({ states, categories, initialJob }: Props) {
  const [state, formAction, isPending] = useActionState(createJob, null);
  const [postType, setPostType] = useState(initialJob?.postType || "Latest Notifications");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [htmlContent, setHtmlContent] = useState(initialJob?.eligibility || "");

  useEffect(() => {
    if (state?.success) {
      setShowSuccessModal(true);
    }
  }, [state]);

  const handleEditorBlur = () => {
    if (editorRef.current) {
      setHtmlContent(editorRef.current.innerHTML);
    }
  };

  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
    setHtmlContent(e.currentTarget.innerHTML);
  };

  const handleCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setHtmlContent(editorRef.current.innerHTML);
    }
  };

  const handleLink = () => {
    const url = prompt("Enter link URL:");
    if (url) {
      handleCommand("createLink", url);
    }
  };

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

      <form action={formAction} className="space-y-8">
        <input type="hidden" name="id" value={initialJob?.id || ""} />
        <textarea name="eligibility" value={htmlContent} onChange={(e) => setHtmlContent(e.target.value)} className="hidden" />

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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Core Info */}
          <div className="md:col-span-8 space-y-6">
            {/* Basic Details */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Basic Info</h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Title / Heading *</label>
                  <input 
                    type="text" 
                    name="title" 
                    required 
                    defaultValue={initialJob?.title || ""}
                    placeholder="e.g. SSC CGL Recruitment 2026 Online Form" 
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Status *</label>
                    <select 
                      name="status" 
                      defaultValue={initialJob?.status || "Published"}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Post Type *</label>
                    <select 
                      name="postType" 
                      value={postType}
                      onChange={(e) => setPostType(e.target.value)}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
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
                      defaultValue={initialJob?.state?.name || "All India"}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
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
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Advertisement Number</label>
                      <input 
                        type="text" 
                        name="advtNumber" 
                        defaultValue={initialJob?.advtNumber || ""}
                        placeholder="e.g. SSC/CGL/2026/04" 
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
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
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Minimum Qualification *</label>
                      <input 
                        type="text" 
                        name="qualification" 
                        defaultValue={initialJob?.qualification?.name || ""}
                        placeholder="e.g. Graduate" 
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* WYSIWYG HTML Content Editor Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Description / HTML Content *</h2>
              
              <div className="space-y-3">
                {/* Premium WYSIWYG Toolbar */}
                <div className="flex flex-wrap gap-1 border border-slate-200/80 bg-slate-50/50 p-1.5 rounded-t-xl border-b-0">
                  <button type="button" onClick={() => handleCommand("bold")} className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 cursor-pointer" title="Bold"><Bold className="h-4 w-4" /></button>
                  <button type="button" onClick={() => handleCommand("italic")} className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 cursor-pointer" title="Italic"><Italic className="h-4 w-4" /></button>
                  <button type="button" onClick={() => handleCommand("underline")} className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 cursor-pointer" title="Underline"><Underline className="h-4 w-4" /></button>
                  <button type="button" onClick={() => handleCommand("strikeThrough")} className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 cursor-pointer" title="Strikethrough"><Strikethrough className="h-4 w-4" /></button>
                  <span className="w-[1px] h-6 bg-slate-200 self-center mx-1"></span>
                  <button type="button" onClick={() => handleCommand("formatBlock", "H1")} className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 cursor-pointer" title="H1"><Heading1 className="h-4 w-4" /></button>
                  <button type="button" onClick={() => handleCommand("formatBlock", "H2")} className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 cursor-pointer" title="H2"><Heading2 className="h-4 w-4" /></button>
                  <button type="button" onClick={() => handleCommand("formatBlock", "P")} className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 cursor-pointer font-bold text-xs" title="Paragraph">P</button>
                  <span className="w-[1px] h-6 bg-slate-200 self-center mx-1"></span>
                  <button type="button" onClick={() => handleCommand("insertUnorderedList")} className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 cursor-pointer" title="Bulleted List"><List className="h-4 w-4" /></button>
                  <button type="button" onClick={() => handleCommand("insertOrderedList")} className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 cursor-pointer" title="Numbered List"><ListOrdered className="h-4 w-4" /></button>
                  <span className="w-[1px] h-6 bg-slate-200 self-center mx-1"></span>
                  <button type="button" onClick={() => handleCommand("justifyLeft")} className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 cursor-pointer" title="Align Left"><AlignLeft className="h-4 w-4" /></button>
                  <button type="button" onClick={() => handleCommand("justifyCenter")} className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 cursor-pointer" title="Align Center"><AlignCenter className="h-4 w-4" /></button>
                  <button type="button" onClick={() => handleCommand("justifyRight")} className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 cursor-pointer" title="Align Right"><AlignRight className="h-4 w-4" /></button>
                  <span className="w-[1px] h-6 bg-slate-200 self-center mx-1"></span>
                  <button type="button" onClick={handleLink} className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 cursor-pointer" title="Insert Link"><Link2 className="h-4 w-4" /></button>
                  <button type="button" onClick={() => handleCommand("removeFormat")} className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 cursor-pointer text-xs font-semibold" title="Clear Formatting">Clear</button>
                </div>

                <div 
                  ref={editorRef}
                  contentEditable
                  onBlur={handleEditorBlur}
                  onInput={handleEditorInput}
                  dangerouslySetInnerHTML={{ __html: initialJob?.eligibility || "" }}
                  className="w-full min-h-[220px] p-4 border border-slate-200 rounded-b-xl text-sm focus:bg-white focus:border-primary focus:outline-none transition-all resize-y prose prose-sm max-w-none bg-white"
                  style={{ outline: 'none' }}
                />
              </div>

              {postType === "Latest Notifications" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Age Limit</label>
                    <input 
                      type="text" 
                      name="ageLimit" 
                      defaultValue={initialJob?.ageLimit || ""}
                      placeholder="18 to 30 years" 
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Salary / Pay Scale</label>
                    <input 
                      type="text" 
                      name="salary" 
                      defaultValue={initialJob?.salary || ""}
                      placeholder="Pay level 4 (25500 - 81100)" 
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {postType === "Latest Notifications" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Selection Process</label>
                  <textarea 
                    name="selectionProcess" 
                    defaultValue={initialJob?.selectionProcess || ""}
                    rows={2} 
                    placeholder="Tier-I CBT, Tier-II CBT, and interview..." 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all resize-y"
                  />
                </div>
              )}

              {postType === "Latest Notifications" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Application Fees</label>
                  <input 
                    type="text" 
                    name="applicationFees" 
                    defaultValue={initialJob?.applicationFees || ""}
                    placeholder="GEN/OBC: 100, SC/ST: Exempted" 
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                  />
                </div>
              )}
            </div>

            {/* SEO Settings Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">SEO Configurations</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Meta Title Tag (Optional)</label>
                  <input 
                    type="text" 
                    name="metaTitle" 
                    defaultValue={initialJob?.metaTitle || ""}
                    placeholder="e.g. SSC CGL Online Form 2026: Apply details here" 
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Meta Description (Optional)</label>
                  <textarea 
                    name="metaDescription" 
                    defaultValue={initialJob?.metaDescription || ""}
                    rows={2}
                    placeholder="e.g. Apply online for 17,727 vacancies in SSC CGL recruitment 2026..." 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all resize-y"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Search Keywords / Tags (Comma-separated)</label>
                  <input 
                    type="text" 
                    name="searchTags" 
                    defaultValue={initialJob?.searchTags || ""}
                    placeholder="ssc cgl, ssc recruitment, govt jobs, ssc apply link" 
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Timelines and Links */}
          <div className="md:col-span-4 space-y-6">
            {postType === "Latest Notifications" && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Important Dates</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Start Date</label>
                    <input 
                      type="date" 
                      name="startDate" 
                      defaultValue={formatDateValue(dates?.start)}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">End Date</label>
                    <input 
                      type="date" 
                      name="endDate" 
                      defaultValue={formatDateValue(dates?.end)}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Exam Date Info</label>
                    <input 
                      type="text" 
                      name="examDate" 
                      defaultValue={dates?.examDate || ""}
                      placeholder="September - October 2026"
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-955 uppercase tracking-wide border-b border-slate-100 pb-2">Attachments & Links</h3>
              <div className="space-y-3">
                {postType === "Latest Notifications" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Notification PDF URL</label>
                    <input 
                      type="text" 
                      name="pdfUrl" 
                      defaultValue={initialJob?.pdfUrl || ""}
                      placeholder="S3 PDF Link" 
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {postType === "Latest Notifications" ? "Apply Link *" : "Download / Results Link *"}
                  </label>
                  <input 
                    type="text" 
                    name="applyLink" 
                    required
                    defaultValue={initialJob?.applyLink || ""}
                    placeholder="Official Link" 
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                  />
                </div>
                {postType === "Latest Notifications" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Official Website</label>
                    <input 
                      type="text" 
                      name="officialWebsite" 
                      defaultValue={initialJob?.officialWebsite || ""}
                      placeholder="https://ssc.gov.in" 
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit button placed at the bottom of the form */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-lg shadow-primary/10 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="h-4 w-4" />
            {isPending ? "Saving..." : initialJob ? "Update Notification" : "Publish Notification"}
          </button>
        </div>
      </form>
    </>
  );
}
