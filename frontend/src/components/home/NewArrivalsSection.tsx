'use client';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProductCard } from '@/components/ui/ProductCard';
import { Product } from '@/types';

interface NewArrivalsSectionProps {
  products: Product[];
}

export function NewArrivalsSection({ products }: NewArrivalsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  if (!products || products.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-cream" ref={ref}>
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14"
        >
          <SectionHeader
            label="Just Arrived"
            title="New Arrivals"
            subtitle="Fresh pieces added to our collection this season."
            align="left"
          />
          <Link href="/shop?sort=newest" className="btn-gold flex-shrink-0 flex items-center gap-2 text-nowrap">
            Shop New Arrivals →
          </Link>
        </motion.div>

        {/* Horizontal Scroll on Mobile, Grid on Desktop */}
        <div className="overflow-x-auto no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
          <div className="flex md:grid md:grid-cols-4 gap-4 lg:gap-6 min-w-max md:min-w-0">
            {products.slice(0, 4).map((product, i) => (
              <div key={product._id} className="w-56 md:w-auto flex-shrink-0 md:flex-shrink">
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
