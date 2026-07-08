import { GoldDivider } from '@/components/ui/GoldDivider';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | House of Anvera',
  description: 'Discover the story behind House of Anvera — three women, one vision: luxury jewelry that celebrates life\'s most precious moments.',
};

const founders = [
  {
    name: 'Anjana Mehta',
    role: 'Creative Director',
    bio: 'With 15 years in jewelry design, Anjana brings an unparalleled eye for detail and a passion for blending traditional Indian craftsmanship with contemporary sensibility.',
    initial: 'AM',
  },
  {
    name: 'Priya Nair',
    role: 'Head of Craftsmanship',
    bio: 'Priya oversees every piece that leaves our workshop, ensuring the highest standards of quality and artisanship that House of Anvera is known for.',
    initial: 'PN',
  },
  {
    name: 'Riya Kapoor',
    role: 'Brand & Experience',
    bio: 'Riya curates the House of Anvera experience from end to end — from our digital presence to the moment your jewelry arrives in our signature packaging.',
    initial: 'RK',
  },
];

const timeline = [
  { year: '2009', title: 'The Beginning', desc: 'Founded in a small Mumbai studio with a shared passion for fine jewelry and a dream to make it accessible.' },
  { year: '2013', title: 'First Collection', desc: 'Launched the Heritage Bridal Collection to critical acclaim in leading Indian fashion publications.' },
  { year: '2017', title: 'International Recognition', desc: "Featured in Vogue India and Harper's Bazaar as one of India's finest emerging luxury jewelry brands." },
  { year: '2020', title: 'Digital Launch', desc: 'Brought our atelier experience online, reaching customers across India and building a devoted following.' },
  { year: '2024', title: 'The Next Chapter', desc: 'Expanding our collections with new materials, collaborations, and global shipping capabilities.' },
];

const values = [
  { title: 'Craftsmanship', desc: 'Every piece is handcrafted by master artisans who have honed their skills over generations.' },
  { title: 'Purity', desc: 'All our gold jewelry is BIS hallmarked. Every gemstone is sourced ethically and verified for quality.' },
  { title: 'Timelessness', desc: 'We design for forever, not trends. Our pieces are investments meant to be worn and loved across generations.' },
  { title: 'Intimacy', desc: 'We know our customers by name. Every interaction with House of Anvera is personal, warm, and thoughtful.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-dark">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-dark/70" />
        <div className="relative z-10 text-center px-6">
          <p className="font-poppins text-[11px] tracking-[5px] text-gold uppercase mb-4">Our Story</p>
          <h1 className="font-cormorant text-6xl md:text-8xl font-light text-white leading-none">
            House of<br />
            <em className="gold-text not-italic font-semibold">Anvera</em>
          </h1>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeader label="Our Purpose" title="Crafted with Intention" className="mb-10" />
          <p className="font-cormorant text-2xl font-light text-brown/80 leading-relaxed italic mb-6">
            &ldquo;We believe jewelry is more than adornment — it is memory, emotion, and identity woven in gold and gemstone.&rdquo;
          </p>
          <GoldDivider />
          <p className="font-manrope text-brown/70 leading-relaxed mt-8 text-lg">
            House of Anvera was founded in 2009 by three women who shared an obsession: jewelry that tells stories.
            We set out to create a brand where every piece carries meaning — crafted by master artisans,
            hallmarked for purity, and designed to be worn and loved for generations.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-6 bg-ivory">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader label="What We Stand For" title="Our Values" className="mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={v.title} className="p-8 border border-off-white bg-cream hover:border-gold/30 transition-colors">
                <div className="w-10 h-0.5 bg-gold mb-5" />
                <h3 className="font-cormorant text-2xl font-semibold text-dark mb-3">{v.title}</h3>
                <p className="font-manrope text-sm text-brown/70 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-20 px-6 bg-dark">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader label="The Founders" title="Three Women, One Vision" light className="mb-16" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {founders.map((f) => (
              <div
                key={f.name}
                className="text-center p-8 border border-white/10 hover:border-gold/40 transition-colors"
              >
                <div className="w-20 h-20 bg-gold/20 border border-gold/40 flex items-center justify-center mx-auto mb-5">
                  <span className="font-cormorant text-2xl font-semibold text-gold">{f.initial}</span>
                </div>
                <h3 className="font-cormorant text-2xl font-semibold text-white mb-1">{f.name}</h3>
                <p className="font-poppins text-[10px] tracking-[3px] text-gold uppercase mb-4">{f.role}</p>
                <GoldDivider className="mb-4" />
                <p className="font-manrope text-sm text-white/60 leading-relaxed">{f.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader label="Our Journey" title="15 Years of Excellence" className="mb-16" />
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-gold via-gold/30 to-transparent hidden md:block" />
            <div className="space-y-12">
              {timeline.map((item, i) => (
                <div
                  key={item.year}
                  className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-ivory border border-off-white p-6 inline-block max-w-sm">
                      <p className="font-poppins text-[11px] tracking-[3px] text-gold uppercase mb-2">{item.year}</p>
                      <h3 className="font-cormorant text-2xl font-semibold text-dark mb-2">{item.title}</h3>
                      <p className="font-manrope text-sm text-brown/70">{item.desc}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-gold rounded-full border-4 border-cream shrink-0 relative z-10" />
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-dark text-center">
        <p className="font-poppins text-[11px] tracking-[4px] text-gold uppercase mb-4">Experience Anvera</p>
        <h2 className="font-cormorant text-5xl font-light text-white mb-6">Begin Your Jewelry Journey</h2>
        <GoldDivider className="mb-8" />
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/shop" className="btn-gold">Explore the Collection</Link>
          <Link href="/contact" className="btn-outline-gold">Contact Us</Link>
        </div>
      </section>
    </div>
  );
}
