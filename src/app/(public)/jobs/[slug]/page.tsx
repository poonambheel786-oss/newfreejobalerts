import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin, GraduationCap, Building2, Download, ExternalLink, HelpCircle, Briefcase, ShieldCheck, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";

export const revalidate = 3600;

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
    description: job.metaDescription || `Apply for ${job.vacancy} vacancies in ${job.department.name}. Qualification: ${job.qualification.name}. Last Date: ${parseDates(job.importantDates).end || "N/A"}`,
    openGraph: {
      title: job.title,
      description: `Apply for ${job.vacancy} vacancies. Qualification: ${job.qualification.name}.`,
    }
  };
}

function parseDates(importantDates: any) {
  const defaults = { start: "", end: "", examDate: "", customDates: [], customLinks: [] };
  if (!importantDates) return defaults;
  try {
    const parsed = typeof importantDates === "string" ? JSON.parse(importantDates) : importantDates;
    return {
      start: parsed.start || "",
      end: parsed.end || "",
      examDate: parsed.examDate || "",
      customDates: parsed.customDates || [],
      customLinks: parsed.customLinks || []
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

  // Format validThrough using ISO 8601
  let validThroughStr = "";
  if (dates.end && /^\d{4}-\d{2}-\d{2}$/.test(dates.end.trim())) {
    validThroughStr = `${dates.end.trim()}T23:59:59Z`;
  } else {
    const fallbackDate = new Date(job.createdAt);
    fallbackDate.setFullYear(fallbackDate.getFullYear() + 1);
    validThroughStr = fallbackDate.toISOString();
  }

  // Parse salary if available
  let baseSalaryObj = undefined;
  if (job.salary && job.salary.trim() !== "") {
    const cleanedSalary = job.salary.replace(/,/g, '');
    const numbers = cleanedSalary.match(/\d+/g);
    if (numbers) {
      const salaryNumbers = numbers.map(Number).filter(n => n >= 1000);
      if (salaryNumbers.length > 0) {
        const minVal = salaryNumbers[0];
        const maxVal = salaryNumbers.length > 1 ? salaryNumbers[1] : minVal;
        baseSalaryObj = {
          "@type": "MonetaryAmount",
          "currency": "INR",
          "value": {
            "@type": "QuantitativeValue",
            "minValue": minVal,
            "maxValue": maxVal,
            "unitText": "MONTH"
          }
        };
      }
    }
  }

  // Schema JSON-LD definition
  const jsonLd: any = {
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
    "validThrough": validThroughStr,
    "employmentType": "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.department.name,
      "sameAs": job.officialWebsite || "https://india.gov.in"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": job.state?.name || "All India",
        "addressLocality": job.state?.name || "All India",
        "addressRegion": job.state?.name || "All India",
        "addressCountry": "IN"
      }
    }
  };

  if (baseSalaryObj) {
    jsonLd.baseSalary = baseSalaryObj;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-[1280px] w-full px-6 py-10 space-y-8 flex-grow">
        {/* Breadcrumbs & Back Row */}
        <div className="flex items-center justify-between gap-4">
          <nav className="text-xs font-semibold text-slate-500 flex gap-2 items-center min-w-0">
            <Link href="/" className="hover:text-primary transition-colors shrink-0">Home</Link>
            <span className="shrink-0">/</span>
            <Link href="/jobs" className="hover:text-primary transition-colors shrink-0">Jobs</Link>
            <span className="shrink-0">/</span>
            <span className="text-slate-800 truncate">{job.title}</span>
          </nav>
          <Link 
            href="/jobs" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors shrink-0 bg-slate-100 hover:bg-slate-200/70 px-4 py-2 rounded-xl border border-slate-200/40"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>

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
                      <span 
                        className="sm:col-span-2 text-slate-800 leading-relaxed mt-1 sm:mt-0 html-content prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: job.selectionProcess || "N/A" }}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
                      <span className="font-bold text-slate-600">Application Fees</span>
                      <span className="sm:col-span-2 text-slate-800 leading-relaxed mt-1 sm:mt-0 whitespace-pre-line">{job.applicationFees || "N/A"}</span>
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
            {/* Important Links Card */}
            {(job.applyLink || job.pdfUrl || job.officialWebsite || (dates.customLinks && dates.customLinks.length > 0)) && (
              <div className="bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-violet-50/80 border border-indigo-200/70 rounded-2xl p-6 shadow-xl shadow-indigo-100/40 relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none"></div>
                <div className="absolute -left-10 -bottom-10 w-24 h-24 bg-violet-400/10 rounded-full blur-xl pointer-events-none"></div>
                
                <div className="flex items-center justify-between mb-4 border-b border-indigo-100/60 pb-2 relative z-10">
                  <h3 className="text-sm font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
                    Important Links
                  </h3>
                  <span className="text-[9px] font-bold text-white bg-gradient-to-r from-primary to-indigo-600 px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md shadow-indigo-550/15">
                    Apply Now
                  </span>
                </div>
                
                <div className="relative pl-6 border-l border-indigo-200/50 space-y-6 text-sm relative z-10">
                  {job.applyLink && job.applyLink.trim() !== "" && (
                    <div className="relative group">
                      <div className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary border-4 border-white ring-4 ring-primary/10 group-hover:scale-110 transition-transform"></div>
                      <p className="text-[10px] text-indigo-950/60 font-bold uppercase tracking-wider">Apply Link</p>
                      <a 
                        href={job.applyLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-extrabold text-primary hover:text-primary-dark hover:underline flex items-center gap-1 mt-0.5 transition-colors text-base"
                      >
                        {isJob ? "Apply Online" : "Download / View Link"} <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  )}
                  {isJob && job.pdfUrl && job.pdfUrl.trim() !== "" && (
                    <div className="relative group">
                      <div className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 border-4 border-white ring-4 ring-rose-500/10 group-hover:scale-110 transition-transform"></div>
                      <p className="text-[10px] text-indigo-950/60 font-bold uppercase tracking-wider">Notification PDF</p>
                      <a 
                        href={job.pdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-extrabold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 mt-0.5 transition-colors text-base"
                      >
                        Official Notification PDF <Download className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  )}
                  {isJob && job.officialWebsite && job.officialWebsite.trim() !== "" && (
                    <div className="relative group">
                      <div className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-amber-500 border-4 border-white ring-4 ring-amber-500/10 group-hover:scale-110 transition-transform"></div>
                      <p className="text-[10px] text-indigo-950/60 font-bold uppercase tracking-wider">Official Website</p>
                      <a 
                        href={job.officialWebsite} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-bold text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-1 mt-0.5 transition-colors"
                      >
                        Official Website <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  )}
                  {dates.customLinks && dates.customLinks.map((link: any, index: number) => {
                    const colors = [
                      { bg: "bg-indigo-500", text: "text-indigo-600", hover: "hover:text-indigo-700", ring: "ring-indigo-500/10" },
                      { bg: "bg-emerald-500", text: "text-emerald-600", hover: "hover:text-emerald-700", ring: "ring-emerald-500/10" },
                      { bg: "bg-teal-500", text: "text-teal-600", hover: "hover:text-teal-700", ring: "ring-teal-500/10" },
                      { bg: "bg-violet-500", text: "text-violet-600", hover: "hover:text-violet-700", ring: "ring-violet-500/10" }
                    ];
                    const color = colors[index % colors.length];
                    return link.label && link.value && link.value.trim() !== "" && (
                      <div key={index} className="relative group">
                        <div className={`absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full ${color.bg} border-4 border-white ring-4 ${color.ring} group-hover:scale-110 transition-transform`}></div>
                        <p className="text-[10px] text-indigo-950/60 font-bold uppercase tracking-wider">{link.label}</p>
                        <a 
                          href={link.value} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`font-extrabold ${color.text} ${color.hover} hover:underline flex items-center gap-1 mt-0.5 text-base transition-colors`}
                        >
                          Click Here to Visit <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Timeline Widget (Only for Jobs) */}
            {isJob && (dates.start || dates.end || dates.examDate || (dates.customDates && dates.customDates.length > 0)) && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Important Dates</h3>
                <div className="relative pl-6 border-l border-slate-100 space-y-6 text-sm">
                  {dates.start && dates.start.trim() !== "" && (
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary border-4 border-white ring-2 ring-primary/20"></div>
                      <p className="text-xs text-slate-400 font-semibold uppercase">Registration Starts</p>
                      <p className="font-bold text-slate-800">{dates.start}</p>
                    </div>
                  )}
                  {dates.end && dates.end.trim() !== "" && (
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 border-4 border-white ring-2 ring-rose-500/20"></div>
                      <p className="text-xs text-slate-400 font-semibold uppercase">Last Date to Apply</p>
                      <p className="font-bold text-rose-600">{dates.end}</p>
                    </div>
                  )}
                  {dates.examDate && dates.examDate.trim() !== "" && (
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-amber-500 border-4 border-white ring-2 ring-amber-500/20"></div>
                      <p className="text-xs text-slate-400 font-semibold uppercase">Exam Date</p>
                      <p className="font-bold text-slate-800">{dates.examDate}</p>
                    </div>
                  )}
                  {dates.customDates && dates.customDates.map((cd: any, index: number) => (
                    cd.label && cd.value && cd.value.trim() !== "" && (
                      <div key={index} className="relative">
                        <div className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-indigo-500 border-4 border-white ring-2 ring-indigo-500/20"></div>
                        <p className="text-xs text-slate-400 font-semibold uppercase">{cd.label}</p>
                        <p className="font-bold text-slate-800">{cd.value}</p>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
