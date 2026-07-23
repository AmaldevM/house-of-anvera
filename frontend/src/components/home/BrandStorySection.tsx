'use client';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function BrandStorySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  const STATS = [
    { value: '249+', label: 'Happy Customers' },
    { value: '3', label: 'Founding Souls' },
    { value: '61+', label: 'Pieces Created' },
    { value: '100%', label: 'Anti-Tarnish' },
  ];

  return (
    <section className="py-24 px-6 bg-cream overflow-hidden" ref={ref}>
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Image Side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative order-2 lg:order-1"
        >
          {/* Main Image */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <motion.div style={{ y }} className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=80"
                alt="House of Anvera - Our Story"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </div>

          {/* Floating accent card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="absolute -bottom-6 -right-6 bg-dark p-6 w-48 shadow-luxury hidden md:block"
          >
            <p className="font-cormorant text-4xl font-light text-white mb-1">12+</p>
            <p className="font-poppins text-[10px] tracking-[3px] text-gold uppercase">
              Years of Mastery
            </p>
          </motion.div>

          {/* Gold accent line */}
          <div className="absolute -left-4 top-1/4 w-1 h-32 bg-gradient-to-b from-transparent via-gold to-transparent hidden lg:block" />
        </motion.div>

        {/* Content Side */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="order-1 lg:order-2"
        >
          <p className="section-label mb-4">Our Story</p>
          <div className="w-16 h-[2px] bg-gradient-to-r from-gold to-transparent mb-8" />

          <h2 className="section-title mb-6 leading-tight">
            Where Tradition Meets{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #C89B3C 0%, #DDB96A 40%, #A47425 60%, #C89B3C 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'goldShine 3s ease-in-out infinite',
              }}
            >
              Contemporary Elegance
            </span>
          </h2>

          <p className="font-manrope text-brown/70 text-base leading-relaxed mb-5">
            House of Anvera was born from a simple truth — three souls who believed that beautiful,
            traditional jewellery should be wearable every single day, not just locked away for special
            occasions. Based in Kerala, India, we create anti-tarnish traditional jewellery that
            stays as beautiful as the day you first wore it.
          </p>

          <p className="font-manrope text-brown/70 text-base leading-relaxed mb-10">
            Our bio says it best: <em className="text-dark italic">&ldquo;Three souls, one story — crafted with love &amp; timeless style.&rdquo;</em>{' '}
            Every Jhumka, chain, pendant set, and bangle we create carries that love in every detail.
            Anti-tarnish. BIS Hallmarked. Made for you.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 mb-10">
            {STATS.map(stat => (
              <div key={stat.label} className="border-l-2 border-gold pl-4">
                <p className="font-cormorant text-3xl font-semibold text-dark">{stat.value}</p>
                <p className="font-poppins text-[10px] tracking-[2px] text-brown/60 uppercase mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <Link href="/about" className="btn-dark inline-flex items-center gap-2">
            Read Our Story
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
