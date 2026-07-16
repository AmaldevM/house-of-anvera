'use client';
import { Suspense } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { GoldDivider } from '@/components/ui/GoldDivider';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type LoginForm = z.infer<typeof loginSchema>;

// Inner component that safely uses useSearchParams()
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      router.push(redirect);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
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
        <p className="font-poppins text-[11px] tracking-[4px] text-gold uppercase mb-2">Account</p>
        <h1 className="font-cormorant text-4xl font-semibold text-dark">Sign In</h1>
        <GoldDivider align="left" className="mt-4" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="font-poppins text-[10px] tracking-[2px] uppercase text-brown/50 block mb-2">
            Email Address
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="your@email.com"
            className="luxury-input"
            id="login-email"
          />
          {errors.email && (
            <p className="font-manrope text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="font-poppins text-[10px] tracking-[2px] uppercase text-brown/50 block mb-2">
            Password
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="luxury-input pr-12"
              id="login-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-brown/40 hover:text-gold transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="font-manrope text-xs text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Link href="/forgot-password" className="font-manrope text-xs text-brown/50 hover:text-gold transition-colors">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-gold w-full flex items-center justify-center gap-2"
          id="login-submit-btn"
        >
          {isLoading ? (
            <><Loader2 size={16} className="animate-spin" /> Signing in...</>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-off-white" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-cream px-4 font-poppins text-[10px] tracking-wider text-brown/40 uppercase">
            Or
          </span>
        </div>
      </div>

      <p className="font-manrope text-sm text-brown/60 text-center">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-gold hover:underline font-semibold transition-colors">
          Create one
        </Link>
      </p>
    </motion.div>
  );
}

// Page wraps the form in Suspense to satisfy Next.js App Router requirement
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-1 bg-dark items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-dark/75" />
        <div className="relative z-10 text-center px-12">
          <h2 className="font-cormorant text-5xl font-light text-white mb-4 leading-tight">
            Welcome<br /><em className="gold-text not-italic font-semibold">Back</em>
          </h2>
          <GoldDivider className="mb-6" />
          <p className="font-manrope text-white/60 text-sm leading-relaxed max-w-xs mx-auto">
            Sign in to access your wishlist, track orders, and discover exclusive member benefits.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <Suspense fallback={
          <div className="w-full max-w-md flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-gold" />
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
