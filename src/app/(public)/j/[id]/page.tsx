import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function ShortJobRedirect({ params }: Props) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  // 1. Check if it matches a Job by full ID, short ID prefix, or slug
  const job = await prisma.job.findFirst({
    where: {
      OR: [
        { id: id },
        { slug: id },
        { id: { startsWith: id } }
      ]
    },
    select: { slug: true }
  });

  if (job) {
    redirect(`/jobs/${job.slug}`);
  }

  // 2. Check if it matches a Blog Post
  const post = await prisma.blogPost.findFirst({
    where: {
      OR: [
        { id: id },
        { slug: id },
        { id: { startsWith: id } }
      ]
    },
    select: { slug: true }
  });

  if (post) {
    redirect(`/blog/${post.slug}`);
  }

  notFound();
}
