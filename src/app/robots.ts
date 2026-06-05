import type { MetadataRoute } from 'next';
import { BRAND } from '@/domain/brand';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${BRAND.siteUrl}/sitemap.xml`
  };
}
