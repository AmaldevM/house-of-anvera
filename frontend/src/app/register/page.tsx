'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { GoldDivider } from '@/components/ui/GoldDivider';
import { toast } from 'sonner';
import api from '@/lib/api';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, verifyOTP, isLoading } = useAuthStore();
  const [stage, setStage] = useState<'form' | 'otp'>('form');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password, phone: data.phone });
      setEmail(data.email);
      setStage('otp');
      toast.success('OTP sent to your email!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return;
    setOtpLoading(true);
    try {
      await verifyOTP(email, otp);
      toast.success('Welcome to House of Anvera!');
      router.push('/');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Invalid OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      await api.post('/auth/resend-otp', { email });
      toast.success('OTP resent!');
    } catch {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 bg-dark items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=1200&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-dark/75" />
        <div className="relative z-10 text-center px-12">
          <h2 className="font-cormorant text-5xl font-light text-white mb-4 leading-tight">
            Join the<br /><em className="gold-text not-italic font-semibold">Inner Circle</em>
          </h2>
          <GoldDivider className="mb-6" />
          <p className="font-manrope text-white/60 text-sm leading-relaxed max-w-xs mx-auto">
            Create your account for exclusive access, early collection launches, and a personalised jewelry experience.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <Link href="/" className="font-cormorant text-2xl font-semibold tracking-[0.1em] text-dark uppercase block mb-8">
              House of Anvera
            </Link>
            <p className="font-poppins text-[11px] tracking-[4px] text-gold uppercase mb-2">New Member</p>
            <h1 className="font-cormorant text-4xl font-semibold text-dark">
              {stage === 'form' ? 'Create Account' : 'Verify Email'}
            </h1>
            <GoldDivider align="left" className="mt-4" />
          </div>

          <AnimatePresence mode="wait">
            {stage === 'form' ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="font-poppins text-[10px] tracking-[2px] uppercase text-brown/50 block mb-2">Full Name *</label>
                  <input {...register('name')} placeholder="Priya Sharma" className="luxury-input" id="reg-name" />
                  {errors.name && <p className="font-manrope text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="font-poppins text-[10px] tracking-[2px] uppercase text-brown/50 block mb-2">Email *</label>
                  <input {...register('email')} type="email" placeholder="your@email.com" className="luxury-input" id="reg-email" />
                  {errors.email && <p className="font-manrope text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="font-poppins text-[10px] tracking-[2px] uppercase text-brown/50 block mb-2">Phone (optional)</label>
                  <input {...register('phone')} placeholder="+91 98765 43210" className="luxury-input" id="reg-phone" />
                </div>

                <div>
                  <label className="font-poppins text-[10px] tracking-[2px] uppercase text-brown/50 block mb-2">Password *</label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimum 6 characters"
                      className="luxury-input pr-12"
                      id="reg-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-brown/40 hover:text-gold"
                      aria-label="Toggle password"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="font-manrope text-xs text-red-500 mt-1">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="font-poppins text-[10px] tracking-[2px] uppercase text-brown/50 block mb-2">Confirm Password *</label>
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    placeholder="Repeat password"
                    className="luxury-input"
                    id="reg-confirm-password"
                  />
                  {errors.confirmPassword && <p className="font-manrope text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-gold w-full flex items-center justify-center gap-2 mt-2"
                  id="reg-submit-btn"
                >
                  {isLoading ? (
                    <><Loader2 size={16} className="animate-spin" /> Creating Account...</>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={28} className="text-gold" />
                </div>
                <p className="font-manrope text-brown/70 mb-6 leading-relaxed">
                  We sent a 6-digit code to<br />
                  <strong className="text-dark">{email}</strong>
                </p>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="luxury-input text-center text-2xl tracking-[0.5em] mb-6"
                  id="otp-input"
                />
                <button
                  onClick={handleVerifyOTP}
                  disabled={otpLoading || otp.length !== 6}
                  className="btn-gold w-full flex items-center justify-center gap-2 mb-4"
                  id="otp-verify-btn"
                >
                  {otpLoading ? (
                    <><Loader2 size={16} className="animate-spin" /> Verifying...</>
                  ) : (
                    <><CheckCircle size={16} /> Verify & Continue</>
                  )}
                </button>
                <button
                  onClick={resendOTP}
                  className="font-manrope text-sm text-brown/50 hover:text-gold transition-colors"
                >
                  Didn&apos;t receive it? Resend OTP
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="font-manrope text-sm text-brown/60 text-center mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-gold hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
