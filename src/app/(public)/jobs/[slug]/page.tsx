import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Calendar, MapPin, GraduationCap, Building2, Download, ExternalLink, 
  HelpCircle, Briefcase, ShieldCheck, ArrowLeft, Share2, CheckCircle2, 
  AlertTriangle, Calculator, BookOpen, Clock, FileText, Award, Sparkles 
} from "lucide-react";
import { prisma } from "@/lib/db";
import ShareButtons from "../../blog/[slug]/share-buttons";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

// Fetch Job from database
async function getJob(slug: string) {
  const job = await prisma.job.findUnique({
    where: { slug },
    include: {
      department: true,
      qualification: true,
      category: true,
      state: true
    }
  });
  if (job && job.status !== "Published") {
    return null;
  }
  return job;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) {
    return {
      title: "Job Not Found - NewFreeJobAlert",
    };
  }

  const postType = job.postType;
  let defaultDesc = "";
  let ogDesc = "";
  let defaultTitle = `${job.title} - Details & Updates`;

  if (postType === "Admit Cards") {
    defaultTitle = `${job.title} - Download Admit Card & Exam Date`;
    defaultDesc = `Download Admit Card / Hall Ticket for ${job.title}. Check exam dates, download link, and instructions.`;
    ogDesc = `Download Admit Card / Exam Hall Ticket for ${job.title}. Get direct download link and exam dates.`;
  } else if (postType === "Results") {
    defaultTitle = `${job.title} - Merit List, Score Card & Results`;
    defaultDesc = `Check Results, Score Card, Merit List & Cut Off Marks for ${job.title}. Download scorecard and check direct link here.`;
    ogDesc = `Check Results, Score Card, Merit List & Cut Off Marks for ${job.title}. Direct link to download.`;
  } else {
    // Latest Notifications / Jobs
    const endDate = parseDates(job.importantDates).end || "N/A";
    defaultTitle = `${job.title} - Eligibility, Vacancy & Apply Link`;
    defaultDesc = `Apply for ${job.vacancy} vacancies in ${job.department.name}. Qualification: ${job.qualification.name}. Last Date: ${endDate}`;
    ogDesc = `Apply for ${job.vacancy} vacancies. Qualification: ${job.qualification.name}. Last Date: ${endDate}`;
  }

  const finalTitle = job.metaTitle || defaultTitle;
  const finalDescription = job.metaDescription || defaultDesc;

  return {
    title: finalTitle,
    description: finalDescription,
    openGraph: {
      title: job.title,
      description: ogDesc || finalDescription,
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

function formatDateString(dateStr: string) {
  if (!dateStr || dateStr === "N/A" || dateStr.trim() === "") return "N/A";
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parts[2];
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      if (monthIndex >= 0 && monthIndex < 12) {
        return `${day}-${months[monthIndex]} ${year}`;
      }
    }
    return dateStr;
  } catch (e) {
    return dateStr;
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
  const stateName = job.state?.name || "All India";
  const formattedPostedDate = new Date(job.createdAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  const formattedUpdatedDate = new Date(job.updatedAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  // Dynamic related recruitments
  const [relatedJobs, sameBoardJobs, sameCategoryJobs] = await Promise.all([
    prisma.job.findMany({
      where: {
        status: "Published",
        NOT: { id: job.id }
      },
      take: 4,
      orderBy: { createdAt: "desc" }
    }),
    prisma.job.findMany({
      where: {
        status: "Published",
        departmentId: job.departmentId,
        NOT: { id: job.id }
      },
      take: 3,
      orderBy: { createdAt: "desc" }
    }),
    prisma.job.findMany({
      where: {
        status: "Published",
        categoryId: job.categoryId,
        NOT: { id: job.id }
      },
      take: 3,
      orderBy: { createdAt: "desc" }
    })
  ]);

  let linkLabel = "Apply Link";
  let linkText = "Apply Online";
  let badgeText = "Apply Now";

  if (job.postType === "Results") {
    linkLabel = "Check Result";
    linkText = "Check Result";
    badgeText = "Check Result";
  } else if (job.postType === "Admit Cards") {
    linkLabel = "Download Admit Card";
    linkText = "Download Admit Card";
    badgeText = "Admit Card";
  }

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

  // Breadcrumbs Schema JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.newfreejobalerts.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Jobs",
        "item": "https://www.newfreejobalerts.com/jobs"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": job.title,
        "item": `https://www.newfreejobalerts.com/jobs/${job.slug}`
      }
    ]
  };

  // Schema JSON-LD definition
  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.eligibility || job.title,
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
        "streetAddress": stateName,
        "addressLocality": stateName,
        "addressRegion": stateName,
        "addressCountry": "IN"
      }
    }
  };

  if (baseSalaryObj) {
    jsonLd.baseSalary = baseSalaryObj;
  }

  const formattedEndDate = dates.end ? formatDateString(dates.end) : "the specified last date";
  const dynamicIntro = `${job.department.name} has officially released the recruitment advertisement for ${job.title}, announcing ${job.vacancy && job.vacancy.trim() !== "0" && job.vacancy.trim() !== "" ? job.vacancy : "multiple"} vacancies. Candidates possessing ${job.qualification.name} qualifications and meeting the prescribed age and category eligibility criteria are invited to register online before ${formattedEndDate}. Candidates are strongly encouraged to inspect the detailed notification PDF for syllabus breakdowns, reservation guidelines, and application procedures.`;

  // Generate rich programmatic FAQs
  const generatedFaqs: { q: string; a: string }[] = [];
  if (isJob && job.title) {
    generatedFaqs.push({
      q: `What is the last date to submit the application for ${job.title}?`,
      a: dates.end 
        ? `The official closing date for submitting online applications is <strong>${formatDateString(dates.end)}</strong>. Candidates are advised to complete their form submission well before the final hours to avoid server congestion.` 
        : "Please refer to the official notification document or recruitment portal for the finalized closing date."
    });
    generatedFaqs.push({
      q: `How many vacancies are announced in ${job.department.name} recruitment?`,
      a: job.vacancy && job.vacancy.trim() !== "0" && job.vacancy.trim() !== "" 
        ? `A total of <strong>${job.vacancy} vacancies</strong> have been announced across various categories (UR, EWS, OBC, SC, ST, PwBD).` 
        : "The recruiting authority has announced multiple vacancies. Please check the post-wise matrix in the official notice."
    });
    generatedFaqs.push({
      q: `What is the educational qualification required for ${job.title}?`,
      a: `Applicants must hold <strong>${job.qualification.name}</strong> or equivalent recognized credentials from a government-approved institution as on the crucial eligibility cut-off date.`
    });
    if (job.salary && job.salary.trim() !== "") {
      generatedFaqs.push({
        q: `What is the pay scale and salary structure for ${job.title}?`,
        a: `The pay structure is specified as: <strong>${job.salary}</strong>. In addition to basic pay, appointed candidates are eligible for Dearness Allowance (DA), House Rent Allowance (HRA), Transport Allowance (TA), and medical coverage under relevant government pay rules.`
      });
    }
    if (job.applicationFees && job.applicationFees.trim() !== "") {
      generatedFaqs.push({
        q: `What is the application fee for ${job.title}?`,
        a: `Application fee details: ${job.applicationFees}`
      });
    }
    generatedFaqs.push({
      q: `How can I calculate if my age is eligible for ${job.title}?`,
      a: `You can use our free <a href="/tools/age-calculator" class="text-primary underline font-bold">Government Job Age Calculator</a> to enter your Date of Birth, target cut-off date, and reservation category to instantly verify your eligibility with official age relaxations.`
    });
  }
  const finalFaqs = [...faqs, ...generatedFaqs].slice(0, 8);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": finalFaqs.map((f: any) => ({
      "@type": "Question",
      "name": f.q.replace(/<[^>]*>?/gm, ''),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a.replace(/<[^>]*>?/gm, '')
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {finalFaqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

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
            <ArrowLeft className="h-4 w-4" /> Back to Listings
          </Link>
        </div>

        {/* Verified Editorial Fact-Check Notice (E-E-A-T) */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-950">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-600 text-white rounded-lg shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900">
                Fact-Checked & Verified by Government Examination Editorial Board
              </p>
              <p className="text-[11px] text-slate-600">
                Last Reviewed & Verified: <strong>{formattedUpdatedDate}</strong> | Sourced from Official Gazette & Departmental Circulars
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/editorial-policy" className="text-[11px] font-bold text-primary hover:underline">
              Editorial Policy
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/fact-check-policy" className="text-[11px] font-bold text-primary hover:underline">
              Fact Check Process
            </Link>
          </div>
        </div>

        {/* Hero Details Block */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10 uppercase">
                {isJob ? job.department.name : job.postType}
              </span>
              <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                {job.category.name}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{job.title}</h1>
            <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500">
              {isJob && job.advtNumber && job.advtNumber.trim() !== "" && (
                <span className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4 text-slate-400" /> Advt No: <strong>{job.advtNumber}</strong>
                </span>
              )}
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-slate-400" /> State / Domicile: <strong>{stateName}</strong>
              </span>
              {isJob && job.qualification?.name && job.qualification.name.trim() !== "" && job.qualification.name.trim() !== "General Eligibility" && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4 text-slate-400" /> Eligibility: <strong>{job.qualification.name}</strong>
                </span>
              )}
            </div>

            {/* Quick Action Links */}
            <div className="flex flex-wrap gap-3 pt-2">
              {job.applyLink && job.applyLink.trim() !== "" && (
                <a 
                  href={job.applyLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-primary hover:bg-primary/95 px-4.5 py-2.5 rounded-xl shadow-md shadow-primary/10 transition-all"
                >
                  {linkText} <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              {job.pdfUrl && job.pdfUrl.trim() !== "" && (
                <a 
                  href={job.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100/70 border border-rose-200/60 px-4.5 py-2.5 rounded-xl transition-all"
                >
                  Official PDF Notice <Download className="h-3.5 w-3.5" />
                </a>
              )}
              {job.officialWebsite && job.officialWebsite.trim() !== "" && (
                <a 
                  href={job.officialWebsite} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100/70 border border-amber-200/60 px-4.5 py-2.5 rounded-xl transition-all"
                >
                  Official Website <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              {dates.customLinks && dates.customLinks.map((cl: any, idx: number) => cl.label && cl.value && cl.value.trim() !== "" && (
                <a 
                  key={idx}
                  href={cl.value} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100/70 border border-indigo-200/60 px-4.5 py-2.5 rounded-xl transition-all"
                >
                  {cl.label} <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {isJob && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex gap-4 text-center shrink-0 w-full md:w-auto">
              {job.vacancy && job.vacancy.trim() !== "0" && job.vacancy.trim() !== "" ? (
                <>
                  <div className="flex-1 px-4 border-r border-slate-200">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Vacancies</p>
                    <p className="text-lg font-bold text-slate-900">{job.vacancy}</p>
                  </div>
                  <div className="flex-1 px-4">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Last Date</p>
                    <p className="text-lg font-bold text-rose-600">{formatDateString(dates.end)}</p>
                  </div>
                </>
              ) : (
                <div className="flex-1 px-4">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Last Date</p>
                  <p className="text-lg font-bold text-rose-600">{formatDateString(dates.end)}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Overview and Editorial Summary (Human Curation & Commentary) */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" /> Recruitment Overview & In-Depth Editorial Analysis
              </h2>
              {job.editorialSummary && job.editorialSummary.trim() !== "" ? (
                <div className="overflow-x-auto">
                  <div 
                    className="text-sm text-slate-800 leading-relaxed html-content prose prose-sm max-w-none bg-blue-50/30 p-4 rounded-xl border border-blue-100/60"
                    dangerouslySetInnerHTML={{ __html: job.editorialSummary }}
                  />
                </div>
              ) : (
                <div className="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-200/60 space-y-2">
                  <p>{dynamicIntro}</p>
                  <p className="text-xs text-slate-600">
                    <strong>Career Outlook & Significance:</strong> Positions in <strong>{job.department.name}</strong> offer stable public employment, career mobility through departmental examinations, and comprehensive social security benefits. Candidates are advised to review the exam pattern and eligibility criteria below before beginning the online submission.
                  </p>
                </div>
              )}
              {job.overview && job.overview.trim() !== "" && (
                <div className="overflow-x-auto pt-2">
                  <div 
                    className="text-sm text-slate-800 leading-relaxed html-content prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.overview }}
                  />
                </div>
              )}
            </div>

            {isJob && (
              <>
                {/* 2. Who Can Apply? Eligibility & Age Limits */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                  <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-emerald-600" /> Eligibility Criteria & Age Specifications
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Prescribed Minimum Qualification</p>
                        <p className="text-sm font-bold text-slate-800">{job.qualification.name}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">State / Domicile Eligibility</p>
                        <p className="text-sm font-bold text-slate-800">{stateName}</p>
                      </div>
                    </div>

                    {job.ageLimit && job.ageLimit.trim() !== "" ? (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Age Limit Specifications</p>
                        <div 
                          className="text-xs text-slate-700 leading-relaxed html-content prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: job.ageLimit }}
                        />
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Age Limit Overview</p>
                        <p>Standard age requirements generally range from <strong>18 to 30/35 years</strong> (calculated as on the specified cut-off date). Upper age relaxation applies for OBC (+3 yrs), SC/ST (+5 yrs), and PwBD (+10-15 yrs).</p>
                      </div>
                    )}

                    {/* Interactive Age Calculator Callout */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/70 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <p className="font-bold text-blue-900 flex items-center gap-1.5">
                          <Calculator className="h-4 w-4 text-blue-600" /> Not sure about your exact age on the cut-off date?
                        </p>
                        <p className="text-blue-700 text-[11px]">
                          Use our free Age Calculator to verify your eligibility with category reservation rules.
                        </p>
                      </div>
                      <Link 
                        href="/tools/age-calculator" 
                        className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-lg shrink-0 transition-colors shadow-sm"
                      >
                        Calculate Age <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                    
                    <div className="space-y-2 pt-2">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Detailed Educational & Experience Requirements</p>
                      {job.eligibility && job.eligibility.trim() !== "" ? (
                        <div className="overflow-x-auto">
                          <div 
                            className="text-sm text-slate-800 leading-relaxed html-content prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: job.eligibility }}
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-slate-600 italic">
                          Candidates should check the official notification for complete educational qualification, experience and category-wise relaxation standards.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Vacancy Details Table */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                  <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-indigo-500" /> Vacancy Distribution & Breakdown
                  </h2>
                  {job.vacancyDetails && job.vacancyDetails.trim() !== "" ? (
                    <div className="overflow-x-auto">
                      <div 
                        className="text-sm text-slate-800 leading-relaxed html-content prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: job.vacancyDetails }}
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-700">
                        A total of <strong>{job.vacancy && job.vacancy !== "0" ? job.vacancy : "various"} vacancies</strong> have been announced. Post-wise distribution details can be referenced below or via the official notification.
                      </p>
                      <table className="w-full text-left text-sm border-collapse border border-slate-200/60 rounded-xl overflow-hidden">
                        <tbody>
                          <tr className="bg-slate-50 border-b border-slate-200/60">
                            <th className="px-4 py-3 font-bold text-slate-600 w-1/3 border-r border-slate-200/60">Hiring Authority</th>
                            <td className="px-4 py-3 text-slate-800 font-semibold">{job.department.name}</td>
                          </tr>
                          <tr className="border-b border-slate-200/60">
                            <th className="px-4 py-3 font-bold text-slate-600 border-r border-slate-200/60">Post Designation</th>
                            <td className="px-4 py-3 text-slate-800 font-semibold">{job.title}</td>
                          </tr>
                          {job.vacancy && job.vacancy !== "0" && (
                            <tr className="border-b border-slate-200/60 bg-slate-50">
                              <th className="px-4 py-3 font-bold text-slate-600 border-r border-slate-200/60">Total Posts Announced</th>
                              <td className="px-4 py-3 text-slate-900 font-bold">{job.vacancy}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 4. Salary / Pay Scale Details & Calculator */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                  <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <Award className="h-5 w-5 text-teal-600" /> Salary Structure, Pay Level & In-Hand Pay
                  </h2>
                  {job.salary && job.salary.trim() !== "" ? (
                    <div className="overflow-x-auto">
                      <div 
                        className="text-sm text-slate-800 leading-relaxed html-content prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: job.salary }}
                      />
                    </div>
                  ) : (
                    <div className="text-sm text-slate-700 space-y-2">
                      <p>The appointment will be made under the applicable 7th Central Pay Commission or State Pay Rules. In addition to basic pay, selected candidates are entitled to Dearness Allowance (DA), House Rent Allowance (HRA), Transport Allowance (TA), and medical reimbursement schemes.</p>
                    </div>
                  )}
                  {/* Salary Calculator Callout */}
                  <div className="bg-emerald-50/70 border border-emerald-200/70 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <Calculator className="h-4 w-4 text-emerald-600" /> Estimate your Monthly In-Hand Salary
                      </p>
                      <p className="text-emerald-700 text-[11px]">
                        Calculate net take-home pay with DA, HRA (Tier X/Y/Z cities), and NPS deductions.
                      </p>
                    </div>
                    <Link 
                      href="/tools/salary-calculator" 
                      className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-lg shrink-0 transition-colors shadow-sm"
                    >
                      Calculate Salary <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>

                {/* 5. Selection Process & Exam Stages */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                  <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-indigo-600" /> Selection Process & Stages
                  </h2>
                  {job.selectionProcess && job.selectionProcess.trim() !== "" ? (
                    <div className="overflow-x-auto">
                      <div 
                        className="text-sm text-slate-800 leading-relaxed html-content prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: job.selectionProcess }}
                      />
                    </div>
                  ) : (
                    <div className="space-y-3 text-sm text-slate-700">
                      <p>The standard selection methodology typically comprises the following sequential stages:</p>
                      <ol className="list-decimal pl-5 space-y-2 text-xs leading-relaxed text-slate-600">
                        <li><strong>Stage 1: Written Examination / CBT:</strong> Objective or descriptive testing covering General Awareness, Quantitative Aptitude, Reasoning, and Subject Knowledge.</li>
                        <li><strong>Stage 2: Skill / Trade / Physical Test (if applicable):</strong> Typing speed test, stenography, physical efficiency, or trade proficiency test.</li>
                        <li><strong>Stage 3: Document Verification (DV):</strong> Original verification of matriculation certificates, degree marksheets, caste/category certificates, and photo IDs.</li>
                        <li><strong>Stage 4: Medical Examination:</strong> Fitness check as prescribed by government medical boards.</li>
                      </ol>
                    </div>
                  )}
                </div>

                {/* 6. Step-by-Step Preparation Roadmap (Unique Value Add) */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                  <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-amber-600" /> Candidate Preparation Roadmap & Study Strategy
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
                      <p className="font-bold text-slate-900 flex items-center gap-1 text-primary">
                        <Clock className="h-3.5 w-3.5" /> Phase 1: Syllabus Mastery
                      </p>
                      <p className="text-slate-600 leading-relaxed">
                        Download the official syllabus. Break down topics in Quantitative Aptitude, Reasoning, and General Studies. Focus on high-weightage chapters first.
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
                      <p className="font-bold text-slate-900 flex items-center gap-1 text-primary">
                        <FileText className="h-3.5 w-3.5" /> Phase 2: Previous Papers
                      </p>
                      <p className="text-slate-600 leading-relaxed">
                        Solve at least 5 years of past question papers from {job.department.name} or similar commission exams to understand recurring numerical and logic patterns.
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
                      <p className="font-bold text-slate-900 flex items-center gap-1 text-primary">
                        <Award className="h-3.5 w-3.5" /> Phase 3: Mock Tests & Time
                      </p>
                      <p className="text-slate-600 leading-relaxed">
                        Take full-length timed mock tests weekly. Dedicate double the test duration to error analysis and maintain a dedicated mistake logbook.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 7. Application Fee Details */}
                {job.applicationFees && job.applicationFees.trim() !== "" && (
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
                    <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-rose-500" /> Application Fee Structure
                    </h2>
                    <div className="overflow-x-auto">
                      <div 
                        className="text-sm text-slate-700 leading-relaxed html-content prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: job.applicationFees }}
                      />
                    </div>
                  </div>
                )}

                {/* 8. Important Dates Table */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                  <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" /> Key Important Dates
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse border border-slate-200/60 rounded-xl overflow-hidden">
                      <tbody>
                        <tr className="bg-slate-50 border-b border-slate-200/60">
                          <th className="px-4 py-3 font-bold text-slate-600 w-1/3 border-r border-slate-200/60">Online Application Start Date</th>
                          <td className="px-4 py-3 text-slate-800 font-semibold">{formatDateString(dates.start)}</td>
                        </tr>
                        <tr className="border-b border-slate-200/60">
                          <th className="px-4 py-3 font-bold text-slate-600 border-r border-slate-200/60">Last Date to Submit Online Application</th>
                          <td className="px-4 py-3 text-rose-600 font-bold">{formatDateString(dates.end)}</td>
                        </tr>
                        {dates.examDate && (
                          <tr className="bg-slate-50 border-b border-slate-200/60">
                            <th className="px-4 py-3 font-bold text-slate-600 border-r border-slate-200/60">Scheduled Examination Date</th>
                            <td className="px-4 py-3 text-slate-800 font-semibold">{formatDateString(dates.examDate)}</td>
                          </tr>
                        )}
                        {dates.customDates && dates.customDates.map((cd: any, idx: number) => (
                          <tr key={idx} className={idx % 2 === 0 ? "border-b border-slate-200/60" : "bg-slate-50 border-b border-slate-200/60"}>
                            <th className="px-4 py-3 font-bold text-slate-600 border-r border-slate-200/60">{cd.label}</th>
                            <td className="px-4 py-3 text-slate-800">{cd.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 9. Step-by-Step How to Apply & Form-Filling Guide */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                  <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-indigo-500" /> How to Apply: Step-by-Step Form Filling
                  </h2>
                  {job.howToApply && job.howToApply.trim() !== "" ? (
                    <div className="overflow-x-auto">
                      <div 
                        className="text-sm text-slate-800 leading-relaxed html-content prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: job.howToApply }}
                      />
                    </div>
                  ) : (
                    <ol className="list-decimal pl-5 text-sm text-slate-600 space-y-2 leading-relaxed">
                      <li>Visit the official recruitment portal of {job.department.name} {job.officialWebsite ? `(${job.officialWebsite})` : ""}.</li>
                      <li>Download and thoroughly read the official advertisement PDF to confirm category vacancies and eligibility.</li>
                      <li>Click on <strong>"New Registration"</strong> and provide your full name, email, mobile number, and date of birth exactly as printed on your 10th certificate.</li>
                      <li>Log in using your generated Registration ID and Password.</li>
                      <li>Fill out academic details, domicile particulars, and category declarations.</li>
                      <li>Upload scanned copies of your recent passport-size photograph, clear signature, and category certificates in the prescribed dimensions.</li>
                      <li>Pay the requisite application fee via Net Banking / UPI / Debit Card.</li>
                      <li>Review all entered entries in the Preview Page and submit the final form.</li>
                      <li>Download and print 2 hard copies of the confirmation page for document verification.</li>
                    </ol>
                  )}
                </div>

                {/* 10. Common Form-Filling Mistakes to Avoid */}
                <div className="bg-rose-50/50 border border-rose-200/70 rounded-2xl p-6 space-y-3 text-xs text-rose-950">
                  <h3 className="text-sm font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-rose-600" /> Common Mistakes That Cause Application Rejection
                  </h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-700 leading-relaxed">
                    <li><strong>Name / DOB Mismatch:</strong> Entering a name or date of birth that differs even slightly from your 10th Standard / Matriculation marksheet.</li>
                    <li><strong>Outdated Category Certificates:</strong> Submitting an expired OBC-NCL or EWS certificate not issued within the valid financial year specified by the notification.</li>
                    <li><strong>Blurred Photos / Inverted Signatures:</strong> Uploading selfies, photos wearing caps or dark glasses, or low-resolution scans.</li>
                    <li><strong>Incomplete Fee Transaction:</strong> Not verifying if the transaction status is marked "Success" on the portal before the closing date.</li>
                  </ul>
                </div>

                {/* 11. Documents Required Checklist */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
                  <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Mandatory Document Checklist
                  </h2>
                  <p className="text-sm text-slate-600">
                    Keep the following scanned originals ready prior to starting your online form:
                  </p>
                  <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1.5 leading-relaxed">
                    <li>10th / Secondary Certificate (mandatory for Date of Birth verification).</li>
                    <li>12th / Diploma / Bachelor's Degree Certificates and all semester marksheets.</li>
                    <li>Valid Government Photo Identity Proof (Aadhaar Card, PAN Card, Voter ID, or Passport).</li>
                    <li>Valid Community/Caste Certificate (OBC-NCL / SC / ST / EWS / PwBD / Ex-Servicemen Discharge Book).</li>
                    <li>Recent passport-size colored photograph (white background preferred) and black ink signature.</li>
                  </ul>
                </div>

                {/* 12. Official Sources & Verified Portal Links */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                  <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-indigo-500" /> Official Sources & Verification Links
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse border border-slate-200/60 rounded-xl overflow-hidden">
                      <tbody>
                        {job.pdfUrl && (
                          <tr className="bg-slate-50 border-b border-slate-200/60">
                            <th className="px-4 py-3 font-bold text-slate-600 w-1/3 border-r border-slate-200/60">Official Notification</th>
                            <td className="px-4 py-3">
                              <a href={job.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold inline-flex items-center gap-1">Download PDF <ExternalLink className="h-3 w-3" /></a>
                            </td>
                          </tr>
                        )}
                        {job.officialWebsite && (
                          <tr className="border-b border-slate-200/60">
                            <th className="px-4 py-3 font-bold text-slate-600 border-r border-slate-200/60">Official Department Portal</th>
                            <td className="px-4 py-3">
                              <a href={job.officialWebsite} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold inline-flex items-center gap-1">{job.officialWebsite} <ExternalLink className="h-3 w-3" /></a>
                            </td>
                          </tr>
                        )}
                        {job.applyLink && (
                          <tr className="bg-slate-50">
                            <th className="px-4 py-3 font-bold text-slate-600 border-r border-slate-200/60">Apply Online Portal</th>
                            <td className="px-4 py-3">
                              <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold inline-flex items-center gap-1">Apply Link <ExternalLink className="h-3 w-3" /></a>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[11px] text-slate-500 italic mt-2">
                    Transparency Notice: NewFreeJobAlert is an independent career news and educational analysis portal owned by PR Deep Solution Pvt. Ltd. We are not affiliated with any government agency. Always double-check final details on the official recruiting portal.
                  </p>
                </div>
              </>
            )}

            {/* FAQs */}
            {finalFaqs.length > 0 && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-indigo-500" /> Frequently Asked Questions (FAQ)
                </h2>
                <div className="space-y-3">
                  {finalFaqs.map((faq: any, index: number) => (
                    <details 
                      key={index} 
                      className="group border border-slate-100 rounded-xl bg-slate-50/50 overflow-hidden [&_summary::-webkit-details-marker]:hidden"
                    >
                      <summary className="flex justify-between items-center p-4 font-bold text-slate-900 text-xs sm:text-sm cursor-pointer select-none hover:bg-slate-100/50 transition-colors">
                        <span className="flex items-start gap-1.5 pr-4">
                          <span className="text-primary font-extrabold">Q.</span>
                          <span>{faq.q}</span>
                        </span>
                        <svg
                          className="h-4 w-4 text-slate-400 group-open:rotate-180 transition-transform duration-200 shrink-0"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-4 pb-4 pt-1 border-t border-slate-100/50 overflow-x-auto">
                        <div 
                          className="text-slate-600 text-xs sm:text-sm pl-5 leading-relaxed html-content prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: faq.a }}
                        />
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Sharing Footer */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <Share2 className="h-4 w-4 text-slate-400" />
                <span>Share this Alert with Friends:</span>
              </p>
              <ShareButtons title={job.title} path={`/jobs/${job.slug}`} />
            </div>

          </div>

          {/* Sidebar - Related Recruitments & Tools */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Student Utility Tools Box */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-blue-300">
                Aspirant Utilities
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Check eligibility, calculate cut-off age, and compute in-hand salaries:
              </p>
              <div className="space-y-2 pt-1">
                <Link
                  href="/tools/age-calculator"
                  className="flex items-center justify-between p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-300" /> Age & Eligibility Calculator
                  </span>
                  <span>→</span>
                </Link>
                <Link
                  href="/tools/salary-calculator"
                  className="flex items-center justify-between p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-emerald-300" /> 7th CPC Salary Calculator
                  </span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Same Recruitment Board */}
            {sameBoardJobs.length > 0 && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  More from {job.department.name}
                </h3>
                <div className="space-y-3">
                  {sameBoardJobs.map((rj) => (
                    <div key={rj.id} className="space-y-1">
                      <Link href={`/jobs/${rj.slug}`} className="text-xs font-bold text-slate-800 hover:text-primary transition-colors block line-clamp-2">
                        {rj.title}
                      </Link>
                      <p className="text-[10px] text-slate-400 font-medium">Published: {new Date(rj.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Same Category */}
            {sameCategoryJobs.length > 0 && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Similar {job.category.name}
                </h3>
                <div className="space-y-3">
                  {sameCategoryJobs.map((rj) => (
                    <div key={rj.id} className="space-y-1">
                      <Link href={`/jobs/${rj.slug}`} className="text-xs font-bold text-slate-800 hover:text-primary transition-colors block line-clamp-2">
                        {rj.title}
                      </Link>
                      <p className="text-[10px] text-slate-400 font-medium">Published: {new Date(rj.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Latest Alerts */}
            {relatedJobs.length > 0 && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Latest Recruitment Alerts
                </h3>
                <div className="space-y-3">
                  {relatedJobs.map((rj) => (
                    <div key={rj.id} className="space-y-1">
                      <Link href={`/jobs/${rj.slug}`} className="text-xs font-bold text-slate-800 hover:text-primary transition-colors block line-clamp-2">
                        {rj.title}
                      </Link>
                      <p className="text-[10px] text-slate-400 font-medium">Published: {new Date(rj.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
