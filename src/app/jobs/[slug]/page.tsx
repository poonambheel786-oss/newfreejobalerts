import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin, GraduationCap, Building2, Download, ExternalLink, HelpCircle, Briefcase, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

// Fetch Job from database
async function getJob(slug: string) {
  return await prisma.job.findUnique({
    where: { slug },
    include: {
      department: true,
      qualification: true,
      category: true,
      state: true
    }
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) {
    return {
      title: "Job Not Found - NewFreeJobAlert",
    };
  }
  return {
    title: job.metaTitle || `${job.title} - Eligibility, Vacancy & Apply Link`,
    description: job.metaDescription || `Apply for ${job.vacancy} vacancies in ${job.department.name}. Qualification: ${job.qualification.name}. Last Date: ${parseDates(job.importantDates).end}`,
    openGraph: {
      title: job.title,
      description: `Apply for ${job.vacancy} vacancies. Qualification: ${job.qualification.name}.`,
    }
  };
}

function parseDates(importantDates: any) {
  const defaults = { start: "N/A", end: "N/A", examDate: "N/A" };
  if (!importantDates) return defaults;
  try {
    const parsed = typeof importantDates === "string" ? JSON.parse(importantDates) : importantDates;
    return {
      start: parsed.start || "N/A",
      end: parsed.end || "N/A",
      examDate: parsed.examDate || "N/A"
    };
  } catch (e) {
    return defaults;
  }
}

function parseFaqs(faqSchema: any) {
  if (!faqSchema) return [];
  try {
    return typeof faqSchema === "string" ? JSON.parse(faqSchema) : faqSchema;
  } catch (e) {
    return [];
  }
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJob(slug);

  if (!job) {
    notFound();
  }

  const dates = parseDates(job.importantDates);
  const faqs = parseFaqs(job.faqSchema);
  const isJob = job.postType === "Latest Notifications";

  // Schema JSON-LD definition
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.eligibility,
    "identifier": {
      "@type": "PropertyValue",
      "name": job.department.name,
      "value": job.advtNumber || "N/A"
    },
    "datePosted": job.createdAt.toISOString(),
    "validThrough": `${dates.end}T23:59:59Z`,
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.department.name,
      "sameAs": job.officialWebsite || "https://india.gov.in"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
        "addressRegion": job.state?.name || "All India"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-[1280px] w-full px-6 py-10 space-y-8 flex-grow">
        {/* Breadcrumbs */}
        <nav className="text-xs font-semibold text-slate-500 flex gap-2 items-center">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/jobs" className="hover:text-primary transition-colors">Jobs</Link>
          <span>/</span>
          <span className="text-slate-800 truncate">{job.title}</span>
        </nav>

        {/* Hero Details Block */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div className="space-y-3">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 font-bold uppercase">
              {isJob ? job.department.name : job.postType}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{job.title}</h1>
            <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500">
              {isJob && <span className="flex items-center gap-1"><Briefcase className="h-4 w-4 text-slate-400" /> Advt No: {job.advtNumber || "N/A"}</span>}
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-slate-400" /> State: {job.state?.name || "All India"}</span>
              {isJob && <span className="flex items-center gap-1"><GraduationCap className="h-4 w-4 text-slate-400" /> Qualification: {job.qualification.name}</span>}
            </div>
          </div>

          {isJob && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex gap-4 text-center shrink-0 w-full md:w-auto">
              <div className="flex-1 px-4 border-r border-slate-200">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Vacancies</p>
                <p className="text-lg font-bold text-slate-900">{job.vacancy}</p>
              </div>
              <div className="flex-1 px-4">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Last Date</p>
                <p className="text-lg font-bold text-rose-600">{dates.end}</p>
              </div>
            </div>
          )}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Info Blocks */}
          <div className="lg:col-span-8 space-y-6">
            {isJob ? (
              <>
                {/* Info Table Card */}
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                  <div className="border-b border-slate-100 bg-slate-50/50 p-4">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Key Details</h2>
                  </div>
                  <div className="divide-y divide-slate-100 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
                      <span className="font-bold text-slate-600">Description / Details</span>
                      <span 
                        className="sm:col-span-2 text-slate-800 leading-relaxed mt-1 sm:mt-0 html-content prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: job.eligibility }}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
                      <span className="font-bold text-slate-600">Age Limit</span>
                      <span className="sm:col-span-2 text-slate-800 leading-relaxed mt-1 sm:mt-0">{job.ageLimit || "N/A"}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
                      <span className="font-bold text-slate-600">Salary Scale</span>
                      <span className="sm:col-span-2 text-slate-800 leading-relaxed mt-1 sm:mt-0">{job.salary || "N/A"}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
                      <span className="font-bold text-slate-600">Selection Process</span>
                      <span className="sm:col-span-2 text-slate-800 leading-relaxed mt-1 sm:mt-0">{job.selectionProcess || "N/A"}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
                      <span className="font-bold text-slate-600">Application Fees</span>
                      <span className="sm:col-span-2 text-slate-800 leading-relaxed mt-1 sm:mt-0">{job.applicationFees || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Exam Pattern & Syllabus */}
                {(job.examPattern || job.syllabus) && (
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" /> Exam Pattern & Syllabus
                    </h2>
                    <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                      {job.examPattern && (
                        <div>
                          <h3 className="font-bold text-slate-900 mb-1">Exam Pattern:</h3>
                          <p className="whitespace-pre-line">{job.examPattern}</p>
                        </div>
                      )}
                      {job.syllabus && (
                        <div>
                          <h3 className="font-bold text-slate-900 mb-1">Syllabus Overview:</h3>
                          <p className="whitespace-pre-line">{job.syllabus}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Simplified Layout for Admit Cards and Results rendering Description directly */
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Details & Updates</h2>
                <div 
                  className="text-slate-800 leading-relaxed html-content prose prose-sm max-w-none space-y-3"
                  dangerouslySetInnerHTML={{ __html: job.eligibility }}
                />
              </div>
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-indigo-500" /> Frequently Asked Questions (FAQ)
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq: any, index: number) => (
                    <div key={index} className="space-y-1 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                      <h4 className="font-bold text-slate-900 text-sm flex items-start gap-1">
                        <span>Q.</span> {faq.q}
                      </h4>
                      <p className="text-slate-600 text-sm pl-4 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Links & Timeline */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm space-y-4 border border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                {isJob ? "Application Links" : "Download & Links"}
              </h3>
              <div className="space-y-3">
                {job.applyLink && (
                  <a 
                    href={job.applyLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 text-sm cursor-pointer"
                  >
                    {isJob ? "Apply Online" : "Download / View Link"} <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {isJob && job.pdfUrl && (
                  <a 
                    href={job.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 font-bold h-12 rounded-xl flex items-center justify-center gap-2 transition-all text-sm cursor-pointer"
                  >
                    Official Notification PDF <Download className="h-4 w-4" />
                  </a>
                )}
                {isJob && job.officialWebsite && (
                  <a 
                    href={job.officialWebsite} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-medium h-10 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs cursor-pointer"
                  >
                    Official Website <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Timeline Widget (Only for Jobs) */}
            {isJob && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Important Dates</h3>
                <div className="relative pl-6 border-l border-slate-100 space-y-6 text-sm">
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary border-4 border-white ring-2 ring-primary/20"></div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Registration Starts</p>
                    <p className="font-bold text-slate-800">{dates.start}</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 border-4 border-white ring-2 ring-rose-500/20"></div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Last Date to Apply</p>
                    <p className="font-bold text-rose-600">{dates.end}</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-amber-500 border-4 border-white ring-2 ring-amber-500/20"></div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Exam Date</p>
                    <p className="font-bold text-slate-800">{dates.examDate}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
