import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin, GraduationCap, Building2, Download, ExternalLink, HelpCircle, Briefcase, ShieldCheck, ArrowLeft, Share2 } from "lucide-react";
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

  // Dynamic related recruitments
  const [relatedJobs, sameBoardJobs, sameCategoryJobs] = await Promise.all([
    prisma.job.findMany({
      where: {
        status: "Published",
        NOT: { id: job.id }
      },
      take: 3,
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

  const formattedEndDate = dates.end ? formatDateString(dates.end) : "the specified last date";
  const dynamicIntro = `${job.department.name} has announced recruitment for the post of ${job.title} for ${job.vacancy && job.vacancy.trim() !== "0" && job.vacancy.trim() !== "" ? job.vacancy : "various"} posts. Eligible candidates with qualification ${job.qualification.name} can apply through the official application process before ${formattedEndDate}. Candidates should check the official notification for complete eligibility and application requirements.`;

  // Generate programmatic FAQs
  const generatedFaqs = [];
  if (job.title) {
    generatedFaqs.push({
      q: `What is the last date to apply for ${job.title}?`,
      a: dates.end ? `The last date to apply is <strong>${formatDateString(dates.end)}</strong>.` : "Please check the official notification or website for the last date."
    });
    generatedFaqs.push({
      q: `How many vacancies are available for ${job.title}?`,
      a: job.vacancy && job.vacancy.trim() !== "0" && job.vacancy.trim() !== "" ? `There are a total of <strong>${job.vacancy}</strong> vacancies.` : "Please check the official notification for vacancy details."
    });
    generatedFaqs.push({
      q: `What is the qualification required for ${job.title}?`,
      a: `Candidates must have completed <strong>${job.qualification.name}</strong> or equivalent to apply.`
    });
    if (job.salary && job.salary.trim() !== "") {
      generatedFaqs.push({
        q: `What is the salary structure for ${job.title}?`,
        a: `Salary/Pay scale details: ${job.salary}`
      });
    } else {
      generatedFaqs.push({
        q: `What is the salary for ${job.title}?`,
        a: "Salary / pay scale details are not explicitly mentioned in the summary. Candidates are advised to refer to the official notification for the complete pay structure."
      });
    }
    if (job.applicationFees && job.applicationFees.trim() !== "") {
      generatedFaqs.push({
        q: `What is the application fee for ${job.title}?`,
        a: `Application fee details: ${job.applicationFees}`
      });
    }
  }
  const finalFaqs = [...faqs, ...generatedFaqs].slice(0, 8);

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
              {isJob && job.advtNumber && job.advtNumber.trim() !== "" && (
                <span className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4 text-slate-400" /> Advt No: {job.advtNumber}
                </span>
              )}
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-slate-400" /> State: {job.state?.name || "All India"}
              </span>
              {isJob && job.qualification?.name && job.qualification.name.trim() !== "" && job.qualification.name.trim() !== "General Eligibility" && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4 text-slate-400" /> Qualification: {job.qualification.name}
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
                  Notification PDF <Download className="h-3.5 w-3.5" />
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
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Vacancies</p>
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
            
            {/* 1. Overview and Editorial Summary */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" /> Overview & Highlights
              </h2>
              {job.editorialSummary && job.editorialSummary.trim() !== "" ? (
                <div className="overflow-x-auto">
                  <div 
                    className="text-sm text-slate-800 leading-relaxed html-content prose prose-sm max-w-none bg-violet-50/20 p-4 rounded-xl border border-violet-100/50"
                    dangerouslySetInnerHTML={{ __html: job.editorialSummary }}
                  />
                </div>
              ) : (
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  {dynamicIntro}
                </p>
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

            {/* 2. Who Can Apply? Eligibility */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-emerald-500" /> Who Can Apply & Eligibility Criteria
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Educational Qualification</p>
                    <p className="text-sm font-bold text-slate-800">{job.qualification.name}</p>
                  </div>
                  {job.ageLimit && job.ageLimit.trim() !== "" && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Age Limit Specifications</p>
                      <div 
                        className="text-xs text-slate-700 leading-relaxed html-content prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: job.ageLimit }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Detailed Eligibility Description</p>
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

            {/* 3. Vacancy Details */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-indigo-500" /> Vacancy Details
              </h2>
              {job.vacancyDetails && job.vacancyDetails.trim() !== "" ? (
                <div className="overflow-x-auto">
                  <div 
                    className="text-sm text-slate-850 leading-relaxed html-content prose prose-sm max-w-none"
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
                        <th className="px-4 py-3 font-bold text-slate-600 w-1/3 border-r border-slate-200/60">Department</th>
                        <td className="px-4 py-3 text-slate-800 font-semibold">{job.department.name}</td>
                      </tr>
                      {job.vacancy && job.vacancy !== "0" && (
                        <tr className="border-b border-slate-200/60">
                          <th className="px-4 py-3 font-bold text-slate-600 border-r border-slate-200/60">Total Posts</th>
                          <td className="px-4 py-3 text-slate-850 font-bold">{job.vacancy}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 4. Salary / Pay Scale Details */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-teal-500" /> Salary & Pay Scale
              </h2>
              {job.salary && job.salary.trim() !== "" ? (
                <div className="overflow-x-auto">
                  <div 
                    className="text-sm text-slate-700 leading-relaxed html-content prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.salary }}
                  />
                </div>
              ) : (
                <p className="text-sm text-slate-600 italic">
                  Salary scale, grade pay, and allowance details are not explicitly mentioned in the summary data. Candidates should check the official notification for the complete pay matrix.
                </p>
              )}
            </div>

            {/* 5. Selection Process */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-500" /> Selection Process
              </h2>
              {job.selectionProcess && job.selectionProcess.trim() !== "" ? (
                <div className="overflow-x-auto">
                  <div 
                    className="text-sm text-slate-700 leading-relaxed html-content prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.selectionProcess }}
                  />
                </div>
              ) : (
                <p className="text-sm text-slate-600">
                  Selection criteria details should be checked in the official recruitment notice. Standard selection stages typically comprise a written exam/skill test followed by document verification.
                </p>
              )}
            </div>

            {/* 6. Application Fee */}
            {job.applicationFees && job.applicationFees.trim() !== "" && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
                <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-rose-500" /> Application Fee
                </h2>
                <div className="overflow-x-auto">
                  <div 
                    className="text-sm text-slate-700 leading-relaxed html-content prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.applicationFees }}
                  />
                </div>
              </div>
            )}

            {/* 7. Important Dates */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" /> Important Dates
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse border border-slate-200/60 rounded-xl overflow-hidden">
                  <tbody>
                    <tr className="bg-slate-50 border-b border-slate-200/60">
                      <th className="px-4 py-3 font-bold text-slate-600 w-1/3 border-r border-slate-200/60">Start Date to Apply</th>
                      <td className="px-4 py-3 text-slate-800 font-semibold">{formatDateString(dates.start)}</td>
                    </tr>
                    <tr className="border-b border-slate-200/60">
                      <th className="px-4 py-3 font-bold text-slate-600 border-r border-slate-200/60">Last Date to Apply</th>
                      <td className="px-4 py-3 text-rose-600 font-bold">{formatDateString(dates.end)}</td>
                    </tr>
                    {dates.examDate && (
                      <tr className="bg-slate-50 border-b border-slate-200/60">
                        <th className="px-4 py-3 font-bold text-slate-600 border-r border-slate-200/60">Exam Date</th>
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

            {/* 8. How to Apply */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-500" /> How to Apply
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
                  <li>Visit the official portal {job.officialWebsite ? `(${job.officialWebsite})` : ""}.</li>
                  <li>Download and read the official recruitment notification carefully.</li>
                  <li>Complete registration and log in.</li>
                  <li>Fill in all educational and basic details accurately.</li>
                  <li>Upload scanned documents (photograph, signature, certificates).</li>
                  <li>Pay the application fee (if applicable) and submit the form.</li>
                  <li>Take a printout of the submitted page for references.</li>
                </ol>
              )}
            </div>

            {/* 9. Documents Required Checklist */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-500" /> Documents Required
              </h2>
              <p className="text-sm text-slate-600">
                Candidates should keep the following general documents ready during form submission:
              </p>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                <li>10th/12th / Degree certificates and mark sheets.</li>
                <li>Valid Photo ID proof (Aadhar Card, PAN Card, Voter ID, etc.).</li>
                <li>Scanned passport size photograph and signature.</li>
                <li>Caste certificate (if applying under reserved category).</li>
              </ul>
              <p className="text-xs text-slate-500 italic mt-2">
                * Note: Candidates should check the official notification for the complete and exact document upload specifications.
              </p>
            </div>

            {/* 10. Checklist */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-teal-500" /> Pre-Application Checklist
              </h2>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> Ensure qualifications match <strong>{job.qualification.name}</strong> standards.
                </li>
                {dates.end && (
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✓</span> Submit before the deadline: <strong>{formatDateString(dates.end)}</strong>.
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> Verify age limits against relaxation guidelines in the PDF.
                </li>
              </ul>
            </div>

            {/* 11. Official Sources */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-500" /> Official Sources & Website Links
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
                        <th className="px-4 py-3 font-bold text-slate-600 border-r border-slate-200/60">Official Website</th>
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
              <p className="text-xs text-slate-500 italic mt-2">
                Disclaimer: NewFreeJobAlerts is an informational portal. Please double-check final details, application fees, and deadlines on the official website of the recruiting board.
              </p>
            </div>

            {/* FAQs */}
            {finalFaqs.length > 0 && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-indigo-500" /> Frequently Asked Questions (FAQ)
                </h2>
                <div className="space-y-4">
                  {finalFaqs.map((faq: any, index: number) => (
                    <details 
                      key={index} 
                      className="group border border-slate-100 rounded-xl bg-slate-50/50 overflow-hidden [&_summary::-webkit-details-marker]:hidden"
                    >
                      <summary className="flex justify-between items-center p-4 font-bold text-slate-900 text-sm cursor-pointer select-none hover:bg-slate-100/50 transition-colors">
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
                          className="text-slate-600 text-sm pl-5 leading-relaxed html-content prose prose-sm max-w-none"
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
                <span>Share this Alert:</span>
              </p>
              <ShareButtons title={job.title} path={`/jobs/${job.slug}`} />
            </div>

          </div>

          {/* Sidebar - Related Recruitments */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Same Recruitment Board */}
            {sameBoardJobs.length > 0 && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Jobs from {job.department.name}
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


