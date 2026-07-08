import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { GoldDivider } from '@/components/ui/GoldDivider';
import { ArrowRight, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Journal | House of Anvera',
  description: 'Stories, care guides, and style inspiration from House of Anvera.',
};

interface Blog {
  _id: string; title: string; slug: string;
  excerpt?: string; coverImage?: { url: string };
  category: string; views: number; publishedAt?: string; createdAt: string;
  author?: { name: string };
}

const FALLBACK_BLOGS = [
  {
    _id: '1', title: 'How to Choose the Perfect Bridal Jewelry Set',
    slug: 'choose-perfect-bridal-jewelry',
    excerpt: 'Your wedding day is one of the most important days of your life. Here\'s our expert guide to selecting jewelry that complements your bridal look perfectly.',
    coverImage: { url: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80' },
    category: 'bridal-guide', views: 1240, createdAt: '2024-12-01T00:00:00Z',
    author: { name: 'House of Anvera' },
  },
  {
    _id: '2', title: 'The Art of Kundan Jewelry: A Heritage Craft',
    slug: 'art-of-kundan-jewelry',
    excerpt: 'Explore the 500-year-old tradition of Kundan jewelry making, from the royal courts of Rajasthan to modern luxury.',
    coverImage: { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80' },
    category: 'heritage', views: 892, createdAt: '2024-11-15T00:00:00Z',
    author: { name: 'House of Anvera' },
  },
  {
    _id: '3', title: 'How to Care for Your Gold Jewelry',
    slug: 'care-for-gold-jewelry',
    excerpt: 'Simple daily habits and cleaning tips to keep your precious pieces sparkling for generations.',
    coverImage: { url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80' },
    category: 'care-guide', views: 2140, createdAt: '2024-11-01T00:00:00Z',
    author: { name: 'House of Anvera' },
  },
  {
    _id: '4', title: 'Styling Minimal Jewelry for Every Occasion',
    slug: 'styling-minimal-jewelry',
    excerpt: 'Less is more — discover how to layer and stack minimal pieces for everyday wear and special events.',
    coverImage: { url: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&q=80' },
    category: 'style-guide', views: 671, createdAt: '2024-10-20T00:00:00Z',
    author: { name: 'House of Anvera' },
  },
  {
    _id: '5', title: 'Understanding Gold Purity: 18KT vs 22KT vs 24KT',
    slug: 'understanding-gold-purity',
    excerpt: 'Everything you need to know about gold karats and which is best suited for different types of jewelry.',
    coverImage: { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80' },
    category: 'education', views: 3200, createdAt: '2024-10-05T00:00:00Z',
    author: { name: 'House of Anvera' },
  },
  {
    _id: '6', title: 'Festival Jewelry Trends 2025',
    slug: 'festival-jewelry-trends-2025',
    excerpt: 'This festive season, embrace bold kundan sets, layered necklaces, and statement jhumkas that celebrate Indian artistry.',
    coverImage: { url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80' },
    category: 'trends', views: 445, createdAt: '2024-09-15T00:00:00Z',
    author: { name: 'House of Anvera' },
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  'bridal-guide': 'Bridal Guide', 'heritage': 'Heritage', 'care-guide': 'Care Guide',
  'style-guide': 'Style Guide', 'education': 'Education', 'trends': 'Trends',
};

async function getBlogs(): Promise<Blog[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs?limit=12`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return FALLBACK_BLOGS;
    const data = await res.json();
    return data.blogs?.length ? data.blogs : FALLBACK_BLOGS;
  } catch { return FALLBACK_BLOGS; }
}

export default async function BlogPage() {
  const blogs = await getBlogs();
  const [featured, ...rest] = blogs;

  return (
    <div className="min-h-screen bg-cream pt-24">
      {/* Header */}
      <section className="py-16 px-6 text-center">
        <p className="font-poppins text-[11px] tracking-[5px] text-gold uppercase mb-4">Stories & Inspiration</p>
        <h1 className="font-cormorant text-5xl md:text-6xl font-light text-dark mb-4">
          The Anvera <em className="not-italic font-semibold">Journal</em>
        </h1>
        <GoldDivider className="mb-6" />
        <p className="font-manrope text-brown/60 max-w-md mx-auto">
          Heritage stories, care guides, and style inspiration from our artisans.
        </p>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-[1400px] mx-auto">
          {/* Featured Article */}
          {featured && (
            <Link href={`/blog/${featured.slug}`} className="group block mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
                <div className="relative aspect-[4/3] lg:aspect-auto min-h-[350px] overflow-hidden">
                  <Image
                    src={featured.coverImage?.url || 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80'}
                    alt={featured.title} fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="bg-dark p-10 lg:p-16 flex flex-col justify-center">
                  <span className="font-poppins text-[10px] tracking-[3px] text-gold uppercase mb-4">
                    {CATEGORY_LABELS[featured.category] || featured.category} · Featured
                  </span>
                  <h2 className="font-cormorant text-3xl lg:text-4xl font-semibold text-white leading-tight mb-4 group-hover:text-gold transition-colors">
                    {featured.title}
                  </h2>
                  <p className="font-manrope text-sm text-white/50 leading-relaxed mb-6">{featured.excerpt}</p>
                  <div className="flex items-center gap-4">
                    <span className="font-manrope text-xs text-white/30">{formatDate(featured.createdAt)}</span>
                    <span className="font-manrope text-xs text-white/30">·</span>
                    <span className="font-manrope text-xs text-white/30">{featured.views.toLocaleString()} views</span>
                  </div>
                  <div className="mt-6 flex items-center gap-2 font-poppins text-[10px] tracking-[2px] text-gold uppercase">
                    Read Article <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map(blog => (
              <Link key={blog._id} href={`/blog/${blog.slug}`} className="group">
                <div className="overflow-hidden mb-4">
                  <div className="relative aspect-[16/10] overflow-hidden bg-off-white">
                    <Image
                      src={blog.coverImage?.url || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80'}
                      alt={blog.title} fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
                <span className="font-poppins text-[9px] tracking-[3px] text-gold uppercase">
                  {CATEGORY_LABELS[blog.category] || blog.category}
                </span>
                <h3 className="font-cormorant text-xl font-semibold text-dark mt-2 mb-2 leading-snug group-hover:text-brown transition-colors">
                  {blog.title}
                </h3>
                <p className="font-manrope text-sm text-brown/60 line-clamp-2 mb-3">{blog.excerpt}</p>
                <div className="flex items-center gap-3 font-manrope text-xs text-brown/40">
                  <Clock size={11} />
                  <span>{formatDate(blog.createdAt)}</span>
                  <span>·</span>
                  <span>{blog.views.toLocaleString()} views</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
