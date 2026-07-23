'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export function TrustBanner() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const ITEMS = [
    {
      icon: ShieldCheck,
      title: 'Anti-Tarnish Guarantee',
      subtitle: 'Every piece stays beautiful — our anti-tarnish coating lasts for years of daily wear',
    },
    {
      icon: Award,
      title: 'BIS Hallmarked',
      subtitle: '100% government-certified purity — you can trust every piece you wear',
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      subtitle: 'Free insured doorstep delivery on orders above ₹2,000 across India',
    },
    {
      icon: RefreshCw,
      title: 'Order via DM or Website',
      subtitle: 'Shop here or DM us on Instagram @houseofanvera — we respond fast!',
    },
  ];

  return (
    <section className="py-16 bg-dark border-y border-[#C89B3C]/20" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex gap-4 items-start"
              >
                <div className="flex-shrink-0 w-10 h-10 border border-[#C89B3C]/40 flex items-center justify-center bg-[#C89B3C]/5 text-[#C89B3C]">
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="font-poppins text-xs font-semibold tracking-[2px] uppercase text-white mb-1.5">
                    {item.title}
                  </h4>
                  <p className="font-manrope text-xs text-white/50 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
