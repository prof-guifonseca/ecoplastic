import type { Metadata, Viewport } from 'next';
import { BRAND } from '@/domain/brand';
import { Providers } from './providers';
import './globals.css';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: BRAND.name,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: BRAND.description,
  url: BRAND.siteUrl,
  inLanguage: 'pt-BR'
};

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  title: {
    default: `${BRAND.name} - Recycle-as-a-Service para condominios`,
    template: `%s · ${BRAND.name}`
  },
  description: BRAND.description,
  applicationName: BRAND.name,
  keywords: ['reciclagem', 'PET', 'gamificacao', 'sustentabilidade', 'inovacao tecnologica', 'coleta seletiva', 'economia circular', 'ESG', 'condominios'],
  authors: [{ name: BRAND.name }],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icons/icon.svg',
    apple: '/icons/icon.svg'
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: BRAND.name,
    title: `${BRAND.name} - Recycle-as-a-Service para condominios`,
    description: BRAND.description,
    url: BRAND.siteUrl,
    images: [{ url: '/og.svg', width: 1200, height: 630, alt: `${BRAND.name} - compactador inteligente de PET` }]
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND.name} - Recycle-as-a-Service`,
    description: BRAND.description,
    images: ['/og.svg']
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#071114'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
