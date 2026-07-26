'use client'

import React, { useState } from "react";
import LegalLayout from "@/components/LegalLayout";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) return;

    setStatus("submitting");
    // Simulate API request
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  return (
    <LegalLayout title="Contact Us" lastUpdated="July 26, 2026">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Info */}
        <div className="md:col-span-5 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Get in Touch</h2>
            <p className="text-slate-500 text-xs mt-1">Have any questions, feedback, or advertising inquiries? Feel free to reach out to us.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
              <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Us</p>
                <p className="text-xs font-bold text-slate-700 mt-0.5">support@newfreejobalert.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
              <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Headquarters</p>
                <p className="text-xs font-bold text-slate-700 mt-0.5">PR Deep Solution Pvt. Ltd., Jaipur, Rajasthan, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-slate-50/50 border border-slate-200/60 p-6 rounded-2xl">
          {status === "success" ? (
            <div className="text-center py-8 space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Message Sent Successfully!</h3>
                <p className="text-xs text-slate-500 font-medium">Thank you for contacting us. We will get back to you within 24-48 hours.</p>
              </div>
              <button 
                type="button" 
                onClick={() => setStatus("idle")}
                className="text-xs font-bold text-primary hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Your Name *</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-xs focus:border-primary focus:outline-none transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Email Address *</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-xs focus:border-primary focus:outline-none transition-colors"
                  placeholder="e.g. name@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Subject *</label>
                <input 
                  type="text" 
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-xs focus:border-primary focus:outline-none transition-colors"
                  placeholder="e.g. Advertising, Feedback"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Message *</label>
                <textarea 
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs focus:border-primary focus:outline-none transition-colors resize-none"
                  placeholder="Write your message here..."
                />
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full bg-primary hover:bg-primary/95 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                {status === "submitting" ? "Sending..." : "Submit Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </LegalLayout>
  );
}
