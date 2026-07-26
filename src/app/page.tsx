import Link from "next/link";
import { CampaignIcon, AssignmentIndIcon, VerifiedIcon, DownloadIcon, ArrowForwardIcon, FilterIcon } from "./icons";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

// Helper to format date
function formatDate(date: Date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

interface Props {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1") || 1;
  const limit = 15;
  const skip = (currentPage - 1) * limit;

  let notifications: any[] = [];
  let admitCards: any[] = [];
  let results: any[] = [];
  let consolidatedJobs: any[] = [];
  let marqueeJobs: any[] = [];
  let totalJobs = 0;
  let dbError = false;

  try {
    // 1. Fetch Marquee updates (Latest Notifications)
    marqueeJobs = await prisma.job.findMany({
      where: {
        postType: "Latest Notifications"
      },
      orderBy: { createdAt: "desc" },
      take: 6
    });

    // 2. Fetch Latest Notifications for Column Card
    notifications = await prisma.job.findMany({
      where: {
        postType: "Latest Notifications"
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 5
    });

    // 3. Fetch Admit Cards for Column Card
    admitCards = await prisma.job.findMany({
      where: {
        postType: "Admit Cards"
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 5
    });

    // 4. Fetch Results for Column Card
    results = await prisma.job.findMany({
      where: {
        postType: "Results"
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 5
    });

    // 5. Fetch consolidated jobs (Jobs only, excluding Admit Cards & Results) with pagination
    consolidatedJobs = await prisma.job.findMany({
      where: {
        postType: "Latest Notifications"
      },
      include: {
        department: true,
        category: true,
        state: true,
        qualification: true
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    });

    totalJobs = await prisma.job.count({
      where: {
        postType: "Latest Notifications"
      }
    });
  } catch (e) {
    console.error("Database connection failed:", e);
    dbError = true;
  }

  const totalPages = Math.ceil(totalJobs / limit);

  return (
    <div className="flex flex-col flex-grow animate-fade-in">
      {/* Dynamic Marquee */}
      <div className="bg-secondary-container text-white py-2 overflow-hidden flex items-center relative z-10 border-b border-secondary">
        <div className="bg-secondary px-6 py-2 absolute left-0 z-20 font-bold text-sm shadow-xl italic whitespace-nowrap">
          New Vacancies
        </div>
        <div className="marquee-content whitespace-nowrap flex items-center gap-8 pl-44">
          {marqueeJobs.length === 0 ? (
            <span className="text-sm font-medium">• Welcome to NewFreeJobAlert. Access real-time government recruitment updates.</span>
          ) : (
            marqueeJobs.map((j) => (
              <Link key={j.id} href={`/jobs/${j.slug}`} className="text-sm font-bold text-white hover:underline flex items-center gap-1 cursor-pointer">
                • {j.title} (Apply Details)
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto w-full px-6 py-8 flex-grow space-y-12">
        {/* Public Hero Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-extrabold text-3xl md:text-5xl text-on-surface mb-2 tracking-tight">Best Job Portal</h1>
            <p className="text-base text-on-surface-variant max-w-2xl">
              Access real-time recruitment notifications, official admit cards, and merit lists from all government departments in one place.
            </p>
          </div>
        </div>

        {dbError && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
            ⚠️ The connection to your Supabase database failed. Please verify that the DATABASE_URL environment variable has been correctly configured under "Environment Variables" in your Vercel Project Settings.
          </div>
        )}

        {/* Simplified Home Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Latest Notifications */}
          <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col h-full border border-outline-variant/20 hover:shadow-md transition-shadow">
            <div className="p-5 bg-blue-600 text-white flex justify-between items-center">
              <h2 className="font-bold text-base">Latest Notifications</h2>
            </div>
            <div className="p-0 flex-grow divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 font-medium">No active notifications. Add via Control Panel.</div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                    <Link className="font-bold text-sm text-blue-600 hover:text-blue-800 hover:underline block leading-snug" href={`/jobs/${n.slug}`}>
                      {n.title}
                    </Link>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-slate-100">
              <Link href="/jobs?type=latest-notifications" className="w-full text-primary font-bold text-xs flex items-center justify-center gap-1 hover:underline cursor-pointer">
                View Notification List
                <ArrowForwardIcon className="h-3 w-3" />
              </Link>
            </div>
          </section>

          {/* Admit Cards */}
          <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col h-full border border-outline-variant/20 hover:shadow-md transition-shadow">
            <div className="p-5 bg-amber-500 text-white flex justify-between items-center">
              <h2 className="font-bold text-base">Admit Cards</h2>
            </div>
            <div className="p-0 flex-grow divide-y divide-slate-100">
              {admitCards.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 font-medium">No active admit cards. Add via Control Panel.</div>
              ) : (
                admitCards.map((ac) => (
                  <div key={ac.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                    <Link className="font-bold text-sm text-blue-600 hover:text-blue-800 hover:underline block leading-snug" href={`/jobs/${ac.slug}`}>
                      {ac.title}
                    </Link>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-slate-100">
              <Link href="/jobs?type=admit-cards" className="w-full text-primary font-bold text-xs flex items-center justify-center gap-1 hover:underline cursor-pointer">
                View admit Card List
              </Link>
            </div>
          </section>

          {/* Results */}
          <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col h-full border border-outline-variant/20 hover:shadow-md transition-shadow">
            <div className="p-5 bg-emerald-600 text-white flex justify-between items-center">
              <h2 className="font-bold text-base">Results</h2>
            </div>
            <div className="p-0 flex-grow divide-y divide-slate-100">
              {results.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 font-medium">No active results declared. Add via Control Panel.</div>
              ) : (
                results.map((r) => (
                  <div key={r.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                    <Link className="font-bold text-sm text-blue-600 hover:text-blue-800 hover:underline block leading-snug" href={`/jobs/${r.slug}`}>
                      {r.title}
                    </Link>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-slate-100">
              <Link href="/jobs?type=results" className="w-full text-primary font-bold text-xs flex items-center justify-center gap-1 hover:underline cursor-pointer">
                View Result List
              </Link>
            </div>
          </section>
        </div>

        {/* Detailed View Table (Only contains Jobs) */}
        <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/30">
            <h2 className="font-semibold text-lg text-on-surface">One View All Recruitment</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                  <th className="px-6 py-4 border-b border-outline-variant/20">Post Date</th>
                  <th className="px-6 py-4 border-b border-outline-variant/20">Recruitment Board</th>
                  <th className="px-6 py-4 border-b border-outline-variant/20">Exam / Post Name</th>
                  <th className="px-6 py-4 border-b border-outline-variant/20">Qualification</th>
                  <th className="px-6 py-4 border-b border-outline-variant/20">Advt No</th>
                  <th className="px-6 py-4 border-b border-outline-variant/20">Last Date</th>
                  <th className="px-6 py-4 border-b border-outline-variant/20 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-xs sm:text-sm">
                {consolidatedJobs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-xs text-slate-400 font-bold">
                      No recruitment notices found in the database.
                    </td>
                  </tr>
                ) : (
                  consolidatedJobs.map((tj, i) => {
                    let lastDateStr = "N/A";
                    try {
                      const dates = tj.importantDates as any;
                      if (dates && dates.end) {
                        lastDateStr = dates.end;
                      }
                    } catch (e) {}

                    return (
                      <tr key={i} className="hover:bg-primary-container/5 transition-colors">
                        <td className="px-6 py-4 text-on-surface-variant">{formatDate(tj.createdAt)}</td>
                        <td className="px-6 py-4 font-bold text-on-surface">{tj.department.name}</td>
                        <td className="px-6 py-4">{tj.title}</td>
                        <td className="px-6 py-4">{tj.qualification.name}</td>
                        <td className="px-6 py-4 text-outline">{tj.advtNumber || "N/A"}</td>
                        <td className="px-6 py-4 text-rose-600 font-medium">{lastDateStr}</td>
                        <td className="px-6 py-4 text-center">
                          <Link className="text-primary font-bold hover:underline cursor-pointer" href={`/jobs/${tj.slug}`}>More Info</Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          {totalPages > 1 && (
            <div className="bg-slate-50/50 px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between">
              <Link 
                href={currentPage > 1 ? `/?page=${currentPage - 1}` : "#"} 
                className={`text-xs font-bold px-3 py-2 border border-slate-200 bg-white rounded-lg transition-colors cursor-pointer ${
                  currentPage > 1 ? "text-slate-700 hover:bg-slate-50" : "text-slate-300 pointer-events-none"
                }`}
              >
                Previous
              </Link>
              <span className="text-xs font-semibold text-slate-500">
                Page {currentPage} of {totalPages}
              </span>
              <Link 
                href={currentPage < totalPages ? `/?page=${currentPage + 1}` : "#"} 
                className={`text-xs font-bold px-3 py-2 border border-slate-200 bg-white rounded-lg transition-colors cursor-pointer ${
                  currentPage < totalPages ? "text-slate-700 hover:bg-slate-50" : "text-slate-300 pointer-events-none"
                }`}
              >
                Next
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
