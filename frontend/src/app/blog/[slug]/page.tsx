import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GoldDivider } from '@/components/ui/GoldDivider';
import { ArrowLeft, Clock, Eye, Tag } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: { url: string };
  category: string;
  views: number;
  publishedAt?: string;
  createdAt: string;
  author?: { name: string };
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
}

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/blogs/${slug}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.blog || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) return { title: 'Article Not Found | House of Anvera' };
  return {
    title: blog.seoTitle || `${blog.title} | House of Anvera Journal`,
    description: blog.seoDescription || blog.excerpt,
    openGraph: { images: blog.coverImage ? [blog.coverImage.url] : [] },
  };
}

const FALLBACK_BLOG: Blog = {
  _id: '1',
  title: 'How to Choose the Perfect Bridal Jewelry Set',
  slug: 'choose-perfect-bridal-jewelry',
  content: `
    <p>Your wedding day is one of the most important days of your life, and every detail matters — especially your jewelry. The right bridal jewelry set can elevate your entire look, adding that final touch of elegance and grace that makes you feel like the most beautiful version of yourself.</p>
    
    <h2>Understanding Your Bridal Look</h2>
    <p>Before choosing jewelry, consider the overall aesthetic of your wedding. Are you going for a traditional South Indian look, a Mughal-inspired grandeur, or a contemporary fusion? Each style calls for a different jewelry approach.</p>
    
    <h2>Matching Metals to Your Outfit</h2>
    <p>Gold remains the most versatile choice for Indian bridal jewelry. For red or maroon lehengas, traditional yellow gold creates a stunning contrast. Rose gold works beautifully with lighter pastels and pinks. Silver and platinum pairs exceptionally well with white or ivory outfits.</p>
    
    <h2>The Essential Bridal Pieces</h2>
    <p>A complete bridal set typically includes: a statement necklace, matching earrings, maang tikka, nose ring (if desired), bangles or kadas, and haath phool. You don't need to wear all pieces — choose what complements your look best.</p>
    
    <h2>Stone Selection</h2>
    <p>Kundan and polki are traditional favorites for their rich, royal appearance. Diamonds offer timeless elegance. Rubies and emeralds add vivid color. Choose stones that complement the embroidery and color palette of your outfit.</p>
    
    <h2>Comfort Matters</h2>
    <p>You'll be wearing your jewelry for hours. Ensure earrings aren't too heavy — we recommend backs with support for heavy pieces. Bangles should slide on comfortably. Test your full set together before the wedding day.</p>
    
    <h2>The House of Anvera Promise</h2>
    <p>All our bridal collections are handcrafted by master artisans, BIS hallmarked for purity, and come in our signature luxury packaging. We offer complimentary consultations to help you find your perfect bridal look.</p>
  `,
  excerpt: 'Your wedding day is one of the most important days of your life. Here\'s our expert guide to selecting jewelry that complements your bridal look perfectly.',
  coverImage: { url: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=1200&q=80' },
  category: 'wedding',
  views: 1240,
  createdAt: '2024-12-01T00:00:00Z',
  author: { name: 'House of Anvera' },
  tags: ['bridal', 'wedding', 'jewelry guide'],
};

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let blog = await getBlog(slug);

  // Use fallback if API not available
  if (!blog) {
    if (slug === FALLBACK_BLOG.slug) {
      blog = FALLBACK_BLOG;
    } else {
      notFound();
    }
  }

  return (
    <div className="min-h-screen bg-cream pt-24">
      {/* Cover Image Hero */}
      {blog.coverImage?.url && (
        <div className="relative h-[50vh] min-h-[360px] overflow-hidden">
          <img
            src={blog.coverImage.url}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 max-w-[900px] mx-auto">
            <p className="font-poppins text-[10px] tracking-[3px] text-gold uppercase mb-3">
              {blog.category.replace(/-/g, ' ')}
            </p>
            <h1 className="font-cormorant text-4xl md:text-5xl font-light text-white leading-tight">
              {blog.title}
            </h1>
          </div>
        </div>
      )}

      <div className="max-w-[900px] mx-auto px-6 py-12">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-poppins text-[10px] tracking-[2px] uppercase text-brown/50 hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft size={12} /> Back to Journal
        </Link>

        {/* Title (if no cover image) */}
        {!blog.coverImage?.url && (
          <div className="mb-8">
            <p className="font-poppins text-[10px] tracking-[3px] text-gold uppercase mb-3">
              {blog.category.replace(/-/g, ' ')}
            </p>
            <h1 className="font-cormorant text-4xl md:text-5xl font-light text-dark mb-4">
              {blog.title}
            </h1>
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-5 mb-8 py-5 border-y border-off-white">
          <div className="flex items-center gap-2 text-brown/50 font-manrope text-xs">
            <Clock size={12} className="text-gold" />
            {formatDate(blog.publishedAt || blog.createdAt)}
          </div>
          <div className="flex items-center gap-2 text-brown/50 font-manrope text-xs">
            <Eye size={12} className="text-gold" />
            {blog.views.toLocaleString()} views
          </div>
          {blog.author && (
            <div className="font-manrope text-xs text-brown/50">
              By <span className="text-dark font-medium">{blog.author.name}</span>
            </div>
          )}
        </div>

        <GoldDivider align="left" className="mb-10" />

        {/* Excerpt */}
        {blog.excerpt && (
          <p className="font-cormorant text-2xl font-light text-brown/70 italic leading-relaxed mb-10">
            {blog.excerpt}
          </p>
        )}

        {/* Content */}
        <div
          className="prose-anvera"
          dangerouslySetInnerHTML={{ __html: blog.content }}
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '16px',
            lineHeight: '1.9',
            color: '#473428cc',
          }}
        />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-off-white">
            <Tag size={14} className="text-gold mt-0.5" />
            {blog.tags.map(tag => (
              <span
                key={tag}
                className="font-poppins text-[10px] tracking-[2px] uppercase text-gold border border-gold/30 px-3 py-1 hover:bg-gold/5 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 p-8 bg-dark text-center">
          <p className="font-poppins text-[10px] tracking-[4px] text-gold uppercase mb-3">Explore Our Collections</p>
          <h3 className="font-cormorant text-3xl font-light text-white mb-6">
            Find Your Perfect Piece
          </h3>
          <GoldDivider className="mb-6" />
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/shop" className="btn-gold">Shop Now</Link>
            <Link href="/contact" className="btn-outline-gold">Contact Us</Link>
          </div>
        </div>

        {/* Back */}
        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="font-poppins text-[11px] tracking-[3px] uppercase text-brown/50 hover:text-gold transition-colors inline-flex items-center gap-2"
          >
            ← More from the Journal
          </Link>
        </div>
      </div>
    </div>
  );
}
