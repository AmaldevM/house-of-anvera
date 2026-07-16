'use client';
import { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { GoldDivider } from '@/components/ui/GoldDivider';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

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

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-off-white bg-ivory">
        <CheckCircle size={48} className="text-gold mb-4" />
        <h3 className="font-cormorant text-2xl font-semibold text-dark mb-2">Message Received!</h3>
        <p className="font-manrope text-sm text-brown/60 mb-6">Our team will respond within 24 hours.</p>
        <button
          onClick={() => { setSent(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }}
          className="btn-outline-gold"
          id="send-another-btn"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
        {sending ? <><Loader2 size={14} className="animate-spin" /> Sending...</> : 'Send Message'}
      </button>
    </form>
  );
}
