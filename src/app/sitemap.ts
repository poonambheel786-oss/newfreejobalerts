import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://poonamsir.com' // Your website domain

  let jobs: any[] = []
  try {
    jobs = await prisma.job.findMany({
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
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.5,
  }))

  return [...staticUrls, ...jobUrls]
}
