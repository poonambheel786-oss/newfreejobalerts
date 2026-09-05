import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ArrowLeft, ArrowRight, ClipboardList, BookOpen, ShieldCheck, Building2, HelpCircle, Sparkles, CheckCircle2 } from "lucide-react";
import EntriesSelector from "@/components/EntriesSelector";
import { getStateGuide, getCategoryGuide, GuideInfo } from "@/lib/guide-data";

export const revalidate = 3600;

interface Props {
  searchParams: Promise<{
    category?: string;
    type?: string;
    page?: string;
    q?: string;
    state?: string;
    limit?: string;
  }>;
}

function formatDate(date: Date) {
  const d = new Date(date);
  const day = d.getDate();
  const year = d.getFullYear();
  const months = [
    "Jan", "Feb", "March", "April", "May", "June",
    "July", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];
  return `${day} ${months[d.getMonth()]} ${year}`;
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

export default async function JobsListingPage({ searchParams }: Props) {
  const params = await searchParams;
  const categorySlug = params.category;
  const postTypeQuery = params.type;
  const searchQuery = params.q;
  const stateQuery = params.state;
  const currentPage = parseInt(params.page || "1") || 1;
  const limit = parseInt(params.limit || "15") || 15;
  const skip = (currentPage - 1) * limit;

  // Build filter
  const whereClause: any = {
    status: "Published"
  };

  if (categorySlug) {
    whereClause.category = {
      slug: categorySlug
    };
  }

  if (stateQuery) {
    whereClause.state = {
      slug: stateQuery
    };
  }

  if (postTypeQuery) {
    let mappedType = "";
    if (postTypeQuery === "latest-notifications") {
      mappedType = "Latest Notifications";
    } else if (postTypeQuery === "admit-cards") {
      mappedType = "Admit Cards";
    } else if (postTypeQuery === "results") {
      mappedType = "Results";
    }

    if (mappedType) {
      whereClause.postType = mappedType;
    }
  }

  if (searchQuery) {
    whereClause.OR = [
      { title: { contains: searchQuery, mode: "insensitive" } },
      { department: { name: { contains: searchQuery, mode: "insensitive" } } },
      { qualification: { name: { contains: searchQuery, mode: "insensitive" } } },
      { category: { name: { contains: searchQuery, mode: "insensitive" } } },
      { advtNumber: { contains: searchQuery, mode: "insensitive" } }
    ];
  }

  // Fetch entries
  let jobs: any[] = [];
  let fallbackJobs: any[] = [];
  let totalCount = 0;
  let categoryName = "";
  let typeLabel = "";
  let stateName = "";

  try {
    const [fetchedJobs, count, dbState, dbCat, latestFallback] = await Promise.all([
      prisma.job.findMany({
        where: whereClause,
        include: {
          category: true,
          state: true,
          department: true,
          qualification: true
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.job.count({ where: whereClause }),
      stateQuery ? prisma.state.findUnique({ where: { slug: stateQuery } }) : null,
      categorySlug ? prisma.category.findUnique({ where: { slug: categorySlug } }) : null,
      prisma.job.findMany({
        where: { status: "Published" },
        include: {
          category: true,
          state: true,
          department: true,
          qualification: true
        },
        orderBy: { createdAt: "desc" },
        take: 6
      })
    ]);

    jobs = fetchedJobs;
    totalCount = count;
    fallbackJobs = latestFallback;

    if (dbState) {
      stateName = dbState.name;
    } else if (stateQuery) {
      stateName = stateQuery.replace(/-/g, " ");
    }

    if (dbCat) {
      categoryName = dbCat.name;
    } else if (categorySlug) {
      categoryName = categorySlug.replace(/-/g, " ");
    }

    if (postTypeQuery) {
      if (postTypeQuery === "latest-notifications") typeLabel = "Latest Notifications";
      else if (postTypeQuery === "admit-cards") typeLabel = "Admit Cards";
      else if (postTypeQuery === "results") typeLabel = "Results";
    }
  } catch (e) {
    console.error("Failed to load listings:", e);
  }

  // Load rich guide content for State or Category
  let guide: GuideInfo | null = null;
  if (stateQuery) {
    guide = getStateGuide(stateName || stateQuery, stateQuery);
  } else if (categorySlug) {
    guide = getCategoryGuide(categorySlug, categoryName || categorySlug);
  }

  const totalPages = Math.ceil(totalCount / limit);
  const titleText = searchQuery
    ? `Search Results for "${searchQuery}"`
    : stateName
      ? `Government Jobs in ${stateName}`
      : typeLabel 
        ? `${typeLabel} List` 
        : categoryName 
          ? categoryName.toLowerCase().endsWith("jobs")
            ? categoryName
            : `${categoryName} Jobs`
          : "All Recruitment Notifications & Updates";

  // Build pagination query helper
  const getPageUrl = (pageNumber: number) => {
    const q: string[] = [];
    if (categorySlug) q.push(`category=${categorySlug}`);
    if (postTypeQuery) q.push(`type=${postTypeQuery}`);
    if (searchQuery) q.push(`q=${encodeURIComponent(searchQuery)}`);
    if (stateQuery) q.push(`state=${stateQuery}`);
    q.push(`limit=${limit}`);
    q.push(`page=${pageNumber}`);
    return `/jobs?${q.join("&")}`;
  };

  return (
    <div className="mx-auto max-w-[1280px] w-full px-6 py-10 space-y-8 flex-grow">
      {/* Main Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="text-xs font-semibold text-slate-500 flex gap-2 items-center mb-1.5">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/jobs" className="hover:text-primary transition-colors">Jobs</Link>
            {(stateName || categoryName || typeLabel) && (
              <>
                <span>/</span>
                <span className="text-slate-800 font-bold capitalize">
                  {stateName || categoryName || typeLabel}
                </span>
              </>
            )}
          </nav>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">{titleText}</h1>
          <p className="text-xs text-slate-500 mt-1">Showing {jobs.length} active updates of {totalCount} total verified entries.</p>
        </div>
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors shrink-0 bg-slate-100 hover:bg-slate-200/70 px-4 py-2.5 rounded-xl border border-slate-200/40"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </div>

      {/* Rich Guide Box (Eliminates Thin Content completely) */}
      {guide && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded-full">
              <BookOpen className="h-3.5 w-3.5" /> Sector Overview & Career Guide
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">{guide.title}</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{guide.overview}</p>
          </div>

          {/* Major Boards & Selection Stages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-primary" /> Key Recruiting Bodies & Commissions
              </h3>
              <div className="space-y-2">
                {guide.majorBoards.map((b, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-800">{b.name} <span className="text-[10px] font-normal text-slate-500">({b.fullForm})</span></p>
                    <p className="text-slate-600 text-[11px] mt-0.5">{b.role}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> Eligibility & Domicile Norms
              </h3>
              <ul className="space-y-2 text-slate-600">
                {guide.eligibilityHighlights.map((e, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main Table or Informative Active State */}
      {jobs.length === 0 ? (
        <div className="space-y-8">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-12 text-center shadow-sm max-w-2xl mx-auto space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900">No Current Openings in this Specific Filter</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                All previous recruitment cycles for this category have concluded or new notifications are currently undergoing official editorial verification. Explore active notifications across other sectors below.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/jobs" className="inline-block bg-primary hover:bg-primary/95 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md shadow-primary/10 transition-all cursor-pointer">
                View All Live Job Alerts
              </Link>
            </div>
          </div>

          {/* Related Active Jobs fallback table to prevent empty screen */}
          {fallbackJobs.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Active Government Recruitments Across India
              </h3>
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] text-left border-collapse">
                    <thead>
                      <tr className="text-[11px] font-bold uppercase tracking-wider bg-slate-800 text-white">
                        <th className="px-6 py-4 border border-slate-200">Posted Date</th>
                        <th className="px-6 py-4 border border-slate-200">Exam / Post Name</th>
                        <th className="px-6 py-4 border border-slate-200">Eligibility</th>
                        <th className="px-6 py-4 border border-slate-200">Last Date</th>
                        <th className="px-6 py-4 border border-slate-200 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs sm:text-sm">
                      {fallbackJobs.map((fj) => {
                        let lastDateStr = "N/A";
                        try {
                          const dates = fj.importantDates as any;
                          if (dates && dates.end) lastDateStr = dates.end;
                        } catch(e) {}

                        return (
                          <tr key={fj.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="px-6 py-4 text-slate-400 font-semibold text-xs whitespace-nowrap border border-slate-200">
                              {formatDate(fj.createdAt)}
                            </td>
                            <td className="px-6 py-4 font-semibold text-slate-800 border border-slate-200">
                              <Link href={`/jobs/${fj.slug}`} className="hover:text-primary hover:underline transition-colors block">
                                {fj.title}
                              </Link>
                              <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded mt-1 inline-block">
                                {fj.department.name}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600 border border-slate-200 text-xs">{fj.qualification.name}</td>
                            <td className="px-6 py-4 text-rose-600 font-semibold border border-slate-200 whitespace-nowrap text-xs">{formatDateString(lastDateStr)}</td>
                            <td className="px-6 py-4 text-right whitespace-nowrap border border-slate-200">
                              <Link href={`/jobs/${fj.slug}`} className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1">
                                More Info <ArrowRight className="h-3 w-3" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Standard Jobs List Table */
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <EntriesSelector currentLimit={limit} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left border-collapse">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-wider bg-slate-800 text-white">
                  <th className="px-6 py-4 border border-slate-200">Posted Date</th>
                  <th className="px-6 py-4 border border-slate-200">Notification Title</th>
                  {typeLabel === "Latest Notifications" || !typeLabel ? (
                    <>
                      <th className="px-6 py-4 border border-slate-200">Eligibility</th>
                      <th className="px-6 py-4 border border-slate-200">Total Posts</th>
                      <th className="px-6 py-4 border border-slate-200">Start Date</th>
                      <th className="px-6 py-4 border border-slate-200">Last Date</th>
                    </>
                  ) : null}
                  <th className="px-6 py-4 border border-slate-200 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {jobs.map((job) => {
                  let startDateStr = "N/A";
                  let lastDateStr = "N/A";
                  try {
                    const dates = job.importantDates as any;
                    if (dates && dates.start) {
                      startDateStr = dates.start;
                    }
                    if (dates && dates.end) {
                      lastDateStr = dates.end;
                    }
                  } catch (e) {}

                  return (
                    <tr key={job.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4 text-slate-400 font-semibold text-xs whitespace-nowrap border border-slate-200">
                        {formatDate(job.createdAt)}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700 max-w-xs sm:max-w-md border border-slate-200">
                        <Link href={`/jobs/${job.slug}`} className="hover:text-primary hover:underline transition-colors block font-semibold">
                          {job.title}
                        </Link>
                        <div className="flex gap-2 mt-1 items-center">
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                            {job.category.name}
                          </span>
                          {job.state && (
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                              {job.state.name}
                            </span>
                          )}
                        </div>
                      </td>
                      {typeLabel === "Latest Notifications" || !typeLabel ? (
                        <>
                          <td className="px-6 py-4 text-slate-500 text-xs max-w-[200px] truncate border border-slate-200" title={job.qualification.name}>
                            {job.qualification.name}
                          </td>
                          <td className="px-6 py-4 text-slate-800 font-bold whitespace-nowrap text-xs border border-slate-200">{job.vacancy}</td>
                          <td className="px-6 py-4 text-emerald-600 font-medium border border-slate-200 whitespace-nowrap text-xs">{formatDateString(startDateStr)}</td>
                          <td className="px-6 py-4 text-rose-600 font-medium border border-slate-200 whitespace-nowrap text-xs">{formatDateString(lastDateStr)}</td>
                        </>
                      ) : null}
                      <td className="px-6 py-4 text-right whitespace-nowrap border border-slate-200">
                        <Link 
                          href={`/jobs/${job.slug}`} 
                          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer"
                        >
                          View Details <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalCount > 0 && (
            <div className="bg-slate-50/50 px-6 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
              <div>
                Showing <span className="font-bold text-slate-800">{(currentPage - 1) * limit + 1}</span> – <span className="font-bold text-slate-800">{Math.min(currentPage * limit, totalCount)}</span> of <span className="font-bold text-slate-800">{totalCount}</span> records
              </div>
              {totalPages > 1 && (
                <div className="flex items-center gap-3">
                  <Link 
                    href={currentPage > 1 ? getPageUrl(currentPage - 1) : "#"} 
                    className={`inline-flex items-center justify-center px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-[11px] font-bold transition-all shadow-sm ${
                      currentPage > 1 ? "text-slate-700 hover:bg-slate-50 active:scale-95 cursor-pointer" : "text-slate-300 pointer-events-none"
                    }`}
                  >
                    Prev
                  </Link>
                  <span>
                    Page <span className="font-bold text-slate-700">{currentPage}</span> of <span className="font-bold text-slate-700">{totalPages}</span>
                  </span>
                  <Link 
                    href={currentPage < totalPages ? getPageUrl(currentPage + 1) : "#"} 
                    className={`inline-flex items-center justify-center px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-[11px] font-bold transition-all shadow-sm ${
                      currentPage < totalPages ? "text-slate-700 hover:bg-slate-50 active:scale-95 cursor-pointer" : "text-slate-300 pointer-events-none"
                    }`}
                  >
                    Next
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Guide FAQs if available */}
      {guide && guide.faqs && guide.faqs.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-indigo-500" /> Frequently Asked Questions ({guide.title.split(" - ")[0]})
          </h2>
          <div className="space-y-3">
            {guide.faqs.map((f, idx) => (
              <details key={idx} className="group border border-slate-100 rounded-xl bg-slate-50/50 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex justify-between items-center p-3.5 font-bold text-slate-800 text-xs sm:text-sm cursor-pointer select-none hover:bg-slate-100/50 transition-colors">
                  <span className="flex items-start gap-1.5 pr-4">
                    <span className="text-primary font-extrabold">Q.</span>
                    <span>{f.q}</span>
                  </span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform text-xs">▼</span>
                </summary>
                <div className="px-4 pb-4 pt-1 border-t border-slate-100/50 text-xs sm:text-sm text-slate-600 leading-relaxed pl-8">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
