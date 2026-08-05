// src/app/control-panel/(dashboard)/blog/edit/[id]/page.tsx

import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import BlogForm from "../../new/blog-form";

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;

  let post = null;
  try {
    post = await prisma.blogPost.findUnique({
      where: { id }
    });
  } catch (e) {
    console.error("Failed to fetch blog post for editing:", e);
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <BlogForm initialPost={post} />
    </div>
  );
}
