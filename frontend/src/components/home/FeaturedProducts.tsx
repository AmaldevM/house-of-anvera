'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ProductCard } from '@/components/ui/ProductCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Product } from '@/types';

interface FeaturedProductsProps {
  products: Product[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  if (!products || products.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-ivory" ref={ref}>
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14"
        >
          <SectionHeader
            label="Featured Pieces"
            title="Handpicked for You"
            subtitle="Each piece in our featured selection has been chosen for its exceptional craftsmanship and timeless appeal."
            align="left"
          />
          <Link
            href="/shop"
            className="btn-outline-gold flex-shrink-0 flex items-center gap-2 text-nowrap"
          >
            View All Jewelry
            <span>→</span>
          </Link>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {products.slice(0, 8).map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
