'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView, type Variants } from 'framer-motion';
import { COLLECTIONS } from '@/lib/constants';
import { SectionHeader } from '@/components/ui/SectionHeader';

const COLLECTION_ITEMS = [
  {
    name: 'Bridal',
    slug: 'bridal',
    image: '/collections/bridal.jpg',
    count: '48 Pieces',
    description: 'Complete bridal sets for your special day',
  },
  {
    name: 'Minimal',
    slug: 'minimal',
    image: '/collections/minimal.jpg',
    count: '36 Pieces',
    description: 'Understated elegance for everyday luxury',
  },
  {
    name: 'Traditional',
    slug: 'traditional',
    image: '/collections/traditional.jpg',
    count: '52 Pieces',
    description: 'Time-honored designs with heritage craftsmanship',
  },
  {
    name: 'Luxury Reserve',
    slug: 'luxury',
    image: '/collections/luxury.jpg',
    count: '24 Pieces',
    description: 'Exclusive handpicked luxury statement pieces',
  },
  {
    name: 'Limited Edition',
    slug: 'limited-edition',
    image: '/collections/limited.jpg',
    count: '12 Pieces',
    description: 'Rare one-of-a-kind creations',
  },
  {
    name: 'Festival Edit',
    slug: 'festival',
    image: '/collections/festival.jpg',
    count: '30 Pieces',
    description: 'Vibrant pieces to celebrate every occasion',
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export function CollectionsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-24 px-6 bg-cream" ref={ref}>
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <SectionHeader
            label="Our Collections"
            title="Curated for Every Occasion"
            subtitle="From intimate everyday wear to grand bridal celebrations, each collection is a carefully crafted story in gold."
            align="center"
          />
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6"
        >
          {COLLECTION_ITEMS.map((col, i) => (
            <motion.div key={col.slug} variants={itemVariants}>
              <Link
                href={`/collections/${col.slug}`}
                className={`group relative block overflow-hidden ${
                  i === 0 ? 'md:row-span-2' : ''
                }`}
              >
                <div
                  className={`relative overflow-hidden bg-dark ${
                    i === 0 ? 'aspect-[3/4] md:aspect-auto md:h-full min-h-[400px]' : 'aspect-[3/4]'
                  }`}
                >
                  <Image
                    src={col.image}
                    alt={col.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 overlay-gold opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <p className="font-poppins text-[9px] tracking-[3px] text-gold uppercase mb-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                      {col.count}
                    </p>
                    <h3
                      className={`font-cormorant text-white font-light leading-tight transition-transform duration-300 ${
                        i === 0 ? 'text-4xl' : 'text-2xl'
                      }`}
                    >
                      {col.name}
                    </h3>
                    <p className="font-manrope text-white/60 text-xs mt-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 delay-75 line-clamp-2">
                      {col.description}
                    </p>
                    <div className="flex items-center gap-2 mt-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 delay-100">
                      <span className="font-poppins text-[10px] tracking-[3px] text-gold uppercase">
                        Explore
                      </span>
                      <div className="w-6 h-[1px] bg-gold" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link href="/collections" className="btn-outline-gold inline-flex items-center gap-2">
            View All Collections
            <span className="text-lg leading-none">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
