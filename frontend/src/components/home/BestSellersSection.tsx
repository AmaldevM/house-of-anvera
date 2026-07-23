'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ProductCard } from '@/components/ui/ProductCard';
import { GoldDivider } from '@/components/ui/GoldDivider';
import { Product } from '@/types';
import { Flame } from 'lucide-react';

interface BestSellersSectionProps {
  products: Product[];
}

export function BestSellersSection({ products }: BestSellersSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  if (!products || products.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-dark overflow-hidden" ref={ref}>
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Flame size={14} className="text-gold" />
              <p className="font-poppins text-[11px] tracking-[4px] text-gold uppercase">Most Loved</p>
            </div>
            <div className="w-12 h-[1px] bg-gold mb-5" />
            <h2 className="font-cormorant text-4xl md:text-5xl font-light text-white leading-tight">
              Best Sellers
            </h2>
            <p className="font-manrope text-white/50 text-sm mt-3 max-w-sm">
              Our most-loved pieces — chosen by thousands of happy customers across India.
            </p>
          </div>
          <Link
            href="/shop?sort=-numReviews"
            className="btn-outline-gold flex-shrink-0 flex items-center gap-2 text-nowrap"
          >
            See All Best Sellers →
          </Link>
        </motion.div>

        {/* Products */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {products.slice(0, 4).map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-14"
        >
          <GoldDivider className="mb-8" />
          <p className="font-manrope text-white/50 text-sm mb-5">
            ⭐ 4.9/5 from over 2,000 verified customer reviews
          </p>
          <Link href="/shop" className="btn-gold">
            Explore Full Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
