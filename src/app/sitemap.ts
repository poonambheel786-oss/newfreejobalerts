import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export const revalidate = 3600; // Cache sitemap for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.newfreejobalerts.com' // Your website domain

  let jobs: any[] = []
  try {
    jobs = await prisma.job.findMany({
      where: { status: "Published" },
      select: { slug: true, updatedAt: true }
    })
  } catch (e) {
    console.error("Failed to fetch jobs for sitemap:", e)
  }

  const jobUrls = jobs.map((job) => ({
    url: `${baseUrl}/jobs/${job.slug}`,
    lastModified: new Date(job.updatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  let posts: any[] = []
  try {
    posts = await prisma.blogPost.findMany({
      select: { slug: true, date: true }
    })
  } catch (e) {
    console.error("Failed to fetch blog posts for sitemap:", e)
  }

  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const staticUrls = [
    '',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/disclaimer',
    '/editorial-policy',
    '/fact-check-policy',
    '/cookie-policy',
    '/dmca-policy',
    '/correction-policy',
    '/jobs',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.5,
  }))

  return [...staticUrls, ...jobUrls, ...blogUrls]
}
