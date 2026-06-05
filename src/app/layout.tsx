import type { Metadata, Viewport } from 'next';
import { BRAND } from '@/domain/brand';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: `${BRAND.name} - Recycle-as-a-Service`,
  description: BRAND.description,
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icons/icon.svg',
    apple: '/icons/icon.svg'
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
