'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { GoldDivider } from '@/components/ui/GoldDivider';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link href="/" className="font-cormorant text-2xl font-semibold tracking-[0.1em] text-dark uppercase block mb-8">
          House of Anvera
        </Link>

        {sent ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={28} className="text-gold" />
            </div>
            <h1 className="font-cormorant text-3xl font-semibold text-dark mb-3">Check Your Email</h1>
            <GoldDivider className="mb-5" />
            <p className="font-manrope text-brown/70 mb-8 leading-relaxed">
              We&apos;ve sent a password reset link to <strong>{email}</strong>.
              The link will expire in 1 hour.
            </p>
            <Link href="/login" className="btn-gold inline-flex items-center gap-2">
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <p className="font-poppins text-[11px] tracking-[4px] text-gold uppercase mb-2">Account Recovery</p>
            <h1 className="font-cormorant text-4xl font-semibold text-dark mb-2">Forgot Password?</h1>
            <GoldDivider align="left" className="mb-6" />
            <p className="font-manrope text-brown/60 mb-8 leading-relaxed">
              Enter your registered email address and we&apos;ll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-poppins text-[10px] tracking-[2px] uppercase text-brown/50 block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="luxury-input"
                  id="forgot-email-input"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full flex items-center justify-center gap-2"
                id="forgot-submit-btn"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Sending...</>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>

            <p className="font-manrope text-sm text-brown/60 text-center mt-8">
              Remember your password?{' '}
              <Link href="/login" className="text-gold hover:underline font-semibold">
                Sign in
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
