// src/app/(public)/blog/page.tsx

import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { BlogPost } from "@/lib/blog-data";
import { BookOpen, Search, Clock, Calendar, User, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache page for 1 minute

export const metadata: Metadata = {
  title: "Career & Exam Preparation Blog - NewFreeJobAlert",
  description: "Get the best career guidance, exam preparation strategies, resume tips, and interview advice to clear your competitive exams and land your dream job.",
};

interface Props {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams;
  const activeCategory = params.category || "All";
  const searchVal = (params.search || "").trim().toLowerCase();

  let posts: any[] = [];
  try {
    posts = await prisma.blogPost.findMany({
      orderBy: {
        date: "desc"
      }
    });
  } catch(e) {
    console.error("Failed to load blog posts:", e);
  }

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch =
      !searchVal ||
      post.title.toLowerCase().includes(searchVal) ||
      post.description.toLowerCase().includes(searchVal) ||
      post.content.toLowerCase().includes(searchVal);
    return matchesCategory && matchesSearch;
  });

  const categories = [
    "All",
    "Exam Preparation",
    "Career Guidance",
    "Resume & Interview",
    "Industry Insights",
  ];

  return (
    <div className="w-full bg-background min-h-screen py-10">
      <div className="max-w-[1280px] mx-auto px-6 space-y-8">
        
        {/* Blog Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Official Career Blog</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">
            Crack Competitive Exams & Shape Your Career
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant/80 leading-relaxed">
            In-depth guides, strategy breakdowns, expert preparation routines, and tips written by experienced mentors to help you excel.
          </p>
        </div>

        {/* Filters and Search Control */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <Link
                  key={cat}
                  href={`/blog?category=${encodeURIComponent(cat)}${searchVal ? `&search=${encodeURIComponent(searchVal)}` : ""}`}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>

          {/* Search Input Form */}
          <form method="GET" action="/blog" className="relative w-full md:w-80">
            {activeCategory !== "All" && (
              <input type="hidden" name="category" value={activeCategory} />
            )}
            <input
              type="text"
              name="search"
              defaultValue={params.search || ""}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-surface-container-low text-on-surface border border-outline-variant/30 rounded-lg focus:outline-none focus:border-primary transition-colors"
            />
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-on-surface-variant/60" />
          </form>
        </div>

        {/* Blog Post Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Content Card Body */}
                <div className="p-6 flex flex-col flex-grow space-y-4">
                  {/* Category & Read Time */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-secondary/10 text-secondary">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title & Excerpt */}
                  <div className="space-y-2 flex-grow">
                    <h2 className="text-lg font-bold text-on-surface hover:text-primary transition-colors line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="text-xs text-on-surface-variant/80 line-clamp-3 leading-relaxed">
                      {post.description}
                    </p>
                  </div>

                  {/* Meta Details & Link */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate max-w-[120px]">{post.author.split(" (")[0]}</span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex items-center gap-1 font-bold text-primary hover:text-primary-container transition-colors"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 max-w-md mx-auto space-y-3">
            <BookOpen className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-on-surface">No articles found</h3>
            <p className="text-xs text-on-surface-variant/70">
              We couldn&apos;t find any articles matching your search query. Try clearing your filters or search query.
            </p>
            <Link
              href="/blog"
              className="inline-block px-4 py-2 mt-2 text-xs font-bold text-on-primary bg-primary rounded-lg"
            >
              Reset Filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
