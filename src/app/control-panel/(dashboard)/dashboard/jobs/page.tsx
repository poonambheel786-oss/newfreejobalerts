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

  let typeFilter: any = { postType: postType };
  if (postType === "Admit Cards") {
    typeFilter = {
      OR: [
        { postType: "Admit Cards" },
        { AND: [{ admitCardLink: { not: null } }, { admitCardLink: { not: "" } }] }
      ]
    };
  } else if (postType === "Results") {
    typeFilter = {
      OR: [
        { postType: "Results" },
        { AND: [{ resultLink: { not: null } }, { resultLink: { not: "" } }] }
      ]
    };
  }

  const whereClause: any = {
    ...typeFilter,
    ...(searchQuery ? {
      OR: [
        { title: { contains: searchQuery, mode: 'insensitive' as const } },
        { department: { name: { contains: searchQuery, mode: 'insensitive' as const } } }
      ]
    } : {})
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
    <div className="space-y-6 animate-fade-in text-slate-900">
      {/* Top Breadcrumb & Heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Link href="/control-panel/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">{postType}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Manage {postType}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Total entries in this category: <span className="font-bold text-blue-600">{totalJobs}</span>
          </p>
        </div>

        <Link
          href={`/control-panel/jobs/new?type=${encodeURIComponent(postType)}`}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/10 flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add New Entry
        </Link>
      </div>

      {dbError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center gap-2 text-xs font-semibold">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          Failed to connect to the database. Please try again.
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <EntriesSelector currentLimit={limit} />

          {/* Search Bar Input */}
          <form method="GET" action="/control-panel/dashboard/jobs" className="flex items-center gap-2 w-full sm:w-auto">
            <input type="hidden" name="type" value={postType} />
            <input type="hidden" name="limit" value={limit} />
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </span>
              <input 
                type="text" 
                name="search" 
                defaultValue={search} 
                placeholder="Search by Title or Board..." 
                className="w-full h-10 pl-9 pr-4 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition-all shadow-xs"
              />
            </div>
            {search && (
              <Link 
                href={`/control-panel/dashboard/jobs?type=${encodeURIComponent(postType)}&limit=${limit}`}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-2 py-1 transition-colors"
              >
                Clear
              </Link>
            )}
          </form>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Title / Heading</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">State</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs text-slate-400 font-bold">
                    No entries found matching parameters.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 max-w-md">
                        <span className="truncate font-bold text-slate-900" title={job.title}>
                          {job.title}
                        </span>
                        {job.admitCardLink && (
                          <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                            Admit Card
                          </span>
                        )}
                        {job.resultLink && (
                          <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Result
                          </span>
                        )}
                      </div>
                      {job.department && (
                        <div className="text-[10px] text-slate-500 mt-0.5 font-semibold">
                          {job.department.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700 border border-blue-200/60">
                        {job.category?.name || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600 font-medium">
                        {job.state?.name || "All India"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${
                        job.status === "Published"
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                          : job.status === "Draft"
                          ? "bg-amber-50 text-amber-700 ring-amber-600/20"
                          : "bg-slate-100 text-slate-700 ring-slate-200"
                      }`}>
                        {job.status || "Published"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {formatDate(job.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link 
                        href={`/control-panel/jobs/edit/${job.id}`} 
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
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
          <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-500">
              Showing <span className="font-bold text-slate-800">{(currentPage - 1) * limit + 1}</span> – <span className="font-bold text-slate-800">{Math.min(currentPage * limit, totalJobs)}</span> of <span className="font-bold text-slate-800">{totalJobs}</span> records
            </span>

            {totalPages > 1 && (
              <div className="flex items-center gap-3">
                <Link
                  href={currentPage > 1 ? `/control-panel/dashboard/jobs?type=${encodeURIComponent(postType)}&page=${currentPage - 1}&limit=${limit}&search=${encodeURIComponent(search)}` : "#"}
                  className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 border border-slate-200 bg-white text-slate-700 rounded-lg shadow-2xs transition-colors cursor-pointer ${
                    currentPage > 1 ? "hover:bg-slate-100 text-slate-900" : "text-slate-300 pointer-events-none border-slate-100"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Link>
                
                <span className="text-xs font-semibold text-slate-500">
                  Page <span className="font-bold text-slate-800">{currentPage}</span> of <span className="font-bold text-slate-800">{totalPages}</span>
                </span>

                <Link
                  href={currentPage < totalPages ? `/control-panel/dashboard/jobs?type=${encodeURIComponent(postType)}&page=${currentPage + 1}&limit=${limit}&search=${encodeURIComponent(search)}` : "#"}
                  className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 border border-slate-200 bg-white text-slate-700 rounded-lg shadow-2xs transition-colors cursor-pointer ${
                    currentPage < totalPages ? "hover:bg-slate-100 text-slate-900" : "text-slate-300 pointer-events-none border-slate-100"
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
