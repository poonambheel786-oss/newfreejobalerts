// src/app/control-panel/(dashboard)/dashboard/blog/page.tsx

import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ArrowLeft, Edit, AlertCircle, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import DeleteBlogButton from "./delete-btn";

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

export default async function AdminBlogPage({ searchParams }: Props) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1") || 1;
  const limit = parseInt(params.limit || "10") || 10;
  const skip = (currentPage - 1) * limit;

  let posts: any[] = [];
  let totalPosts = 0;
  let dbError = false;

  try {
    posts = await prisma.blogPost.findMany({
      orderBy: {
        createdAt: "desc"
      },
      skip,
      take: limit
    });

    totalPosts = await prisma.blogPost.count();
  } catch (e) {
    console.error("Failed to fetch admin blog list:", e);
    dbError = true;
  }

  const totalPages = Math.ceil(totalPosts / limit);

  // Helper to format date
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch(e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Link href="/control-panel/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-slate-900">Career Blog</span>
          </div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight mt-1">
            Manage Blog Posts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Total blog posts: <span className="font-bold text-slate-800">{totalPosts}</span>
          </p>
        </div>

        <Link
          href="/control-panel/blog/new"
          className="bg-primary hover:bg-primary/95 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-primary/10 flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add New Post
        </Link>
      </div>

      {dbError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center gap-2 text-xs font-semibold">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          Failed to connect to the database. Please check your setup.
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Published Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-400 font-bold">
                    No blog posts found. Add some articles!
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="max-w-md truncate font-bold text-slate-900" title={post.title}>
                        {post.title}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 max-w-sm truncate">
                        {post.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-500 font-medium">
                        {post.author}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {formatDate(post.date)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/control-panel/blog/edit/${post.id}`}
                          className="p-1.5 rounded-lg bg-slate-50 text-slate-600 hover:bg-primary hover:text-white transition-all cursor-pointer"
                          title="Edit Post"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <DeleteBlogButton id={post.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <p className="text-[10px] font-semibold text-slate-500">
              Showing page <span className="text-slate-800 font-bold">{currentPage}</span> of <span className="text-slate-800 font-bold">{totalPages}</span>
            </p>
            <div className="flex items-center gap-1">
              <Link
                href={`/control-panel/dashboard/blog?page=${currentPage - 1}&limit=${limit}`}
                className={`p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-all ${currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}`}
              >
                <ChevronLeft className="h-4 w-4 text-slate-500" />
              </Link>
              <Link
                href={`/control-panel/dashboard/blog?page=${currentPage + 1}&limit=${limit}`}
                className={`p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-all ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
              >
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
