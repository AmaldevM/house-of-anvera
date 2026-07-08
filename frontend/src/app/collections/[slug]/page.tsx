'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProductCard } from '@/components/ui/ProductCard';
import { GoldDivider } from '@/components/ui/GoldDivider';
import { Product } from '@/types';
import api from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const FALLBACK_IMAGES: Record<string, string> = {
  bridal: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&q=80',
  minimal: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80',
  traditional: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&q=80',
  festival: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=1200&q=80',
};

interface CollectionData {
  _id: string; name: string; slug: string;
  description?: string; banner?: { url: string };
  products?: Product[];
}

export default function CollectionDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [collection, setCollection] = useState<CollectionData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/collections/${slug}`);
        setCollection(data.collection);
        // Fetch products in this collection
        const pRes = await api.get(`/products?collection=${data.collection._id}&limit=24`);
        setProducts(pRes.data.products || []);
      } catch {
        // Try fetching products by collection slug
        try {
          const pRes = await api.get(`/products?limit=24`);
          setProducts(pRes.data.products || []);
        } catch { /* silent */ }
      } finally { setLoading(false); }
    };
    fetch();
  }, [slug]);

  const bannerUrl = collection?.banner?.url || FALLBACK_IMAGES[slug] || FALLBACK_IMAGES.minimal;

  return (
    <div className="min-h-screen bg-cream">
      {/* Banner */}
      <div className="relative h-[50vh] min-h-[350px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={bannerUrl} alt={collection?.name || slug} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-[1400px] mx-auto">
          <Link href="/collections" className="inline-flex items-center gap-2 font-poppins text-[10px] tracking-[2px] text-white/50 uppercase hover:text-gold transition-colors mb-4">
            <ArrowLeft size={12} /> All Collections
          </Link>
          <h1 className="font-cormorant text-4xl md:text-6xl font-light text-white">
            {loading ? 'Loading...' : collection?.name || slug}
          </h1>
          {collection?.description && (
            <p className="font-manrope text-sm text-white/60 mt-3 max-w-lg">{collection.description}</p>
          )}
        </div>
      </div>

      {/* Products */}
      <section className="py-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <GoldDivider align="left" className="mb-3" />
              <p className="font-manrope text-sm text-brown/60">{products.length} pieces</p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-off-white animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-cormorant text-3xl text-dark/40 mb-4">No pieces yet</p>
              <p className="font-manrope text-sm text-brown/40 mb-8">New pieces coming soon for this collection.</p>
              <Link href="/shop" className="btn-gold">Browse All Jewelry</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {products.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
