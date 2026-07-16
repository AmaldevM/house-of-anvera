import type { Metadata } from 'next';
import Link from 'next/link';
import { GoldDivider } from '@/components/ui/GoldDivider';
import { Shield, Truck, RefreshCw, Award, Phone, Mail, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | House of Anvera',
  description: 'Discover the story behind House of Anvera — handcrafted luxury jewelry celebrating life\'s most precious moments since 2009.',
};

const values = [
  { icon: Award, title: 'Craftsmanship', desc: 'Every piece is handcrafted by master artisans who have honed their skills over generations.' },
  { icon: Shield, title: 'Purity', desc: 'All our gold jewelry is BIS hallmarked. Every gemstone is sourced ethically and verified for quality.' },
  { icon: RefreshCw, title: 'Timelessness', desc: 'We design for forever, not trends. Our pieces are investments meant to be worn and loved across generations.' },
  { icon: Phone, title: 'Intimacy', desc: 'We know our customers by name. Every interaction with House of Anvera is personal, warm, and thoughtful.' },
];

const timeline = [
  { year: '2019', title: 'The Beginning', desc: 'Founded with a shared passion for fine jewelry and a dream to make luxury accessible.' },
  { year: '2020', title: 'First Collection', desc: 'Launched the Heritage Bridal Collection to critical acclaim.' },
  { year: '2022', title: 'Growing Community', desc: 'Reached 5,000 happy customers across India with a devoted following.' },
  { year: '2024', title: 'Digital Expansion', desc: 'Brought our atelier experience fully online, reaching customers nationwide.' },
  { year: '2025', title: 'The Next Chapter', desc: 'Expanding collections with new designs, collaborations, and global shipping.' },
];

const stats = [
  { value: '5000+', label: 'Happy Customers' },
  { value: '500+', label: 'Unique Designs' },
  { value: '100%', label: 'BIS Hallmarked' },
  { value: '40+', label: 'Instagram Posts' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-dark">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/50 to-dark/80" />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <p className="font-poppins text-[11px] tracking-[5px] text-gold uppercase mb-5">Our Story</p>
          <h1 className="font-cormorant text-6xl md:text-8xl font-light text-white leading-none mb-6">
            House of<br />
            <em className="not-italic font-semibold" style={{ background: 'linear-gradient(135deg, #C89B3C 0%, #DDB96A 40%, #A47425 60%, #C89B3C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Anvera
            </em>
          </h1>
          <div className="w-16 h-[1px] bg-gold mx-auto mb-6" />
          <p className="font-manrope text-white/60 text-lg max-w-xl mx-auto">
            Handcrafted luxury jewelry celebrating life's most precious moments
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-dark border-y border-gold/20">
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map(s => (
              <div key={s.label}>
                <p className="font-cormorant text-4xl font-semibold text-gold mb-1">{s.value}</p>
                <p className="font-poppins text-[10px] tracking-[3px] uppercase text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-poppins text-[11px] tracking-[4px] text-gold uppercase mb-4">Our Purpose</p>
          <h2 className="font-cormorant text-4xl md:text-5xl font-light text-dark mb-6">
            Crafted with <em className="not-italic font-semibold">Intention</em>
          </h2>
          <GoldDivider className="mb-8" />
          <p className="font-cormorant text-2xl font-light text-brown/70 leading-relaxed italic mb-8">
            &ldquo;We believe jewelry is more than adornment — it is memory, emotion, and identity woven in gold and gemstone.&rdquo;
          </p>
          <p className="font-manrope text-brown/70 leading-relaxed text-lg">
            House of Anvera was born from a love for traditional Indian jewelry and a vision to make it accessible to the modern woman.
            Every piece we create carries meaning — crafted by master artisans, hallmarked for purity,
            and designed to be worn and loved for generations to come.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-6 bg-ivory">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <p className="font-poppins text-[11px] tracking-[4px] text-gold uppercase mb-4">What We Stand For</p>
            <h2 className="font-cormorant text-4xl font-light text-dark">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="p-8 border border-off-white bg-cream hover:border-gold/40 hover:shadow-md transition-all duration-300 group">
                  <div className="w-10 h-10 border border-gold/30 flex items-center justify-center mb-5 group-hover:border-gold group-hover:bg-gold/5 transition-all">
                    <Icon size={18} className="text-gold" />
                  </div>
                  <div className="w-8 h-[1px] bg-gold mb-4" />
                  <h3 className="font-cormorant text-2xl font-semibold text-dark mb-3">{v.title}</h3>
                  <p className="font-manrope text-sm text-brown/70 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brand Story Image + Text */}
      <section className="py-24 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80"
                alt="House of Anvera craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating accent */}
            <div className="absolute -bottom-6 -right-6 bg-dark p-6 w-44 hidden md:block">
              <p className="font-cormorant text-4xl font-light text-white mb-1">Anti</p>
              <p className="font-cormorant text-4xl font-light text-gold mb-2">Tarnish</p>
              <p className="font-poppins text-[9px] tracking-[2px] text-white/40 uppercase">Premium Quality</p>
            </div>
          </div>
          <div>
            <p className="font-poppins text-[11px] tracking-[4px] text-gold uppercase mb-5">The Anvera Difference</p>
            <h2 className="font-cormorant text-4xl md:text-5xl font-light text-dark leading-tight mb-6">
              Traditional Craft,<br />
              <em className="not-italic font-semibold">Modern Sensibility</em>
            </h2>
            <GoldDivider align="left" className="mb-8" />
            <div className="space-y-5 font-manrope text-brown/70 leading-relaxed">
              <p>
                At House of Anvera, each piece tells a story. We work with artisans who have dedicated their lives to the ancient craft of jewelry making — combining traditional techniques with contemporary design sensibility.
              </p>
              <p>
                Our jewelry is anti-tarnish, meaning it retains its brilliance through daily wear. We use only BIS-hallmarked gold and certified gemstones, ensuring every piece is an investment you can trust.
              </p>
              <p>
                From the moment your order is placed to the day it arrives at your door, we handle every detail with care — from handcrafting to our signature luxury packaging.
              </p>
            </div>
            <div className="mt-10 flex gap-4 flex-wrap">
              <Link href="/shop" className="btn-gold">Shop Now</Link>
              <Link href="/contact" className="btn-outline-gold">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6 bg-ivory">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <p className="font-poppins text-[11px] tracking-[4px] text-gold uppercase mb-4">Our Journey</p>
            <h2 className="font-cormorant text-4xl font-light text-dark">Building Anvera</h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-gold via-gold/40 to-transparent hidden md:block" />
            <div className="space-y-12">
              {timeline.map((item, i) => (
                <div key={item.year} className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-cream border border-off-white p-6 inline-block max-w-sm hover:border-gold/30 hover:shadow-md transition-all duration-300">
                      <p className="font-poppins text-[11px] tracking-[3px] text-gold uppercase mb-2">{item.year}</p>
                      <h3 className="font-cormorant text-2xl font-semibold text-dark mb-2">{item.title}</h3>
                      <p className="font-manrope text-sm text-brown/70">{item.desc}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-gold rounded-full border-4 border-ivory shrink-0 relative z-10" />
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Strip */}
      <section className="py-16 px-6 bg-dark">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Phone, title: 'Call Us', info: '+91 9400 856 725' },
              { icon: Mail, title: 'Email Us', info: 'hackathon039@gmail.com' },
              { icon: MapPin, title: 'Find Us', info: 'Kerala, India' },
            ].map(c => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border border-gold/30 flex items-center justify-center">
                    <Icon size={18} className="text-gold" />
                  </div>
                  <p className="font-poppins text-[10px] tracking-[3px] text-gold uppercase">{c.title}</p>
                  <p className="font-manrope text-sm text-white/70">{c.info}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-cream text-center">
        <p className="font-poppins text-[11px] tracking-[4px] text-gold uppercase mb-4">Experience Anvera</p>
        <h2 className="font-cormorant text-5xl font-light text-dark mb-6">Begin Your Jewelry Journey</h2>
        <GoldDivider className="mb-8" />
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/shop" className="btn-gold">Explore the Collection</Link>
          <Link href="/contact" className="btn-dark">Contact Us</Link>
        </div>
      </section>
    </div>
  );
}
