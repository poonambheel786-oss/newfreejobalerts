'use client'

import React, { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { createJob } from "../../actions";
import RichTextEditor from "../../../../components/RichTextEditor/RichTextEditor";

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

  useEffect(() => {
    if (initialType && !initialJob) {
      setPostType(initialType);
    }
  }, [initialType, initialJob]);

  useEffect(() => {
    if (state?.success) {
      setShowSuccessModal(true);
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

      <form action={formAction} className="space-y-8">
        <input type="hidden" name="id" value={initialJob?.id || ""} />
        <input type="hidden" name="customDatesJson" value={JSON.stringify(customDates)} />
        <input type="hidden" name="customLinksJson" value={JSON.stringify(customLinks)} />
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
                <RichTextEditor 
                  value={htmlContent}
                  onChange={setHtmlContent}
                  placeholder="Type description or recruitment details..."
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
                <div className="space-y-4">
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

                  {/* Dynamic Custom Dates */}
                  {customDates.length > 0 && (
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Custom Exam/Event Dates</label>
                      {customDates.map((cd, index) => (
                        <div key={index} className="flex gap-2 items-end bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 relative">
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
                              className="w-full h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs focus:border-primary focus:outline-none"
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
                              className="w-full h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs focus:border-primary focus:outline-none"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setCustomDates(customDates.filter((_, idx) => idx !== index))}
                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setCustomDates([...customDates, { label: "", value: "" }])}
                    className="w-full py-2.5 border border-dashed border-slate-200 hover:border-primary hover:text-primary text-slate-550 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-slate-50/50 hover:bg-white"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Date Field (e.g. Pre, Mains)
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-955 uppercase tracking-wide border-b border-slate-100 pb-2">Attachments & Links</h3>
              <div className="space-y-4">
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

                {/* Dynamic Custom Links */}
                {customLinks.length > 0 && (
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Custom Extra Links</label>
                    {customLinks.map((cl, index) => (
                      <div key={index} className="flex gap-2 items-end bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 relative">
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
                            className="w-full h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs focus:border-primary focus:outline-none"
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
                            className="w-full h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs focus:border-primary focus:outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setCustomLinks(customLinks.filter((_, idx) => idx !== index))}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setCustomLinks([...customLinks, { label: "", value: "" }])}
                  className="w-full py-2.5 border border-dashed border-slate-200 hover:border-primary hover:text-primary text-slate-550 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-slate-50/50 hover:bg-white"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Link Field (e.g. Answer Key)
                </button>
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
