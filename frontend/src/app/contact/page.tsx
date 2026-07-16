import type { Metadata } from 'next';
import Link from 'next/link';
import { GoldDivider } from '@/components/ui/GoldDivider';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import ContactForm from './_components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | House of Anvera',
  description: 'Get in touch with House of Anvera. We\'d love to hear from you — questions, customisation requests, or just to say hello.',
};

const contactDetails = [
  {
    icon: MapPin,
    title: 'Visit Us',
    lines: ['Kerala, India'],
  },
  {
    icon: Phone,
    title: 'Call Us',
    lines: ['+91 9400 856 725'],
  },
  {
    icon: Mail,
    title: 'Email Us',
    lines: ['hackathon039@gmail.com'],
  },
  {
    icon: Clock,
    title: 'Store Hours',
    lines: ['Mon – Sat: 10:00 AM – 8:00 PM', 'Sunday: 11:00 AM – 6:00 PM'],
  },
];

const faqs = [
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery takes 5–7 business days. Express delivery is available in 2–3 business days for most pincodes.',
  },
  {
    q: 'Is the jewelry hallmarked?',
    a: 'Yes, all our gold jewelry is BIS hallmarked, certifying the purity of gold used in each piece.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer a 15-day hassle-free return and exchange policy. The jewelry must be in its original, unworn condition with all packaging intact.',
  },
  {
    q: 'Do you offer customisation?',
    a: 'Yes! We offer personalisation for select pieces. Contact us with your requirements and our design team will get in touch within 48 hours.',
  },
  {
    q: 'Are the gemstones certified?',
    a: 'Our diamond and precious gemstone pieces come with certificates from recognized gemological institutes.',
  },
  {
    q: 'Do you offer gift wrapping?',
    a: 'Every order from House of Anvera comes in our signature luxury packaging. We also offer additional personalised gift notes and premium gift boxes.',
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative bg-dark py-28 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-dark/80" />
        <div className="relative z-10">
          <p className="font-poppins text-[11px] tracking-[5px] text-gold uppercase mb-4">Let's Talk</p>
          <h1 className="font-cormorant text-5xl md:text-7xl font-light text-white mb-6">
            Get in <em className="not-italic font-semibold" style={{ background: 'linear-gradient(135deg, #C89B3C 0%, #DDB96A 40%, #A47425 60%, #C89B3C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Touch</em>
          </h1>
          <GoldDivider className="mb-6" />
          <p className="font-manrope text-white/60 text-lg max-w-xl mx-auto">
            We'd love to hear from you. Our team is here to help with any questions, customisation requests, or just to say hello.
          </p>
        </div>
      </section>

      {/* Contact Details Strip */}
      <section className="bg-ivory border-b border-off-white">
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {contactDetails.map(info => {
              const Icon = info.icon;
              return (
                <div key={info.title} className="flex gap-4 items-start">
                  <div className="w-10 h-10 border border-gold/30 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-poppins text-[10px] tracking-[2px] uppercase text-gold mb-1">{info.title}</p>
                    {info.lines.map(line => (
                      <p key={line} className="font-manrope text-sm text-dark">{line}</p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Form - Client Component */}
        <div>
          <h2 className="font-cormorant text-3xl font-semibold text-dark mb-2">Send a Message</h2>
          <p className="font-manrope text-sm text-brown/60 mb-8">We'll respond within 24 hours.</p>
          <ContactForm />
        </div>

        {/* FAQ */}
        <div>
          <h2 className="font-cormorant text-3xl font-semibold text-dark mb-2">Frequently Asked</h2>
          <p className="font-manrope text-sm text-brown/60 mb-8">Quick answers to common questions.</p>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <details key={i} className="border border-off-white group">
                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-ivory/80 transition-colors list-none">
                  <span className="font-manrope text-sm font-medium text-dark pr-4">{faq.q}</span>
                  <span className="text-gold text-xl leading-none shrink-0 group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <div className="px-4 pb-4">
                  <p className="font-manrope text-sm text-brown/70 leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>

          {/* Social */}
          <div className="mt-10 p-6 bg-dark">
            <p className="font-poppins text-[10px] tracking-[3px] text-gold uppercase mb-4">Follow Us</p>
            <p className="font-manrope text-sm text-white/60 mb-4">
              Stay up to date with our latest collections, behind-the-scenes craftsmanship, and exclusive offers.
            </p>
            <a
              href="https://www.instagram.com/houseofanvera?igsh=NTJ1NWY5dmc2OTBw"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold text-xs inline-flex items-center gap-2"
              id="instagram-link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              @houseofanvera
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
