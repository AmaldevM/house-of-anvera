'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  MapPin, CreditCard, Truck, CheckCircle, Loader2,
  ChevronRight, Smartphone, Banknote, Copy, Check,
  Shield, QrCode,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/lib/utils';
import { GoldDivider } from '@/components/ui/GoldDivider';
import api from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';

const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name required'),
  phone: z.string().min(10, 'Valid phone number required'),
  addressLine1: z.string().min(5, 'Address required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  pincode: z.string().min(6, 'Valid pincode required').max(6),
  country: z.string().optional(),
});

interface AddressForm {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

const STEPS = [
  { id: 1, label: 'Address', icon: MapPin },
  { id: 2, label: 'Payment', icon: CreditCard },
  { id: 3, label: 'Confirm', icon: CheckCircle },
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

// UPI ID to collect payments
const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || 'hackathon039@oksbi';
const UPI_NAME = 'House of Anvera';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getShipping, getTax, getTotal, couponCode, couponDiscount, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [shippingAddress, setShippingAddress] = useState<AddressForm | null>(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [utrSubmitting, setUtrSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, formState: { errors } } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema) as any,
    defaultValues: { country: 'India' },
  });

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const tax = getTax();
  const total = getTotal();

  // Build QR code URL
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`HOA Order`)}`;
  const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=250x250&chl=${encodeURIComponent(upiLink)}&choe=UTF-8&chld=M`;

  const copyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('UPI ID copied!');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream pt-24 flex flex-col items-center justify-center px-6">
        <h2 className="font-cormorant text-4xl font-semibold text-dark mb-4">Sign In to Continue</h2>
        <p className="font-manrope text-brown/60 mb-8">Please log in to complete your purchase.</p>
        <Link href="/login?redirect=/checkout" className="btn-gold">Sign In</Link>
      </div>
    );
  }

  if (items.length === 0 && !placedOrder) {
    return (
      <div className="min-h-screen bg-cream pt-24 flex flex-col items-center justify-center px-6">
        <h2 className="font-cormorant text-4xl font-semibold text-dark mb-4">Your cart is empty</h2>
        <Link href="/shop" className="btn-gold mt-4">Continue Shopping</Link>
      </div>
    );
  }

  // ─── STEP 1: ADDRESS ────────────────────────────────────────
  const handleAddressSubmit = (data: AddressForm) => {
    setShippingAddress(data);
    setStep(2);
  };

  // ─── STEP 2 → PLACE ORDER ───────────────────────────────────
  const handlePlaceOrder = async () => {
    if (!shippingAddress) return;
    setIsPlacingOrder(true);
    try {
      const orderItems = items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
      }));

      const { data } = await api.post('/orders', {
        orderItems,
        shippingAddress: { ...shippingAddress, country: 'India' },
        paymentMethod,
        couponCode: couponCode || undefined,
      });

      setPlacedOrder(data.order);

      if (paymentMethod === 'cod') {
        clearCart();
        setStep(3);
      } else {
        // UPI — move to payment scan step
        setStep(3);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // ─── STEP 3 (UPI): Submit UTR ────────────────────────────────
  const handleUTRSubmit = async () => {
    if (!utrNumber.trim() || utrNumber.length < 10) {
      toast.error('Please enter a valid UTR / Transaction ID (min 10 characters)');
      return;
    }
    setUtrSubmitting(true);
    try {
      await api.post('/payment/verify-upi', {
        orderId: placedOrder._id,
        utrNumber,
      });
      clearCart();
      toast.success('Payment details submitted! Order confirmed.');
      setStep(4);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit payment details');
    } finally {
      setUtrSubmitting(false);
    }
  };

  // ─── SUCCESS SCREEN ──────────────────────────────────────────
  if ((step === 4) || (step === 3 && paymentMethod === 'cod' && placedOrder)) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-gold/10 border-2 border-gold flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={36} className="text-gold" />
          </div>
          <h1 className="font-cormorant text-4xl font-semibold text-dark mb-3">
            {paymentMethod === 'cod' ? 'Order Placed!' : 'Order Confirmed!'}
          </h1>
          <GoldDivider className="mb-5" />
          <p className="font-manrope text-brown/70 mb-2">
            Order ID: <strong className="text-dark">#{placedOrder?._id?.slice(-8).toUpperCase()}</strong>
          </p>
          {paymentMethod === 'upi' && (
            <p className="font-manrope text-sm text-brown/60 mb-6">
              Your payment is being verified. We&apos;ll confirm your order within <strong>1–2 hours</strong>.
            </p>
          )}
          {paymentMethod === 'cod' && (
            <p className="font-manrope text-sm text-brown/60 mb-6">
              Your order is confirmed. Pay ₹{total.toLocaleString('en-IN')} on delivery.
            </p>
          )}
          <p className="font-manrope text-sm text-brown/60 mb-8">
            A confirmation email has been sent to <strong>{user?.email}</strong>.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/account" className="btn-gold">Track Order</Link>
            <Link href="/shop" className="btn-outline-gold">Continue Shopping</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-24">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="font-poppins text-[11px] tracking-[4px] text-gold uppercase mb-2">Secure Checkout</p>
          <h1 className="font-cormorant text-4xl font-semibold text-dark">Checkout</h1>
          <GoldDivider align="left" className="mt-4" />
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-12 max-w-xs">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isDone = step > s.id;
            return (
              <div key={s.id} className="flex items-center">
                <div className={`flex items-center gap-2 px-3 py-1.5 font-poppins text-[10px] tracking-wider uppercase transition-all ${
                  isActive ? 'text-gold' : isDone ? 'text-green-500' : 'text-brown/30'
                }`}>
                  <div className={`w-6 h-6 flex items-center justify-center border transition-all ${
                    isActive ? 'border-gold bg-gold text-white' : isDone ? 'border-green-500 bg-green-500 text-white' : 'border-brown/20'
                  }`}>
                    {isDone ? <Check size={10} /> : <Icon size={10} />}
                  </div>
                  <span className="hidden sm:block">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <div className="w-8 h-[1px] bg-brown/20" />}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: form area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">

              {/* STEP 1: ADDRESS */}
              {step === 1 && (
                <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="font-cormorant text-3xl font-semibold text-dark mb-6">Delivery Address</h2>
                  <form onSubmit={handleSubmit(handleAddressSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">Full Name *</label>
                        <input {...register('fullName')} className="luxury-input" placeholder="Priya Sharma" id="checkout-fullname" />
                        {errors.fullName && <p className="form-error">{errors.fullName.message}</p>}
                      </div>
                      <div>
                        <label className="form-label">Phone *</label>
                        <input {...register('phone')} className="luxury-input" placeholder="+91 98765 43210" id="checkout-phone" />
                        {errors.phone && <p className="form-error">{errors.phone.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Address Line 1 *</label>
                      <input {...register('addressLine1')} className="luxury-input" placeholder="House no, Street, Area" id="checkout-address1" />
                      {errors.addressLine1 && <p className="form-error">{errors.addressLine1.message}</p>}
                    </div>
                    <div>
                      <label className="form-label">Address Line 2</label>
                      <input {...register('addressLine2')} className="luxury-input" placeholder="Landmark, Colony (optional)" id="checkout-address2" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="form-label">City *</label>
                        <input {...register('city')} className="luxury-input" placeholder="Mumbai" id="checkout-city" />
                        {errors.city && <p className="form-error">{errors.city.message}</p>}
                      </div>
                      <div>
                        <label className="form-label">State *</label>
                        <select {...register('state')} className="luxury-input" id="checkout-state">
                          <option value="">Select State</option>
                          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {errors.state && <p className="form-error">{errors.state.message}</p>}
                      </div>
                      <div>
                        <label className="form-label">Pincode *</label>
                        <input {...register('pincode')} className="luxury-input" placeholder="400001" maxLength={6} id="checkout-pincode" />
                        {errors.pincode && <p className="form-error">{errors.pincode.message}</p>}
                      </div>
                    </div>
                    <button type="submit" className="btn-gold flex items-center gap-2 mt-2" id="checkout-address-next">
                      Continue to Payment <ChevronRight size={14} />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* STEP 2: PAYMENT METHOD */}
              {step === 2 && (
                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="font-cormorant text-3xl font-semibold text-dark mb-6">Payment Method</h2>

                  <div className="space-y-4 mb-8">
                    {/* UPI Option */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`w-full flex items-start gap-4 p-5 border-2 transition-all text-left ${
                        paymentMethod === 'upi'
                          ? 'border-gold bg-gold/5'
                          : 'border-off-white hover:border-gold/40'
                      }`}
                      id="payment-upi-btn"
                    >
                      <div className={`w-5 h-5 border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-all ${
                        paymentMethod === 'upi' ? 'border-gold' : 'border-brown/30'
                      }`}>
                        {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 bg-gold" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Smartphone size={16} className="text-gold" />
                          <span className="font-poppins text-sm font-semibold text-dark tracking-wide">
                            UPI / GPay / PhonePe / Paytm
                          </span>
                        </div>
                        <p className="font-manrope text-xs text-brown/60">
                          Scan QR code or enter UPI ID. Instant payment via any UPI app.
                        </p>
                        {/* UPI App logos text */}
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {['GPay', 'PhonePe', 'Paytm', 'BHIM', 'Amazon Pay'].map(app => (
                            <span key={app} className="font-poppins text-[9px] tracking-wider uppercase bg-off-white text-brown/60 px-2 py-0.5">
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>

                    {/* COD Option */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`w-full flex items-start gap-4 p-5 border-2 transition-all text-left ${
                        paymentMethod === 'cod'
                          ? 'border-gold bg-gold/5'
                          : 'border-off-white hover:border-gold/40'
                      }`}
                      id="payment-cod-btn"
                    >
                      <div className={`w-5 h-5 border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-all ${
                        paymentMethod === 'cod' ? 'border-gold' : 'border-brown/30'
                      }`}>
                        {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-gold" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Banknote size={16} className="text-gold" />
                          <span className="font-poppins text-sm font-semibold text-dark tracking-wide">
                            Cash on Delivery
                          </span>
                        </div>
                        <p className="font-manrope text-xs text-brown/60">
                          Pay in cash when your order arrives. Available for orders under ₹10,000.
                        </p>
                      </div>
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="btn-outline-gold" id="checkout-back-btn">
                      ← Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder}
                      className="btn-gold flex items-center gap-2"
                      id="checkout-place-order-btn"
                    >
                      {isPlacingOrder ? (
                        <><Loader2 size={16} className="animate-spin" /> Placing Order...</>
                      ) : (
                        <>Place Order · {formatPrice(total)} <ChevronRight size={14} /></>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: UPI PAYMENT SCAN */}
              {step === 3 && paymentMethod === 'upi' && placedOrder && (
                <motion.div key="upi-scan" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="font-cormorant text-3xl font-semibold text-dark mb-2">Complete Payment</h2>
                  <p className="font-manrope text-brown/60 mb-6 text-sm">
                    Order <strong className="text-dark">#{placedOrder._id.slice(-8).toUpperCase()}</strong> placed.
                    Now scan the QR or open your UPI app to pay.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* QR Code */}
                    <div className="text-center">
                      <div className="bg-white border-2 border-gold/30 p-4 inline-block mb-4">
                        {/* QR via Google Charts */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={qrUrl}
                          alt="UPI QR Code"
                          width={220}
                          height={220}
                          className="block"
                        />
                      </div>
                      <p className="font-poppins text-[10px] tracking-[2px] text-brown/50 uppercase">Scan with any UPI app</p>
                    </div>

                    {/* UPI Details */}
                    <div className="flex flex-col justify-center space-y-5">
                      {/* Amount */}
                      <div className="bg-gold/5 border border-gold/20 p-4 text-center">
                        <p className="font-poppins text-[10px] tracking-[3px] text-gold uppercase mb-1">Amount to Pay</p>
                        <p className="font-cormorant text-4xl font-semibold text-dark">{formatPrice(total)}</p>
                      </div>

                      {/* UPI ID */}
                      <div>
                        <p className="font-poppins text-[10px] tracking-[2px] uppercase text-brown/50 mb-2">UPI ID</p>
                        <div className="flex items-center gap-2 border border-off-white bg-ivory p-3">
                          <span className="flex-1 font-manrope text-sm text-dark font-semibold">{UPI_ID}</span>
                          <button
                            onClick={copyUPI}
                            className="text-gold hover:text-gold-dark transition-colors"
                            aria-label="Copy UPI ID"
                          >
                            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Open UPI App */}
                      <a
                        href={upiLink}
                        className="btn-gold text-center flex items-center justify-center gap-2"
                        id="open-upi-app-btn"
                      >
                        <Smartphone size={16} /> Open UPI App to Pay
                      </a>

                      {/* GPay specific */}
                      <a
                        href={`gpay://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${total.toFixed(2)}&cu=INR`}
                        className="btn-outline-gold text-center flex items-center justify-center gap-2"
                        id="open-gpay-btn"
                      >
                        📱 Open Google Pay
                      </a>
                    </div>
                  </div>

                  {/* UTR Number input */}
                  <div className="border border-off-white p-6 bg-ivory">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield size={16} className="text-gold" />
                      <h3 className="font-cormorant text-xl font-semibold text-dark">Confirm Payment</h3>
                    </div>
                    <p className="font-manrope text-sm text-brown/70 mb-4">
                      After paying, enter the <strong>UTR number / Transaction ID</strong> from your UPI app to confirm your order.
                    </p>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={utrNumber}
                        onChange={e => setUtrNumber(e.target.value.replace(/\s/g, ''))}
                        placeholder="e.g. 408912345678 or T2507081234567"
                        className="luxury-input flex-1"
                        id="utr-input"
                      />
                      <button
                        onClick={handleUTRSubmit}
                        disabled={utrSubmitting || utrNumber.length < 10}
                        className="btn-gold flex items-center gap-2 whitespace-nowrap"
                        id="utr-submit-btn"
                      >
                        {utrSubmitting ? (
                          <><Loader2 size={14} className="animate-spin" /> Submitting...</>
                        ) : (
                          <><Check size={14} /> Confirm Payment</>
                        )}
                      </button>
                    </div>
                    <p className="font-manrope text-xs text-brown/40 mt-3">
                      💡 Find UTR in: GPay History → Transaction Details | PhonePe → Payment History | Paytm → Transaction History
                    </p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="border border-off-white p-6 sticky top-28">
              <h3 className="font-cormorant text-2xl font-semibold text-dark mb-5">Order Summary</h3>
              <GoldDivider align="left" className="mb-5" />

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {items.map(item => {
                  const price = item.product.discountPrice || item.product.price;
                  return (
                    <div key={item.product._id} className="flex gap-3">
                      <div className="w-14 h-14 bg-off-white overflow-hidden shrink-0 relative">
                        {item.product.images?.[0] && (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            fill className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-manrope text-xs text-dark font-medium line-clamp-1">{item.product.name}</p>
                        <p className="font-manrope text-xs text-brown/50">Qty: {item.quantity}</p>
                        <p className="font-cormorant text-base font-semibold gold-text">{formatPrice(price * item.quantity)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="space-y-2 border-t border-off-white pt-4">
                <div className="flex justify-between font-manrope text-sm text-brown/70">
                  <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between font-manrope text-sm text-green-600">
                    <span>Coupon ({couponCode})</span><span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-manrope text-sm text-brown/70">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between font-manrope text-sm text-brown/70">
                  <span>GST (3%)</span><span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between font-cormorant text-2xl font-semibold text-dark border-t border-off-white pt-3 mt-2">
                  <span>Total</span><span className="gold-text">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-5 pt-4 border-t border-off-white space-y-2">
                {[
                  '🔒 100% Secure Checkout',
                  '✅ BIS Hallmarked Jewelry',
                  '📦 Free Shipping above ₹2,000',
                  '↩️ 15-day Easy Returns',
                ].map(badge => (
                  <p key={badge} className="font-manrope text-xs text-brown/50">{badge}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
