import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin, GraduationCap, Building2, Download, ExternalLink, HelpCircle, Briefcase, IndianRupee, ShieldCheck } from "lucide-react";

// Mock helper to find or generate job details
const getJobBySlug = (slug: string) => {
  const jobs = {
    "ssc-cgl-recruitment-2026": {
      title: "SSC CGL Recruitment 2026 Online Form",
      department: "Staff Selection Commission (SSC)",
      advtNumber: "SSC/CGL/2026/04",
      vacancy: 17727,
      qualification: "Graduation (Any Discipline)",
      eligibility: "Must hold a Bachelor's degree from a recognized university or institute. Candidates appearing in final year can also apply.",
      ageLimit: "18 to 30 years (Relaxation applicable as per Govt rules)",
      salary: "Pay Level 4 to Level 8 (Rs. 25,500 to Rs. 1,51,100 per month)",
      selectionProcess: "Tier-I Computer Based Examination, Tier-II Computer Based Examination, followed by Document Verification.",
      applicationFees: "General/OBC: Rs. 100, SC/ST/PWD/Women: Exempted",
      importantDates: {
        start: "2026-07-01",
        end: "2026-08-15",
        examDate: "September - October 2026"
      },
      examPattern: "Tier-I consists of General Intelligence, Reasoning, Quantitative Aptitude, General Awareness. 100 questions, 200 marks, 60 minutes.",
      syllabus: "Quantitative Aptitude (Arithmetic, Algebra, Geometry), English Comprehension, General Intelligence & Reasoning, General Awareness (Current Affairs, Science, History, Polity).",
      pdfUrl: "https://ssc.gov.in/notification/cgl2026.pdf",
      officialWebsite: "https://ssc.gov.in",
      applyLink: "https://ssc.gov.in/login",
      faqs: [
        { q: "What is the qualification for SSC CGL 2026?", a: "Candidates must possess a Bachelor's Degree in any discipline from a recognized University." },
        { q: "What is the last date to apply for SSC CGL 2026?", a: "The last date to submit the online application form is August 15, 2026." }
      ]
    }
  };

  return jobs[slug as keyof typeof jobs] || {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) + " Notification",
    department: "Government Recruitment Board",
    advtNumber: "GRB/2026/01",
    vacancy: 250,
    qualification: "Degree / Graduation",
    eligibility: "Eligible candidates with required qualifications as stated in official notification.",
    ageLimit: "21 to 35 years",
    salary: "Standard Government scale pay.",
    selectionProcess: "Written exam followed by interview.",
    applicationFees: "Rs. 250 for General/OBC. SC/ST: Free.",
    importantDates: {
      start: "2026-07-20",
      end: "2026-08-20",
      examDate: "Announced soon"
    },
    examPattern: "Standard written paper with General Studies and Subject specific questions.",
    syllabus: "General Knowledge, Aptitude, Reasoning, and specific domain subjects.",
    pdfUrl: "#",
    officialWebsite: "https://india.gov.in",
    applyLink: "#",
    faqs: [
      { q: "How to apply?", a: "Click the Apply Online button below to navigate to the official portal." }
    ]
  };
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  return {
    title: `${job.title} - Full Details & Apply Online`,
    description: `Apply for ${job.vacancy} vacancies in ${job.department}. Check Eligibility, Age Limit, Salary, Exam Pattern, Syllabus, and Official PDF.`,
    openGraph: {
      title: `${job.title} Details`,
      description: `Apply for ${job.vacancy} vacancies. Eligibility: ${job.qualification}.`,
    }
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  // Schema JSON-LD definition
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.eligibility,
    "identifier": {
      "@type": "PropertyValue",
      "name": job.department,
      "value": job.advtNumber
    },
    "datePosted": "2026-07-01T00:00:00Z",
    "validThrough": `${job.importantDates.end}T23:59:59Z`,
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.department,
      "sameAs": job.officialWebsite
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN"
      }
    }
  };

  return (
    <>
      {/* Schema.org Script injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
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
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
              {job.department}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{job.title}</h1>
            <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1"><Briefcase className="h-4 w-4 text-slate-400" /> Advt No: {job.advtNumber}</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-slate-400" /> Location: India</span>
              <span className="flex items-center gap-1"><GraduationCap className="h-4 w-4 text-slate-400" /> Qualification: {job.qualification}</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex gap-4 text-center shrink-0 w-full md:w-auto">
            <div className="flex-1 px-4 border-r border-slate-200">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Vacancies</p>
              <p className="text-lg font-bold text-slate-900">{job.vacancy.toLocaleString()}</p>
            </div>
            <div className="flex-1 px-4">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Last Date</p>
              <p className="text-lg font-bold text-rose-600">{job.importantDates.end}</p>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Info Blocks: Left 8 Columns */}
          <div className="lg:col-span-8 space-y-6">
            {/* Info Table Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50/50 p-4">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Key Details</h2>
              </div>
              <div className="divide-y divide-slate-100 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
                  <span className="font-bold text-slate-600">Eligibility Criteria</span>
                  <span className="sm:col-span-2 text-slate-800 leading-relaxed mt-1 sm:mt-0">{job.eligibility}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
                  <span className="font-bold text-slate-600">Age Limit</span>
                  <span className="sm:col-span-2 text-slate-800 leading-relaxed mt-1 sm:mt-0">{job.ageLimit}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
                  <span className="font-bold text-slate-600">Salary Scale</span>
                  <span className="sm:col-span-2 text-slate-800 leading-relaxed mt-1 sm:mt-0">{job.salary}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
                  <span className="font-bold text-slate-600">Selection Process</span>
                  <span className="sm:col-span-2 text-slate-800 leading-relaxed mt-1 sm:mt-0">{job.selectionProcess}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
                  <span className="font-bold text-slate-600">Application Fees</span>
                  <span className="sm:col-span-2 text-slate-800 leading-relaxed mt-1 sm:mt-0">{job.applicationFees}</span>
                </div>
              </div>
            </div>

            {/* Exam Pattern & Syllabus */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" /> Exam Pattern & Syllabus
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Exam Pattern:</h3>
                  <p>{job.examPattern}</p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Syllabus Overview:</h3>
                  <p>{job.syllabus}</p>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-indigo-500" /> Frequently Asked Questions (FAQ)
              </h2>
              <div className="space-y-4">
                {job.faqs.map((faq, index) => (
                  <div key={index} className="space-y-1 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-900 text-sm flex items-start gap-1">
                      <span>Q.</span> {faq.q}
                    </h4>
                    <p className="text-slate-600 text-sm pl-4 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Links & Timeline: Right 4 Columns */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm space-y-4 border border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Application Links</h3>
              <div className="space-y-3">
                <a 
                  href={job.applyLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 text-sm"
                >
                  Apply Online <ExternalLink className="h-4 w-4" />
                </a>
                <a 
                  href={job.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 font-bold h-12 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
                >
                  Official Notification PDF <Download className="h-4 w-4" />
                </a>
                <a 
                  href={job.officialWebsite} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-medium h-10 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs"
                >
                  Official Website <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Timeline Widget */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Important Dates</h3>
              <div className="relative pl-6 border-l border-slate-100 space-y-6 text-sm">
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary border-4 border-white ring-2 ring-primary/20"></div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Registration Starts</p>
                  <p className="font-bold text-slate-800">{job.importantDates.start}</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 border-4 border-white ring-2 ring-rose-500/20"></div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Last Date to Apply</p>
                  <p className="font-bold text-rose-600">{job.importantDates.end}</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-amber-500 border-4 border-white ring-2 ring-amber-500/20"></div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Exam Date</p>
                  <p className="font-bold text-slate-800">{job.importantDates.examDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
