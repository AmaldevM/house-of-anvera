'use client';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function InstagramSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const INSTAGRAM_POSTS = [
    { id: 1, image: '/instagram/ig-1.jpg', alt: 'Bridal jewelry flatlay' },
    { id: 2, image: '/instagram/ig-2.jpg', alt: 'Gold ring closeup' },
    { id: 3, image: '/instagram/ig-3.jpg', alt: 'Necklace on model' },
    { id: 4, image: '/instagram/ig-4.jpg', alt: 'Earrings on marble' },
    { id: 5, image: '/instagram/ig-5.jpg', alt: 'Bangles collection' },
    { id: 6, image: '/instagram/ig-6.jpg', alt: 'Traditional set' },
  ];

  return (
    <section className="py-20 px-6 bg-cream" ref={ref}>
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="section-label mb-3">Follow Us</p>
          <div
            className="w-16 h-[2px] mx-auto mb-5"
            style={{ background: 'linear-gradient(90deg, transparent, #C89B3C, transparent)' }}
          />
          <a
            href="https://www.instagram.com/houseofanvera?igsh=NTJ1NWY5dmc2OTBw"
            target="_blank"
            rel="noopener noreferrer"
            className="font-cormorant text-4xl font-light text-dark hover:text-gold transition-colors"
          >
            @houseofanvera
          </a>
          <p className="font-manrope text-sm text-brown/60 mt-3">
            Tag us in your photos for a chance to be featured
          </p>
        </motion.div>

        {/* Instagram Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-3 md:grid-cols-6 gap-2"
        >
          {INSTAGRAM_POSTS.map((post, i) => (
            <motion.a
              key={post.id}
              href="https://www.instagram.com/houseofanvera?igsh=NTJ1NWY5dmc2OTBw"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="group relative aspect-square overflow-hidden bg-off-white"
            >
              <Image
                src={post.image}
                alt={post.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 33vw, 16vw"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-dark/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-current">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Follow Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-center mt-8"
        >
          <a
            href="https://www.instagram.com/houseofanvera?igsh=NTJ1NWY5dmc2OTBw"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold inline-flex items-center gap-2"
          >
            Follow on Instagram <ArrowRight size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
