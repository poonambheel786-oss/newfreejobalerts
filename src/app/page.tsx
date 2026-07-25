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

export default async function Home() {
  // Fetch dynamic notifications, admit cards, and results from Supabase
  const notifications = await prisma.job.findMany({
    where: {
      category: {
        name: {
          notIn: ["Admit Cards", "Results"]
        }
      }
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  const admitCards = await prisma.job.findMany({
    where: {
      category: {
        name: "Admit Cards"
      }
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  const results = await prisma.job.findMany({
    where: {
      category: {
        name: "Results"
      }
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  const consolidatedJobs = await prisma.job.findMany({
    include: {
      department: true,
      category: true,
      state: true,
      qualification: true
    },
    orderBy: { createdAt: "desc" },
    take: 15
  });

  return (
    <div className="flex flex-col flex-grow">
      {/* Breaking News Marquee */}
      <div className="bg-secondary-container text-white py-2 overflow-hidden flex items-center relative z-10 border-b border-secondary">
        <div className="bg-secondary px-6 py-2 absolute left-0 z-20 font-bold text-sm shadow-xl italic">
          BREAKING NEWS
        </div>
        <div className="marquee-content whitespace-nowrap flex items-center gap-8 pl-40">
          <span className="text-sm font-medium">• Welcome to NewFreeJobAlert. Access real-time government recruitment updates.</span>
          <span className="text-sm font-medium">• Civil Services Examination 2026 results released today. Check the "Results" section for the merit list.</span>
          <span className="text-sm font-medium">• New vacancies for Senior Technical Officers at NITI Aayog. Application window opens tomorrow.</span>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto w-full px-6 py-8 flex-grow space-y-12">
        {/* Public Hero Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-extrabold text-3xl md:text-5xl text-on-surface mb-2 tracking-tight">Government Job Portal</h1>
            <p className="text-base text-on-surface-variant max-w-2xl">
              Access real-time recruitment notifications, official admit cards, and merit lists from all government departments in one place.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="relative w-full md:w-80">
              <input 
                type="text" 
                placeholder="Search exams or posts..." 
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-sm transition-all"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline flex items-center">
                <SearchIcon className="h-5 w-5" />
              </span>
            </div>
          </div>
        </div>

        {/* Simplified Home Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Latest Notifications */}
          <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col h-full border border-outline-variant/20 hover:shadow-md transition-shadow">
            <div className="p-6 bg-primary-container text-white flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-lg">Latest Notifications</h2>
                <Link className="text-[12px] font-bold text-white/90 hover:underline flex items-center gap-1 mt-1" href="/jobs">
                  Exam Dashboard <ArrowForwardIcon className="h-3 w-3" />
                </Link>
              </div>
              <CampaignIcon className="h-6 w-6 opacity-80" />
            </div>
            <div className="p-0 flex-grow divide-y divide-outline-variant/10">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 font-medium">No active notifications. Add via Control Panel.</div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="p-4 hover:bg-surface-container-low transition-colors group">
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-[10px] font-bold text-secondary-container px-2 py-0.5 bg-secondary-container/10 rounded-full uppercase">
                        {n.category.name}
                      </span>
                      <span className="text-xs text-outline italic ml-auto">{formatDate(n.createdAt)}</span>
                    </div>
                    <Link className="font-semibold text-sm text-on-surface hover:text-primary transition-colors block" href={`/jobs/${n.slug}`}>
                      {n.title}
                    </Link>
                    <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{n.eligibility}</p>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-outline-variant/10">
              <Link href="/jobs" className="w-full text-primary font-bold text-sm flex items-center justify-center gap-2 hover:underline">
                View Full List
                <ArrowForwardIcon className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* Admit Cards */}
          <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col h-full border border-outline-variant/20 hover:shadow-md transition-shadow">
            <div className="p-6 bg-surface-container-high text-primary flex justify-between items-center border-b border-outline-variant/10">
              <div>
                <h2 className="font-semibold text-lg text-primary">Admit Cards</h2>
                <Link className="text-[12px] font-bold text-primary/80 hover:underline flex items-center gap-1 mt-1" href="/jobs">
                  Exam Dashboard <ArrowForwardIcon className="h-3 w-3" />
                </Link>
              </div>
              <AssignmentIndIcon className="h-6 w-6 opacity-80" />
            </div>
            <div className="p-0 flex-grow divide-y divide-outline-variant/10">
              {admitCards.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 font-medium">No active admit cards. Add via Control Panel.</div>
              ) : (
                admitCards.map((ac) => (
                  <div key={ac.id} className="p-4 hover:bg-surface-container-low transition-colors">
                    <Link className="font-semibold text-sm text-on-surface hover:text-primary transition-colors block mb-2" href={`/jobs/${ac.slug}`}>
                      {ac.title}
                    </Link>
                    <div className="flex items-center gap-2">
                      <div className="bg-secondary-container/10 p-1.5 rounded-lg text-secondary-container">
                        <DownloadIcon className="h-4 w-4" />
                      </div>
                      <p className="text-xs text-on-surface-variant font-medium">Click to check details & download hall ticket</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-outline-variant/10">
              <Link href="/jobs" className="w-full text-primary font-bold text-sm flex items-center justify-center gap-2 hover:underline">
                View All Hall Tickets
              </Link>
            </div>
          </section>

          {/* Results */}
          <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col h-full border border-outline-variant/20 hover:shadow-md transition-shadow">
            <div className="p-6 bg-surface-container-high text-on-surface flex justify-between items-center border-b border-outline-variant/10">
              <div>
                <h2 className="font-semibold text-lg">Results</h2>
                <Link className="text-[12px] font-bold text-on-surface/70 hover:underline flex items-center gap-1 mt-1" href="/jobs">
                  Exam Dashboard <ArrowForwardIcon className="h-3 w-3" />
                </Link>
              </div>
              <VerifiedIcon className="h-6 w-6 opacity-80 text-primary" />
            </div>
            <div className="p-0 flex-grow divide-y divide-outline-variant/10">
              {results.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 font-medium">No active results declared. Add via Control Panel.</div>
              ) : (
                results.map((r) => (
                  <div key={r.id} className="p-4 hover:bg-surface-container-low transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="text-[10px] font-bold uppercase text-emerald-600">
                        Released
                      </span>
                    </div>
                    <Link className="font-semibold text-sm text-on-surface hover:text-primary transition-colors block" href={`/jobs/${r.slug}`}>
                      {r.title}
                    </Link>
                    <p className="text-xs text-on-surface-variant mt-1">Merit list and scorecard link active.</p>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-outline-variant/10">
              <Link href="/jobs" className="w-full text-primary font-bold text-sm flex items-center justify-center gap-2 hover:underline">
                Check Merit Lists
              </Link>
            </div>
          </section>
        </div>

        {/* Detailed View Table */}
        <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/30">
            <h2 className="font-semibold text-lg text-on-surface">Consolidated Recruitment View</h2>
            <div className="flex gap-2">
              <button className="p-2 border border-outline-variant rounded-lg hover:bg-white hover:text-primary transition-colors flex items-center">
                <FilterIcon className="h-4 w-4" />
              </button>
            </div>
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
                          <Link className="text-primary font-bold hover:underline" href={`/jobs/${tj.slug}`}>More Info</Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

// Simple fallback SVG search icon
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
    </svg>
  );
}
