// src/app/control-panel/(dashboard)/blog/new/blog-form.tsx
'use client';

import React, { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { createOrUpdateBlogPost } from "../../../actions";
import RichTextEditor from "../../../../../components/RichTextEditor/RichTextEditor";

interface Props {
  initialPost?: any;
}

export default function BlogForm({ initialPost }: Props) {
  const [state, formAction, isPending] = useActionState(createOrUpdateBlogPost, null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [contentHtml, setContentHtml] = useState(initialPost?.content || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (state) {
      setLoading(false);
      if (state.success) {
        setShowSuccessModal(true);
      }
    }
  }, [state]);

  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-slate-100 space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Success!</h3>
              <p className="text-xs text-slate-500 font-medium">
                {initialPost ? "Blog post updated successfully." : "Blog post created successfully."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.location.href = "/control-panel/dashboard/blog"}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              Back to Blog Manager
            </button>
          </div>
        </div>
      )}

      <form action={formAction} onSubmit={() => setLoading(true)} className="space-y-8">
        <input type="hidden" name="id" value={initialPost?.id || ""} />
        <textarea name="content" value={contentHtml} onChange={(e) => setContentHtml(e.target.value)} className="hidden" />

        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/control-panel/dashboard/blog" className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <ArrowLeft className="h-4 w-4 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-950 tracking-tight">
              {initialPost ? "Edit Blog Post" : "Create Blog Post"}
            </h1>
            <p className="text-xs text-slate-500 mt-1">Write informative articles to display on your Career Blog.</p>
          </div>
        </div>

        {state?.success === false && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center gap-2 text-xs font-semibold">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            {state.error}
          </div>
        )}

        {/* Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
                Article Details
              </h2>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Post Title *</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={initialPost?.title || ""}
                  placeholder="e.g. How to Prepare for Government Exams"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-slate-900"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Short Summary / Description *</label>
                <textarea
                  name="description"
                  defaultValue={initialPost?.description || ""}
                  placeholder="Brief summary displayed on the blog listing card (1-2 sentences)."
                  rows={3}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-slate-900 resize-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 font-semibold mb-1 block">Article Body Content *</label>
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <RichTextEditor
                    value={contentHtml}
                    onChange={(html) => setContentHtml(html)}
                    placeholder="Write the full article details here..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Meta & Sidebar settings */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
                Classification & Metadata
              </h2>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Category *</label>
                <select
                  name="category"
                  defaultValue={initialPost?.category || "Exam Preparation"}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-slate-900"
                  required
                >
                  <option value="Exam Preparation">Exam Preparation</option>
                  <option value="Career Guidance">Career Guidance</option>
                  <option value="Resume & Interview">Resume & Interview</option>
                  <option value="Industry Insights">Industry Insights</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Author Name *</label>
                <input
                  type="text"
                  name="author"
                  defaultValue={initialPost?.author || "Admin"}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-slate-900"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Read Time *</label>
                <input
                  type="text"
                  name="readTime"
                  defaultValue={initialPost?.readTime || "5 min read"}
                  placeholder="e.g. 5 min read"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-slate-900"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Date (YYYY-MM-DD)</label>
                <input
                  type="date"
                  name="date"
                  defaultValue={initialPost?.date || new Date().toISOString().split('T')[0]}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-slate-900"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <button
                type="submit"
                disabled={isPending || loading}
                className="w-full bg-primary hover:bg-primary/95 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-primary/15 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {isPending || loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save Article
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
