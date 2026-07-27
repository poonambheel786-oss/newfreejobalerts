import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ArrowLeft, ArrowRight, ClipboardList } from "lucide-react";

export const revalidate = 3600;

interface Props {
  searchParams: Promise<{
    category?: string;
    type?: string;
    page?: string;
    q?: string;
    state?: string;
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

export default async function JobsListingPage({ searchParams }: Props) {
  const params = await searchParams;
  const categorySlug = params.category;
  const postTypeQuery = params.type;
  const searchQuery = params.q;
  const stateQuery = params.state;
  const currentPage = parseInt(params.page || "1") || 1;
  const limit = 15;
  const skip = (currentPage - 1) * limit;

  // Build filter
  const whereClause: any = {};

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
  let totalCount = 0;
  let categoryName = "";
  let typeLabel = "";

  try {
    jobs = await prisma.job.findMany({
      where: whereClause,
      include: {
        category: true,
        state: true,
        department: true,
        qualification: true
      },
      orderBy: {
        createdAt: "desc"
      },
      skip,
      take: limit
    });

    totalCount = await prisma.job.count({
      where: whereClause
    });

    if (categorySlug && jobs.length > 0) {
      categoryName = jobs[0].category.name;
    } else if (categorySlug) {
      // Fetch category name if list is empty
      const dbCat = await prisma.category.findUnique({
        where: { slug: categorySlug }
      });
      categoryName = dbCat?.name || categorySlug.replace(/-/g, " ");
    }

    if (postTypeQuery) {
      if (postTypeQuery === "latest-notifications") typeLabel = "Latest Notifications";
      else if (postTypeQuery === "admit-cards") typeLabel = "Admit Cards";
      else if (postTypeQuery === "results") typeLabel = "Results";
    }
  } catch (e) {
    console.error("Failed to load listings:", e);
  }

  // Fetch state name if state query is active
  let stateName = "";
  if (stateQuery) {
    try {
      const dbState = await prisma.state.findUnique({
        where: { slug: stateQuery }
      });
      stateName = dbState?.name || stateQuery.replace(/-/g, " ");
    } catch (e) {
      stateName = stateQuery.replace(/-/g, " ");
    }
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
          : "All Notifications & Updates";

  // Build pagination query helper
  const getPageUrl = (pageNumber: number) => {
    const q: string[] = [];
    if (categorySlug) q.push(`category=${categorySlug}`);
    if (postTypeQuery) q.push(`type=${postTypeQuery}`);
    if (searchQuery) q.push(`q=${encodeURIComponent(searchQuery)}`);
    if (stateQuery) q.push(`state=${stateQuery}`);
    q.push(`page=${pageNumber}`);
    return `/jobs?${q.join("&")}`;
  };

  return (
    <div className="mx-auto max-w-[1280px] w-full px-6 py-10 space-y-8 flex-grow">
      {/* Main Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">{titleText}</h1>
          <p className="text-xs text-slate-500 mt-1">Showing {jobs.length} updates of {totalCount} total entries.</p>
        </div>
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors shrink-0 bg-slate-100 hover:bg-slate-200/70 px-4 py-2.5 rounded-xl border border-slate-200/40"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </div>

      {jobs.length === 0 ? (
        /* Coming Soon premium state */
        <div className="bg-white border border-slate-200/80 rounded-2xl p-16 text-center shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary">
            <ClipboardList className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 font-black">Coming Soon!</h2>
            <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed font-semibold">
              We are currently gathering and updating new records for this section. Please check back shortly for official notifications.
            </p>
          </div>
          <Link href="/" className="inline-block bg-primary hover:bg-primary/95 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md shadow-primary/10 transition-all cursor-pointer">
            Return to Home
          </Link>
        </div>
      ) : (
        /* Jobs List Table */
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-4 bg-slate-800 text-white border border-slate-200">Posted Date</th>
                  {(typeLabel === "Latest Notifications" || !typeLabel) && (
                    <th className="px-6 py-4 bg-slate-800 text-white border border-slate-200">Organization / Department</th>
                  )}
                  <th className="px-6 py-4 bg-slate-800 text-white border border-slate-200">Notification Title</th>
                  {typeLabel === "Latest Notifications" || !typeLabel ? (
                    <>
                      <th className="px-6 py-4 bg-slate-800 text-white border border-slate-200">Eligibility</th>
                      <th className="px-6 py-4 bg-slate-800 text-white border border-slate-200">Total Posts</th>
                    </>
                  ) : null}
                  <th className="px-6 py-4 bg-slate-800 text-white border border-slate-200 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 text-slate-400 font-semibold text-xs whitespace-nowrap border border-slate-200">
                      {formatDate(job.createdAt)}
                    </td>
                    {(typeLabel === "Latest Notifications" || !typeLabel) && (
                      <td className="px-6 py-4 font-bold text-slate-900 border border-slate-200">
                        <Link href={`/jobs/${job.slug}`} className="hover:text-primary hover:underline transition-colors block">
                          {job.department.name}
                        </Link>
                      </td>
                    )}
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-slate-50/50 px-6 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
              <div>
                Showing <span className="font-bold text-slate-800">{(currentPage - 1) * limit + 1}</span> – <span className="font-bold text-slate-800">{Math.min(currentPage * limit, totalCount)}</span> of <span className="font-bold text-slate-800">{totalCount}</span> records
              </div>
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
