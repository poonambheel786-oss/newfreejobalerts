import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/control-panel/',
    },
    sitemap: 'https://www.newfreejobalerts.com/sitemap.xml',
  }
}
