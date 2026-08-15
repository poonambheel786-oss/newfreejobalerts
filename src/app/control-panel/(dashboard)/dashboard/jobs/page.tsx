import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ArrowLeft, Edit, AlertCircle, ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import EntriesSelector from "@/components/EntriesSelector";

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{
    type?: string;
    page?: string;
    limit?: string;
    search?: string;
  }>;
}

export default async function AdminJobsPage({ searchParams }: Props) {
  const params = await searchParams;
  const postType = params.type || "Latest Notifications";
  const currentPage = parseInt(params.page || "1") || 1;
  const limit = parseInt(params.limit || "10") || 10;
  const search = params.search || "";
  const skip = (currentPage - 1) * limit;

  let jobs: any[] = [];
  let totalJobs = 0;
  let dbError = false;

  const searchQuery = search.trim();

  const whereClause = {
    postType: postType,
    OR: searchQuery ? [
      { title: { contains: searchQuery, mode: 'insensitive' as const } },
      { department: { name: { contains: searchQuery, mode: 'insensitive' as const } } }
    ] : undefined
  };

  try {
    jobs = await prisma.job.findMany({
      where: whereClause,
      include: {
        department: true,
        category: true,
        state: true
      },
      orderBy: {
        createdAt: "desc"
      },
      skip,
      take: limit
    });

    totalJobs = await prisma.job.count({
      where: whereClause
    });
  } catch (e) {
    console.error("Failed to fetch admin jobs list:", e);
    dbError = true;
  }

  const totalPages = Math.ceil(totalJobs / limit);

  // Helper to format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Top Breadcrumb & Heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Link href="/control-panel/dashboard" className="hover:text-violet-400 transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-slate-200">{postType}</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            Manage {postType}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Total entries in this category: <span className="font-bold text-violet-400">{totalJobs}</span>
          </p>
        </div>

        <Link
          href={`/control-panel/jobs/new?type=${encodeURIComponent(postType)}`}
          className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-violet-600/10 flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add New Entry
        </Link>
      </div>

      {dbError && (
        <div className="bg-rose-955/40 border border-rose-900/50 text-rose-300 p-4 rounded-xl flex items-center gap-2 text-xs font-semibold">
          <AlertCircle className="h-4 w-4 text-rose-455 shrink-0" />
          Failed to connect to the database. Please try again.
        </div>
      )}

      {/* Main Table */}
      <div className="bg-slate-900 border border-slate-800/90 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/30">
          <EntriesSelector currentLimit={limit} />

          {/* Search Bar Input */}
          <form method="GET" action="/control-panel/dashboard/jobs" className="flex items-center gap-2 w-full sm:w-auto">
            <input type="hidden" name="type" value={postType} />
            <input type="hidden" name="limit" value={limit} />
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-slate-500" />
              </span>
              <input 
                type="text" 
                name="search" 
                defaultValue={search} 
                placeholder="Search by Title or Board..." 
                className="w-full h-10 pl-9 pr-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:border-violet-600 focus:outline-none transition-all"
              />
            </div>
            {search && (
              <Link 
                href={`/control-panel/dashboard/jobs?type=${encodeURIComponent(postType)}&limit=${limit}`}
                className="text-xs font-semibold text-slate-400 hover:text-white px-2 py-1 transition-colors"
              >
                Clear
              </Link>
            )}
          </form>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-955/50 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Title / Heading</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">State</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs text-slate-300">
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs text-slate-500 font-bold">
                    No entries found matching parameters.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="max-w-md truncate font-bold text-white" title={job.title}>
                        {job.title}
                      </div>
                      {job.department && (
                        <div className="text-[10px] text-slate-500 mt-0.5 font-semibold">
                          {job.department.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-slate-950 px-2 py-1 text-[10px] font-semibold text-slate-400 border border-slate-800/80">
                        {job.category?.name || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-400 font-medium">
                        {job.state?.name || "All India"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${
                        job.status === "Published"
                          ? "bg-emerald-950/50 text-emerald-400 ring-emerald-900/20"
                          : job.status === "Draft"
                          ? "bg-amber-955/50 text-amber-450 ring-amber-900/20"
                          : "bg-slate-955 text-slate-400 ring-slate-800"
                      }`}>
                        {job.status || "Published"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-medium">
                      {formatDate(job.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link 
                        href={`/control-panel/jobs/edit/${job.id}`} 
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-400 hover:text-violet-300 hover:underline cursor-pointer"
                      >
                        <Edit className="h-3 w-3" /> Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {totalJobs > 0 && (
          <div className="bg-slate-950/20 px-6 py-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-500">
              Showing <span className="font-bold text-slate-300">{(currentPage - 1) * limit + 1}</span> – <span className="font-bold text-slate-300">{Math.min(currentPage * limit, totalJobs)}</span> of <span className="font-bold text-slate-300">{totalJobs}</span> records
            </span>

            {totalPages > 1 && (
              <div className="flex items-center gap-4">
                <Link
                  href={currentPage > 1 ? `/control-panel/dashboard/jobs?type=${encodeURIComponent(postType)}&page=${currentPage - 1}&limit=${limit}&search=${encodeURIComponent(search)}` : "#"}
                  className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-2 border border-slate-800 bg-slate-950 text-slate-300 rounded-lg transition-colors cursor-pointer ${
                    currentPage > 1 ? "hover:bg-slate-800 text-slate-200" : "text-slate-600 pointer-events-none"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Link>
                
                <span className="text-xs font-semibold text-slate-500">
                  Page {currentPage} of {totalPages}
                </span>

                <Link
                  href={currentPage < totalPages ? `/control-panel/dashboard/jobs?type=${encodeURIComponent(postType)}&page=${currentPage + 1}&limit=${limit}&search=${encodeURIComponent(search)}` : "#"}
                  className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-2 border border-slate-800 bg-slate-950 text-slate-300 rounded-lg transition-colors cursor-pointer ${
                    currentPage < totalPages ? "hover:bg-slate-800 text-slate-200" : "text-slate-600 pointer-events-none"
                  }`}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
