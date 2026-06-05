import type { MetadataRoute } from 'next';
import { BRAND } from '@/domain/brand';

export const dynamic = 'force-static';

// Rotas publicas relevantes para descoberta (export estatico gera out/sitemap.xml).
export default function sitemap(): MetadataRoute.Sitemap {
  const base = BRAND.siteUrl;
  const routes = ['/', '/equipamento/', '/app/login/', '/prototipo-3d/'];
  return routes.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.7
  }));
}
