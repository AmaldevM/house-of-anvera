'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    image: '/hero/hero-1.jpg',
    label: 'New Bridal Collection 2025',
    title: ['Adorned', 'in Gold'],
    subtitle: 'Discover handcrafted bridal jewelry that tells your story through timeless elegance',
    cta: { label: 'Explore Collection', href: '/collections/bridal' },
    ctaSecondary: { label: 'View Lookbook', href: '/lookbook' },
    align: 'left',
  },
  {
    id: 2,
    image: '/hero/hero-2.jpg',
    label: 'Minimal Edit',
    title: ['Effortless', 'Luxury'],
    subtitle: 'Understated pieces crafted for the modern woman who wears elegance every day',
    cta: { label: 'Shop Minimal', href: '/collections/minimal' },
    ctaSecondary: { label: 'New Arrivals', href: '/shop?sort=newest' },
    align: 'center',
  },
  {
    id: 3,
    image: '/hero/hero-3.jpg',
    label: 'Limited Edition',
    title: ['Rare &', 'Precious'],
    subtitle: 'One-of-a-kind pieces created by master craftsmen — exclusively yours',
    cta: { label: 'Discover More', href: '/collections/limited-edition' },
    ctaSecondary: { label: 'Book Consultation', href: '/contact' },
    align: 'right',
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setDirection('next');
      setCurrent(prev => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const goTo = (index: number, dir: 'next' | 'prev') => {
    setIsAutoPlaying(false);
    setDirection(dir);
    setCurrent(index);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const goNext = () => goTo((current + 1) % SLIDES.length, 'next');
  const goPrev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length, 'prev');

  const slide = SLIDES[current];

  const variants = {
    enter: (dir: string) => ({ opacity: 0, x: dir === 'next' ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: string) => ({ opacity: 0, x: dir === 'next' ? -60 : 60 }),
  };

  return (
    <section className="relative h-[100svh] min-h-[600px] max-h-[900px] overflow-hidden bg-dark">
      {/* Background Images */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={{
            enter: (dir: string) => ({ opacity: 0, scale: 1.05, x: dir === 'next' ? 30 : -30 }),
            center: { opacity: 1, scale: 1, x: 0 },
            exit: (dir: string) => ({ opacity: 0, scale: 0.98, x: dir === 'next' ? -30 : 30 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.title.join(' ')}
            fill
            className="object-cover"
            priority={slide.id === 1}
            sizes="100vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark/70 via-dark/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/50 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 flex items-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id + '-content'}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className={`max-w-2xl ${slide.align === 'center' ? 'mx-auto text-center' : slide.align === 'right' ? 'ml-auto text-right' : ''}`}
          >
            {/* Label */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="font-poppins text-[11px] tracking-[5px] text-gold uppercase mb-6"
            >
              {slide.label}
            </motion.p>

            {/* Gold Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className={`w-16 h-[1px] bg-gold mb-8 ${slide.align === 'center' ? 'mx-auto' : slide.align === 'right' ? 'ml-auto' : ''}`}
            />

            {/* Title */}
            <div className="overflow-hidden mb-6">
              {slide.title.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="overflow-hidden"
                >
                  <h1 className="hero-title text-white">{line}</h1>
                </motion.div>
              ))}
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="font-manrope text-white/70 text-base leading-relaxed mb-10 max-w-md"
            >
              {slide.subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className={`flex items-center gap-4 flex-wrap ${slide.align === 'center' ? 'justify-center' : slide.align === 'right' ? 'justify-end' : ''}`}
            >
              <Link href={slide.cta.href} className="btn-gold flex items-center gap-2">
                {slide.cta.label}
                <ArrowRight size={14} />
              </Link>
              <Link href={slide.ctaSecondary.href} className="btn-outline-gold border-white/50 text-white hover:bg-white hover:text-dark">
                {slide.ctaSecondary.label}
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goPrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-gold hover:border-gold transition-all duration-200"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={goNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-gold hover:border-gold transition-all duration-200"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 'next' : 'prev')}
            className={`transition-all duration-400 ${
              i === current
                ? 'w-8 h-[3px] bg-gold'
                : 'w-4 h-[3px] bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-10 right-6 z-20 hidden md:flex items-center gap-2">
        <span className="font-cormorant text-2xl text-white font-light">
          {String(current + 1).padStart(2, '0')}
        </span>
        <div className="w-8 h-[1px] bg-white/40" />
        <span className="font-cormorant text-base text-white/40 font-light">
          {String(SLIDES.length).padStart(2, '0')}
        </span>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-10 left-6 z-20 hidden md:flex flex-col items-center gap-2"
      >
        <div className="w-[1px] h-10 bg-white/30 relative overflow-hidden">
          <motion.div
            animate={{ y: ['0%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 w-full h-1/2 bg-gold"
          />
        </div>
        <span className="font-poppins text-[9px] tracking-[3px] text-white/40 uppercase rotate-90 origin-center mt-6">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
