import Link from "next/link";
import { CampaignIcon, AssignmentIndIcon, VerifiedIcon, DownloadIcon, ArrowForwardIcon, FilterIcon } from "@/app/icons";
import { prisma } from "@/lib/db";
import { Search, BookOpen, Clock, User, ArrowRight } from "lucide-react";
import { unstable_cache } from "next/cache";
import EntriesSelector from "@/components/EntriesSelector";

export const revalidate = 300; // Cache page for 5 minutes

// Helper to format date
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
      const day = parseInt(parts[2], 10);
      const months = [
        "Jan", "Feb", "March", "April", "May", "June",
        "July", "Aug", "Sept", "Oct", "Nov", "Dec"
      ];
      if (monthIndex >= 0 && monthIndex < 12) {
        return `${day} ${months[monthIndex]} ${year}`;
      }
    }
    return dateStr;
  } catch (e) {
    return dateStr;
  }
}

const getCachedHomeData = unstable_cache(
  async (currentPage: number, limit: number) => {
    const skip = (currentPage - 1) * limit;

    const [
      latestNotifs,
      latestAdmitCards,
      latestResults,
      notifications,
      admitCards,
      results,
      consolidatedJobs,
      totalJobs,
      latestBlogPosts
    ] = await Promise.all([
      prisma.job.findMany({
        where: { postType: "Latest Notifications", status: "Published" },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: { id: true, title: true, slug: true, createdAt: true }
      }),
      prisma.job.findMany({
        where: { postType: "Admit Cards", status: "Published" },
        orderBy: { createdAt: "desc" },
        take: 2,
        select: { id: true, title: true, slug: true, createdAt: true }
      }),
      prisma.job.findMany({
        where: { postType: "Results", status: "Published" },
        orderBy: { createdAt: "desc" },
        take: 2,
        select: { id: true, title: true, slug: true, createdAt: true }
      }),
      prisma.job.findMany({
        where: { postType: "Latest Notifications", status: "Published" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, title: true, slug: true, category: { select: { name: true } } }
      }),
      prisma.job.findMany({
        where: { postType: "Admit Cards", status: "Published" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, title: true, slug: true, category: { select: { name: true } } }
      }),
      prisma.job.findMany({
        where: { postType: "Results", status: "Published" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, title: true, slug: true, category: { select: { name: true } } }
      }),
      prisma.job.findMany({
        where: { postType: "Latest Notifications", status: "Published" },
        select: {
          id: true,
          title: true,
          slug: true,
          createdAt: true,
          importantDates: true,
          advtNumber: true,
          vacancy: true,
          department: { select: { name: true } },
          qualification: { select: { name: true } }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.job.count({
        where: { postType: "Latest Notifications", status: "Published" }
      }),
      prisma.blogPost.findMany({
        orderBy: { date: "desc" },
        take: 3,
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          category: true,
          readTime: true,
          date: true,
          author: true
        }
      })
    ]);

    const marqueeJobs = [...latestNotifs, ...latestAdmitCards, ...latestResults].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      marqueeJobs,
      notifications,
      admitCards,
      results,
      consolidatedJobs,
      totalJobs,
      latestBlogPosts
    };
  },
  ["homepage-data"],
  { revalidate: 300, tags: ["homepage"] }
);

interface Props {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1") || 1;
  const limit = parseInt(params.limit || "15") || 15;

  let notifications: any[] = [];
  let admitCards: any[] = [];
  let results: any[] = [];
  let consolidatedJobs: any[] = [];
  let marqueeJobs: any[] = [];
  let latestBlogPosts: any[] = [];
  let totalJobs = 0;
  let dbError = false;

  try {
    const data = await getCachedHomeData(currentPage, limit);
    notifications = data.notifications;
    admitCards = data.admitCards;
    results = data.results;
    consolidatedJobs = data.consolidatedJobs;
    marqueeJobs = data.marqueeJobs;
    latestBlogPosts = data.latestBlogPosts || [];
    totalJobs = data.totalJobs;
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
          Latest Updates
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
          {/* Search bar */}
          <div className="w-full md:w-80 shrink-0">
            <form action="/jobs" method="GET" className="relative flex items-center">
              <input
                type="text"
                name="q"
                placeholder="Search jobs, admit cards, results..."
                className="w-full h-12 pl-4 pr-12 rounded-2xl border border-outline-variant/30 bg-white text-sm focus:border-primary focus:outline-none shadow-sm transition-all focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="absolute right-2 p-2 bg-primary hover:bg-primary/95 text-white rounded-xl shadow-md shadow-primary/10 transition-all cursor-pointer"
                title="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
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
            <h2 className="font-semibold text-lg text-on-surface">Recruitment Dashboard</h2>
            <EntriesSelector currentLimit={limit} />
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[1000px] text-left border-collapse table-fixed">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-wider bg-slate-800 text-white">
                  <th className="px-6 py-4 border border-slate-200 whitespace-nowrap w-[10%]">Post Date</th>
                  <th className="px-6 py-4 border border-slate-200 whitespace-nowrap w-[35%] min-w-[320px]">Exam / Post Name</th>
                  <th className="px-6 py-4 border border-slate-200 whitespace-nowrap w-[20%] min-w-[160px]">Qualification</th>
                  <th className="px-6 py-4 border border-slate-200 whitespace-nowrap w-[15%]">Advt No</th>
                  <th className="px-6 py-4 border border-slate-200 whitespace-nowrap w-[10%]">Start Date</th>
                  <th className="px-6 py-4 border border-slate-200 whitespace-nowrap w-[10%]">Last Date</th>
                  <th className="px-6 py-4 border border-slate-200 whitespace-nowrap text-center w-[10%]">Action</th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm">
                {consolidatedJobs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-xs text-slate-400 font-bold border border-slate-200">
                      No recruitment notices found in the database.
                    </td>
                  </tr>
                ) : (
                  consolidatedJobs.map((tj, i) => {
                    let startDateStr = "N/A";
                    let lastDateStr = "N/A";
                    try {
                      const dates = tj.importantDates as any;
                      if (dates && dates.start) {
                        startDateStr = dates.start;
                      }
                      if (dates && dates.end) {
                        lastDateStr = dates.end;
                      }
                    } catch (e) {}
 
                    return (
                      <tr key={i} className="hover:bg-primary-container/5 transition-colors">
                        <td className="px-6 py-4 text-on-surface-variant border border-slate-200 whitespace-nowrap">{formatDate(tj.createdAt)}</td>
                        <td className="px-6 py-4 border border-slate-200 font-semibold text-slate-800 break-words">
                          <Link href={`/jobs/${tj.slug}`} className="hover:text-primary hover:underline transition-colors block leading-snug">{tj.title}</Link>
                        </td>
                        <td className="px-6 py-4 border border-slate-200 break-words text-slate-600 font-medium" title={tj.qualification.name}>{tj.qualification.name}</td>
                        <td className="px-6 py-4 text-outline border border-slate-200 break-all">{tj.advtNumber || "N/A"}</td>
                        <td className="px-6 py-4 text-emerald-600 font-semibold border border-slate-200 whitespace-nowrap">{formatDateString(startDateStr)}</td>
                        <td className="px-6 py-4 text-rose-600 font-semibold border border-slate-200 whitespace-nowrap">{formatDateString(lastDateStr)}</td>
                        <td className="px-6 py-4 text-center border border-slate-200">
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
          {totalJobs > 0 && (
            <div className="bg-slate-50/50 px-6 py-4 border-t border-outline-variant/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
              <div>
                Showing <span className="font-bold text-slate-800">{(currentPage - 1) * limit + 1}</span> – <span className="font-bold text-slate-800">{Math.min(currentPage * limit, totalJobs)}</span> of <span className="font-bold text-slate-800">{totalJobs}</span> records
              </div>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Link 
                    href={currentPage > 1 ? `/?page=${currentPage - 1}&limit=${limit}` : "#"} 
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
                    href={currentPage < totalPages ? `/?page=${currentPage + 1}&limit=${limit}` : "#"} 
                    className={`text-xs font-bold px-3 py-2 border border-slate-200 bg-white rounded-lg transition-colors cursor-pointer ${
                      currentPage < totalPages ? "text-slate-700 hover:bg-slate-50" : "text-slate-300 pointer-events-none"
                    }`}
                  >
                    Next
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Latest Blog Posts Section */}
        {latestBlogPosts && latestBlogPosts.length > 0 && (
          <section className="space-y-6 pt-6">
            <div className="flex items-center justify-between border-b border-outline-variant/10 pb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="font-extrabold text-lg text-on-surface tracking-tight">Latest Career Articles & Guides</h2>
              </div>
              <Link href="/blog" className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer">
                <span>View All Articles</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestBlogPosts.map((post: any) => (
                <article
                  key={post.id}
                  className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="p-5 flex flex-col flex-grow space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-violet-50 text-violet-700">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <div className="space-y-1.5 flex-grow">
                      <h3 className="text-sm font-bold text-on-surface hover:text-primary transition-colors line-clamp-2">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-[11px] text-on-surface-variant/80 line-clamp-2 leading-relaxed">
                        {post.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-medium">{post.author.split(" (")[0]}</span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="flex items-center gap-0.5 font-bold text-primary hover:text-primary-container transition-colors"
                      >
                        <span>Read Post</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

