import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { LuxuryFloatingWidget } from '@/components/ui/LuxuryFloatingWidget';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: {
    default: 'House of Anvera | Anti-Tarnish Traditional Jewellery',
    template: '%s | House of Anvera',
  },
  description: 'Anti-tarnish traditional jewellery crafted with love from Kerala, India. Daily wear Jhumkas, Chains, Pendant Sets & more. Three souls, one story — crafted with timeless style.',
  keywords: ['anti-tarnish jewellery', 'traditional jewellery', 'daily wear jewellery', 'Kerala jewellery', 'Jhumka earrings', 'gold jewellery India', 'House of Anvera', 'BIS hallmarked'],
  authors: [{ name: 'House of Anvera' }],
  creator: 'House of Anvera',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofanvera.com'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'House of Anvera',
    title: 'House of Anvera | Anti-Tarnish Traditional Jewellery',
    description: 'Anti-tarnish traditional jewellery crafted with love. Three souls, one story — Kerala, India.',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'House of Anvera | Anti-Tarnish Traditional Jewellery',
    description: 'Anti-tarnish traditional jewellery crafted with love from Kerala, India.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <CustomCursor />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <LuxuryFloatingWidget />
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'toast-success',
              style: { background: '#1D1D1D', color: '#fff', border: '1px solid rgba(200,155,60,0.3)' },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
