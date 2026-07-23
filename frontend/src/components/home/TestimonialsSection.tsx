'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star } from 'lucide-react';
import { getInitials } from '@/lib/utils';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Nithya Menon',
    location: 'Kochi, Kerala',
    rating: 5,
    comment:
      'Ordered the Jhumka set and I am absolutely obsessed! The anti-tarnish quality is real — I wear them every single day and they still look brand new after 3 months. House of Anvera truly delivers on their promise!',
    product: 'Traditional Jhumka Set',
    avatar: null,
  },
  {
    id: 2,
    name: 'Anjali Krishnan',
    location: 'Thrissur, Kerala',
    rating: 5,
    comment:
      'DM\'d them on Instagram and got the most helpful response. The Elakkathali Mala I ordered is stunning — exactly as shown in their posts. The packaging was beautiful and delivery was super fast. Will definitely order again!',
    product: 'Elakkathali Mala',
    avatar: null,
  },
  {
    id: 3,
    name: 'Devika Rajan',
    location: 'Kozhikode, Kerala',
    rating: 5,
    comment:
      'Been following @houseofanvera for a while and finally ordered. Best decision ever! The Lakshmi pendant set is so beautiful and the anti-tarnish coating means I can wear it daily without worry. Love the quality!',
    product: 'Lakshmi Pendant Set',
    avatar: null,
  },
  {
    id: 4,
    name: 'Sreelakshmi V.',
    location: 'Trivandrum, Kerala',
    rating: 5,
    comment:
      'Gifted the pendant set to my sister for her birthday and she absolutely loved it. The quality is exceptional for the price — you can feel the craftsmanship. The gold finish has stayed perfect. House of Anvera is my go-to now!',
    product: 'Gold Pendant Set',
    avatar: null,
  },
  {
    id: 5,
    name: 'Meera Thomas',
    location: 'Palakkad, Kerala',
    rating: 5,
    comment:
      'Three souls, one story — and it really shows in every piece. The love that goes into these jewels is evident. I got the bangle set for Onam and it was perfect. Anti-tarnish as promised, gorgeous design. 10/10!',
    product: 'Festive Bangle Set',
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
