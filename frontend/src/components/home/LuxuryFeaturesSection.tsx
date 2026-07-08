'use client';
import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { Shield, Award, Package, Truck, RefreshCw, Phone } from 'lucide-react';
import { LUXURY_FEATURES } from '@/lib/constants';

const ICON_MAP: Record<string, React.ElementType> = {
  shield: Shield,
  award: Award,
  package: Package,
  truck: Truck,
  refresh: RefreshCw,
  phone: Phone,
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export function LuxuryFeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="py-20 px-6 bg-dark" ref={ref}>
      <div className="max-w-[1400px] mx-auto">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="section-label text-gold mb-3">The Anvera Promise</p>
          <div className="w-16 h-[2px] mx-auto" style={{ background: 'linear-gradient(90deg, transparent, #C89B3C, transparent)' }} />
          <h2 className="font-cormorant text-4xl font-light text-white mt-5">
            Crafted with Care, <em className="not-italic" style={{ color: '#DDB96A' }}>Delivered with Love</em>
          </h2>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-white/10"
        >
          {LUXURY_FEATURES.map((feature) => {
            const Icon = ICON_MAP[feature.icon] || Shield;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group bg-dark hover:bg-brown/20 transition-colors duration-300 p-6 lg:p-8 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 border border-gold/30 flex items-center justify-center mb-5 group-hover:border-gold group-hover:bg-gold/10 transition-all duration-300">
                  <Icon size={20} className="text-gold" />
                </div>
                <h4 className="font-cormorant text-base font-medium text-white mb-2 leading-snug">
                  {feature.title}
                </h4>
                <p className="font-manrope text-xs text-white/40 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
