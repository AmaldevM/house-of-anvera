'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star } from 'lucide-react';
import { getInitials } from '@/lib/utils';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    comment:
      'The bridal set I ordered was absolutely breathtaking. Every piece was crafted with such precision and love. My wedding photos look stunning and I get compliments everywhere I go. House of Anvera truly exceeded my expectations!',
    product: 'Bridal Diamond Set',
    avatar: null,
  },
  {
    id: 2,
    name: 'Ananya Krishnan',
    location: 'Bangalore',
    rating: 5,
    comment:
      'I ordered the minimal gold earrings and they arrived in the most beautiful packaging. The quality is exceptional — lightweight yet sturdy. I wear them every day and receive so many compliments. Will definitely be ordering more!',
    product: 'Minimal Gold Drops',
    avatar: null,
  },
  {
    id: 3,
    name: 'Meera Patel',
    location: 'Ahmedabad',
    rating: 5,
    comment:
      'House of Anvera has become my go-to for all jewelry gifting. The craftsmanship is superb, the customer service is exceptional, and the pieces always arrive safely. A luxury experience from start to finish.',
    product: 'Traditional Kundan Necklace',
    avatar: null,
  },
  {
    id: 4,
    name: 'Deepa Nair',
    location: 'Chennai',
    rating: 5,
    comment:
      'Ordered the festival collection pieces for Diwali and was blown away by the quality. The gold work is intricate and the stones are vivid. Packaging is so luxurious that it itself is a gift. Will keep coming back!',
    product: 'Festival Collection Set',
    avatar: null,
  },
  {
    id: 5,
    name: 'Shalini Gupta',
    location: 'Delhi',
    rating: 5,
    comment:
      'The limited edition piece I purchased is absolutely one-of-a-kind. It took my breath away when I opened the box. The attention to detail is remarkable — you can tell this was made with genuine love and mastery.',
    product: 'Limited Edition Ring',
    avatar: null,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="py-24 px-6 bg-ivory overflow-hidden" ref={ref}>
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="section-label mb-4">Testimonials</p>
          <div
            className="w-16 h-[2px] mx-auto mb-6"
            style={{ background: 'linear-gradient(90deg, transparent, #C89B3C, transparent)' }}
          />
          <h2 className="section-title">
            Loved by Thousands, <br />
            <span className="gold-text">Cherished Forever</span>
          </h2>
          <p className="font-manrope text-brown/60 text-base mt-4 max-w-xl mx-auto">
            Read what our customers say about their House of Anvera experience
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {TESTIMONIALS.slice(0, 3).map((t) => (
            <motion.div
              key={t.id}
              variants={itemVariants}
              className="bg-white p-8 shadow-card hover:shadow-luxury transition-shadow duration-300 flex flex-col"
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < t.rating ? 'star-filled' : 'star-empty'}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="font-manrope text-sm text-dark/80 leading-relaxed flex-1 mb-6">
                &ldquo;{t.comment}&rdquo;
              </p>

              {/* Product Tag */}
              <div className="mb-5">
                <span className="font-poppins text-[10px] tracking-[2px] text-gold uppercase border border-gold/30 px-3 py-1">
                  {t.product}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 border-t border-off-white pt-5">
                <div className="w-10 h-10 bg-gold-gradient rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-poppins text-xs font-semibold text-white">
                    {getInitials(t.name)}
                  </span>
                </div>
                <div>
                  <p className="font-cormorant text-base font-medium text-dark">{t.name}</p>
                  <p className="font-manrope text-xs text-brown/50">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Extra two cards on xl */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 hidden lg:grid"
        >
          {TESTIMONIALS.slice(3, 5).map((t) => (
            <motion.div
              key={t.id}
              variants={itemVariants}
              className="bg-white p-8 shadow-card hover:shadow-luxury transition-shadow duration-300 flex flex-col"
            >
              <div className="flex items-center gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < t.rating ? 'star-filled' : 'star-empty'} />
                ))}
              </div>
              <p className="font-manrope text-sm text-dark/80 leading-relaxed flex-1 mb-6">
                &ldquo;{t.comment}&rdquo;
              </p>
              <div className="mb-5">
                <span className="font-poppins text-[10px] tracking-[2px] text-gold uppercase border border-gold/30 px-3 py-1">
                  {t.product}
                </span>
              </div>
              <div className="flex items-center gap-3 border-t border-off-white pt-5">
                <div className="w-10 h-10 bg-gold-gradient rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-poppins text-xs font-semibold text-white">
                    {getInitials(t.name)}
                  </span>
                </div>
                <div>
                  <p className="font-cormorant text-base font-medium text-dark">{t.name}</p>
                  <p className="font-manrope text-xs text-brown/50">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Google Rating Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex items-center justify-center gap-4 mt-14"
        >
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className="star-filled" />
            ))}
          </div>
          <div className="w-[1px] h-8 bg-off-white" />
          <p className="font-manrope text-sm text-brown/60">
            <span className="font-semibold text-dark">4.9/5</span> from over 2,000+ verified reviews
          </p>
        </motion.div>
      </div>
    </section>
  );
}
