'use client';
import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GoldDivider } from '@/components/ui/GoldDivider';
import api from '@/lib/api';
import { toast } from 'sonner';
import type { Metadata } from 'next';

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
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/contacts', formData);
      setSent(true);
      toast.success('Message sent! We\'ll get back to you within 24 hours.');
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream pt-24">
      {/* Hero */}
      <div className="bg-dark py-20 px-6 text-center">
        <SectionHeader
          label="Get in Touch"
          title="Contact Us"
          subtitle="We'd love to hear from you. Our team is here to help."
          light
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Form */}
        <div>
          <h2 className="font-cormorant text-3xl font-semibold text-dark mb-6">Send a Message</h2>

          {sent ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-off-white">
              <CheckCircle size={48} className="text-gold mb-4" />
              <h3 className="font-cormorant text-2xl font-semibold text-dark mb-2">Message Received!</h3>
              <p className="font-manrope text-brown/60">Our team will respond within 24 hours.</p>
              <button
                onClick={() => { setSent(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                className="btn-outline-gold mt-6"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-poppins text-[10px] tracking-[2px] uppercase text-brown/50 block mb-2">Name *</label>
                  <input
                    required
                    value={formData.name}
                    onChange={e => setFormData(d => ({ ...d, name: e.target.value }))}
                    className="luxury-input"
                    placeholder="Your name"
                    id="contact-name"
                  />
                </div>
                <div>
                  <label className="font-poppins text-[10px] tracking-[2px] uppercase text-brown/50 block mb-2">Email *</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(d => ({ ...d, email: e.target.value }))}
                    className="luxury-input"
                    placeholder="your@email.com"
                    id="contact-email"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-poppins text-[10px] tracking-[2px] uppercase text-brown/50 block mb-2">Phone</label>
                  <input
                    value={formData.phone}
                    onChange={e => setFormData(d => ({ ...d, phone: e.target.value }))}
                    className="luxury-input"
                    placeholder="+91 98765 43210"
                    id="contact-phone"
                  />
                </div>
                <div>
                  <label className="font-poppins text-[10px] tracking-[2px] uppercase text-brown/50 block mb-2">Subject</label>
                  <input
                    value={formData.subject}
                    onChange={e => setFormData(d => ({ ...d, subject: e.target.value }))}
                    className="luxury-input"
                    placeholder="How can we help?"
                    id="contact-subject"
                  />
                </div>
              </div>
              <div>
                <label className="font-poppins text-[10px] tracking-[2px] uppercase text-brown/50 block mb-2">Message *</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={e => setFormData(d => ({ ...d, message: e.target.value }))}
                  rows={5}
                  className="luxury-input resize-none"
                  placeholder="Tell us how we can help you..."
                  id="contact-message"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="btn-gold flex items-center gap-2"
                id="contact-submit-btn"
              >
                {sending ? (
                  <><Loader2 size={14} className="animate-spin" /> Sending...</>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          )}
        </div>

        {/* Info + FAQ */}
        <div>
          <h2 className="font-cormorant text-3xl font-semibold text-dark mb-6">Our Details</h2>
          <div className="space-y-6 mb-10">
            {[
              {
                icon: MapPin,
                title: 'Visit Us',
                lines: ['123 Jewelry Lane, Bandra West', 'Mumbai, Maharashtra 400050'],
              },
              {
                icon: Phone,
                title: 'Call Us',
                lines: ['+91 123 456 7890', '+91 987 654 3210'],
              },
              {
                icon: Mail,
                title: 'Email Us',
                lines: ['hello@houseofanvera.com', 'support@houseofanvera.com'],
              },
              {
                icon: Clock,
                title: 'Store Hours',
                lines: ['Mon – Sat: 10:00 AM – 8:00 PM', 'Sunday: 11:00 AM – 6:00 PM'],
              },
            ].map(info => {
              const Icon = info.icon;
              return (
                <div key={info.title} className="flex gap-4">
                  <div className="w-10 h-10 border border-gold/30 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-poppins text-[11px] tracking-[2px] uppercase text-gold mb-1">{info.title}</p>
                    {info.lines.map(line => (
                      <p key={line} className="font-manrope text-sm text-dark">{line}</p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <GoldDivider align="left" className="mb-8" />

          {/* FAQ */}
          <h3 className="font-cormorant text-2xl font-semibold text-dark mb-5">Frequently Asked</h3>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-off-white">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-ivory/50 transition-colors"
                  id={`faq-btn-${i}`}
                >
                  <span className="font-manrope text-sm font-medium text-dark pr-4">{faq.q}</span>
                  <span className={`text-gold transition-transform text-xl leading-none shrink-0 ${openFaq === i ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="font-manrope text-sm text-brown/70 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
