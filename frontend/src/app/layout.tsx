import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: {
    default: 'House of Anvera | Luxury Jewelry',
    template: '%s | House of Anvera',
  },
  description: 'Discover our curated collection of handcrafted luxury jewelry — bridal, traditional, and contemporary pieces that celebrate your most precious moments.',
  keywords: ['luxury jewelry', 'bridal jewelry', 'handcrafted jewelry', 'gold jewelry', 'diamond jewelry', 'House of Anvera'],
  authors: [{ name: 'House of Anvera' }],
  creator: 'House of Anvera',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofanvera.com'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'House of Anvera',
    title: 'House of Anvera | Luxury Jewelry',
    description: 'Discover our curated collection of handcrafted luxury jewelry.',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'House of Anvera | Luxury Jewelry',
    description: 'Discover our curated collection of handcrafted luxury jewelry.',
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
