// src/app/(public)/blog/[slug]/page.tsx

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { BlogPost } from "@/lib/blog-data";
import { Clock, Calendar, User, ArrowLeft, Share2, Link2, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache page for 1 minute

import ShareButtons from "./share-buttons";

interface Props {
  params: Promise<{ slug: string }>;
}

// Fetch single blog post helper
async function getPost(slug: string) {
  try {
    return await prisma.blogPost.findUnique({
      where: { slug }
    });
  } catch (e) {
    console.error(e);
    return null;
  }
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Article Not Found - NewFreeJobAlert",
    };
  }

  return {
    title: `${post.title} - Career Guide`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

// Check content type and render
function renderContent(content: string) {
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(content);
  if (hasHtml) {
    return <div className="html-content" dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return renderMarkdown(content);
}

// Simple Markdown to HTML Parser
function renderMarkdown(content: string) {
  const blocks = content.split(/\n\n+/);

  return blocks.map((block, idx) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Handle horizontal rule
    if (trimmed === "---") {
      return <hr key={idx} className="my-8 border-slate-200" />;
    }

    // Handle headers
    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={idx} className="text-lg md:text-xl font-bold mt-6 mb-3 text-on-surface">
          {trimmed.replace("### ", "")}
        </h3>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={idx} className="text-xl md:text-2xl font-extrabold mt-8 mb-4 text-on-surface border-b border-slate-100 pb-2">
          {trimmed.replace("## ", "")}
        </h2>
      );
    }
    if (trimmed.startsWith("# ")) {
      return (
        <h1 key={idx} className="text-2xl md:text-3xl font-black mt-8 mb-4 text-on-surface">
          {trimmed.replace("# ", "")}
        </h1>
      );
    }

    // Handle bullet list
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      const items = trimmed.split(/\n[*+-]\s+/).map((item) => item.replace(/^[*+-]\s+/, ""));
      return (
        <ul key={idx} className="list-disc pl-6 my-4 space-y-2 text-on-surface-variant/90 text-sm md:text-base">
          {items.map((it, i) => (
            <li key={i}>{parseInlineMarkdown(it)}</li>
          ))}
        </ul>
      );
    }

    // Handle numbered list
    if (/^\d+\.\s+/.test(trimmed)) {
      const items = trimmed.split(/\n\d+\.\s+/).map((item) => item.replace(/^\d+\.\s+/, ""));
      return (
        <ol key={idx} className="list-decimal pl-6 my-4 space-y-2 text-on-surface-variant/90 text-sm md:text-base">
          {items.map((it, i) => (
            <li key={i}>{parseInlineMarkdown(it)}</li>
          ))}
        </ol>
      );
    }

    // Handle table
    if (trimmed.startsWith("|")) {
      const lines = trimmed.split("\n");
      const headers = lines[0]
        .split("|")
        .map((h) => h.trim())
        .filter((h) => h !== "");
      
      const rows = lines
        .slice(2) // Skip header and separator rows
        .map((line) =>
          line
            .split("|")
            .map((cell) => cell.trim())
            .filter((cell, cIdx) => cell !== "" || (cIdx > 0 && cIdx < line.split("|").length - 1))
        )
        .filter((row) => row.length > 0);

      return (
        <div key={idx} className="overflow-x-auto my-6 border border-slate-200 rounded-xl">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="px-4 py-3 text-left font-bold text-slate-700">
                    {parseInlineMarkdown(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-3 text-slate-600">
                      {parseInlineMarkdown(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Standard paragraph
    return (
      <p key={idx} className="leading-relaxed text-on-surface-variant/90 text-sm md:text-base my-4">
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  });
}

// Helper to parse inline bold and links
function parseInlineMarkdown(text: string) {
  // Regex to match markdown links: [Link text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  // Regex to match bold text: **text**
  const boldRegex = /\*\*([^*]+)\*\*/g;

  let parts: React.ReactNode[] = [text];

  // Apply bold formatting
  parts = parts.flatMap((part) => {
    if (typeof part !== "string") return part;
    const splitParts = part.split(boldRegex);
    return splitParts.map((item, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-extrabold text-on-surface">{item}</strong>;
      }
      return item;
    });
  });

  // Apply link formatting
  parts = parts.flatMap((part) => {
    if (typeof part !== "string") return part;
    const splitParts = part.split(/\[[^\]]+\]\([^)]+\)/g);
    
    // Find all matches
    const matches = Array.from(part.matchAll(linkRegex));
    if (matches.length === 0) return part;

    const result: React.ReactNode[] = [];
    splitParts.forEach((item, index) => {
      result.push(item);
      if (index < matches.length) {
        const [_, label, url] = matches[index];
        result.push(
          <a
            key={index}
            href={url}
            target={url.startsWith("http") ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="text-primary font-semibold hover:underline"
          >
            {label}
          </a>
        );
      }
    });
    return result;
  });

  return <>{parts}</>;
}

export default async function BlogPostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  // Get 3 recent related posts for sidebar
  let relatedPosts: any[] = [];
  try {
    relatedPosts = await prisma.blogPost.findMany({
      where: {
        NOT: {
          id: post.id
        }
      },
      take: 3,
      orderBy: {
        date: "desc"
      }
    });
  } catch (e) {
    console.error("Failed to load related posts:", e);
  }

  // JSON-LD Article Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Person",
      "name": post.author,
    },
    "publisher": {
      "@type": "Organization",
      "name": "NewFreeJobAlert",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.newfreejobalerts.com/logo.png",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.newfreejobalerts.com/blog/${post.slug}`,
    },
  };

  return (
    <div className="w-full bg-background min-h-screen py-10">
      {/* Insert JSON-LD for Search Engine Bots */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Articles</span>
        </Link>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Article Content */}
          <article className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 md:p-10 space-y-6 shadow-sm">
            
            {/* Category & Stats */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
              <span className="px-2.5 py-1 rounded bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider">
                {post.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                {post.readTime}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-on-surface leading-tight">
              {post.title}
            </h1>

            {/* Author details */}
            <div className="flex items-center gap-3 py-3 border-y border-slate-100">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {post.author[0]}
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">{post.author}</p>
                <p className="text-[10px] text-slate-400">Content Contributor</p>
              </div>
            </div>

            {/* Rich Text Body */}
            <div className="prose max-w-none text-on-surface-variant">
              {renderContent(post.content)}
            </div>

            {/* Sharing Footer */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <Share2 className="h-4 w-4 text-slate-400" />
                <span>Share this Career Guide:</span>
              </p>
              <ShareButtons title={post.title} slug={post.slug} />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Box Alert / Notice */}
            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <BookOpen className="h-5 w-5" />
                <span>Exam Updates</span>
              </div>
              <p className="text-xs text-on-surface-variant/80 leading-relaxed">
                Stay updated with the latest government jobs, admit cards, and results. We curate notification alerts daily directly from official board channels.
              </p>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline pt-1"
              >
                <span>View Job Notifications</span>
                <span>&rarr;</span>
              </Link>
            </div>

            {/* Related Articles list */}
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 space-y-4 shadow-sm">
              <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider">
                Recommended Guides
              </h2>
              <div className="divide-y divide-slate-100">
                {relatedPosts.map((rPost) => (
                  <div key={rPost.id} className="py-3 first:pt-0 last:pb-0 space-y-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-secondary">
                      {rPost.category}
                    </span>
                    <h3 className="text-xs font-bold text-on-surface hover:text-primary transition-colors line-clamp-2">
                      <Link href={`/blog/${rPost.slug}`}>{rPost.title}</Link>
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {rPost.readTime}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}
