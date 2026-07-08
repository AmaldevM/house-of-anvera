import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { GoldDivider } from '@/components/ui/GoldDivider';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Collections | House of Anvera',
  description: 'Explore our curated jewelry collections — Bridal, Minimal, Traditional, and Festival edits.',
};

interface Collection {
  _id: string; name: string; slug: string;
  description?: string; banner?: { url: string };
  isFeatured: boolean; isActive: boolean;
}

const FALLBACK_IMAGES: Record<string, string> = {
  bridal: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
  minimal: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
  traditional: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
  festival: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80',
};

async function getCollections(): Promise<Collection[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.collections || [];
  } catch { return []; }
}

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="min-h-screen bg-cream pt-24">
      {/* Hero */}
      <section className="py-20 px-6 text-center">
        <p className="font-poppins text-[11px] tracking-[5px] text-gold uppercase mb-4">Curated With Love</p>
        <h1 className="font-cormorant text-5xl md:text-6xl font-light text-dark mb-4">
          Our <em className="not-italic font-semibold">Collections</em>
        </h1>
        <GoldDivider className="mb-6" />
        <p className="font-manrope text-brown/60 max-w-lg mx-auto">
          From intimate everyday wear to grand bridal celebrations — each collection tells a unique story in gold.
        </p>
      </section>

      {/* Collections Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-[1400px] mx-auto">
          {collections.length === 0 ? (
            /* Fallback static collections if API not ready */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { name: 'Bridal Collection', slug: 'bridal', description: 'Complete bridal sets for your perfect day', count: '48 Pieces' },
                { name: 'Minimal Edit', slug: 'minimal', description: 'Understated elegance for everyday luxury', count: '36 Pieces' },
                { name: 'Traditional', slug: 'traditional', description: 'Time-honored designs celebrating heritage', count: '52 Pieces' },
                { name: 'Festival Edit', slug: 'festival', description: 'Vibrant pieces for every celebration', count: '30 Pieces' },
              ].map((col, i) => (
                <Link key={col.slug} href={`/collections/${col.slug}`}
                  className={`group relative overflow-hidden block ${i === 0 ? 'md:row-span-2' : ''}`}>
                  <div className={`relative overflow-hidden bg-dark ${i === 0 ? 'aspect-[3/4] md:aspect-auto md:min-h-[600px]' : 'aspect-[4/3]'}`}>
                    <Image src={FALLBACK_IMAGES[col.slug]} alt={col.name} fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <p className="font-poppins text-[10px] tracking-[3px] text-gold uppercase mb-2">{col.count}</p>
                      <h2 className="font-cormorant text-3xl font-semibold text-white mb-2">{col.name}</h2>
                      <p className="font-manrope text-sm text-white/60 mb-4">{col.description}</p>
                      <span className="inline-flex items-center gap-2 font-poppins text-[10px] tracking-[2px] text-gold uppercase border-b border-gold/40 pb-0.5">
                        Explore <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {collections.map((col, i) => (
                <Link key={col._id} href={`/collections/${col.slug}`}
                  className={`group relative overflow-hidden block ${i === 0 ? 'md:row-span-2' : ''}`}>
                  <div className={`relative overflow-hidden bg-dark ${i === 0 ? 'aspect-[3/4] md:aspect-auto md:min-h-[600px]' : 'aspect-[4/3]'}`}>
                    <Image
                      src={col.banner?.url || FALLBACK_IMAGES[col.slug] || FALLBACK_IMAGES.minimal}
                      alt={col.name} fill
                      className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      {col.isFeatured && <p className="font-poppins text-[10px] tracking-[3px] text-gold uppercase mb-2">Featured</p>}
                      <h2 className="font-cormorant text-3xl font-semibold text-white mb-2">{col.name}</h2>
                      {col.description && <p className="font-manrope text-sm text-white/60 mb-4">{col.description}</p>}
                      <span className="inline-flex items-center gap-2 font-poppins text-[10px] tracking-[2px] text-gold uppercase border-b border-gold/40 pb-0.5">
                        Explore <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
