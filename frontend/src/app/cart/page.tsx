'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, Tag, X, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { GoldDivider } from '@/components/ui/GoldDivider';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getSubtotal, getShipping } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState('');

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const total = subtotal - discount + shipping;

  const handleCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const { data } = await api.post('/coupons/validate', {
        code: couponCode.trim().toUpperCase(),
        orderAmount: subtotal,
      });
      if (data.success) {
        setDiscount(data.discountAmount);
        setCouponApplied(couponCode.trim().toUpperCase());
        toast.success(`Coupon applied! You save ${formatPrice(data.discountAmount)}`);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Invalid coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setCouponApplied('');
    setCouponCode('');
    toast.success('Coupon removed');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream pt-24 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <ShoppingBag size={64} className="text-gold/30 mx-auto mb-6" />
          <h1 className="font-cormorant text-4xl font-light text-dark mb-3">Your Cart is Empty</h1>
          <GoldDivider className="mb-6" />
          <p className="font-manrope text-brown/60 mb-8">
            Discover our curated collection of handcrafted luxury jewelry and find your perfect piece.
          </p>
          <Link href="/shop" className="btn-gold">Explore the Collection</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-24">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="font-poppins text-[11px] tracking-[4px] text-gold uppercase mb-2">Shopping</p>
          <h1 className="font-cormorant text-4xl md:text-5xl font-light text-dark">Your Cart</h1>
          <GoldDivider align="left" className="mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => {
                const p = item.product;
                return (
                  <motion.div
                    key={p._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white flex gap-5 p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Image */}
                    <Link href={`/shop/${p.slug}`} className="flex-shrink-0">
                      <div className="relative w-24 h-24 md:w-32 md:h-32 overflow-hidden bg-ivory">
                        {p.images?.[0] ? (
                          <Image
                            src={p.images[0].url}
                            alt={p.name}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-off-white" />
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        {p.category && (
                          <p className="font-poppins text-[10px] tracking-[2px] text-gold uppercase mb-1">
                            {typeof p.category === 'string' ? p.category : (p.category as any).name}
                          </p>
                        )}
                        <Link href={`/shop/${p.slug}`}>
                          <h3 className="font-cormorant text-xl font-medium text-dark hover:text-brown transition-colors line-clamp-2">
                            {p.name}
                          </h3>
                        </Link>
                        {p.SKU && (
                          <p className="font-manrope text-xs text-brown/40 mt-1">SKU: {p.SKU}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                        {/* Quantity */}
                        <div className="flex items-center border border-off-white">
                          <button
                            onClick={() => updateQuantity(p._id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:text-gold hover:bg-cream transition-all"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-10 text-center font-manrope text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(p._id, item.quantity + 1)}
                            disabled={item.quantity >= p.stock}
                            className="w-8 h-8 flex items-center justify-center hover:text-gold hover:bg-cream transition-all disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="font-cormorant text-xl font-semibold text-dark">
                            {formatPrice((p.discountPrice || p.price) * item.quantity)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="font-manrope text-xs text-brown/40">
                              {formatPrice(p.discountPrice || p.price)} each
                            </p>
                          )}
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(p._id)}
                          className="text-brown/30 hover:text-red-400 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Clear cart */}
            <div className="flex justify-end pt-2">
              <button
                onClick={clearCart}
                className="font-poppins text-[10px] tracking-[2px] uppercase text-brown/40 hover:text-red-400 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 shadow-sm sticky top-28">
              <h2 className="font-cormorant text-2xl font-semibold text-dark mb-6">Order Summary</h2>
              <GoldDivider align="left" className="mb-6" />

              <div className="space-y-3 mb-6 font-manrope text-sm">
                <div className="flex justify-between text-dark/70">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon ({couponApplied})</span>
                    <span>−{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-dark/70">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-[11px] text-brown/40 font-poppins">
                    Free shipping on orders above ₹2,000
                  </p>
                )}
              </div>

              {/* Coupon */}
              {couponApplied ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 px-4 py-3 mb-6">
                  <div className="flex items-center gap-2 text-green-700">
                    <Tag size={14} />
                    <span className="font-poppins text-xs tracking-wider uppercase">{couponApplied}</span>
                  </div>
                  <button onClick={removeCoupon} className="text-green-600 hover:text-red-400 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 mb-6">
                  <input
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Coupon code"
                    className="luxury-input flex-1 text-xs"
                    id="coupon-input"
                    onKeyDown={e => e.key === 'Enter' && handleCoupon()}
                  />
                  <button
                    onClick={handleCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="btn-outline-gold px-4 py-2 text-xs whitespace-nowrap disabled:opacity-50"
                    id="apply-coupon-btn"
                  >
                    Apply
                  </button>
                </div>
              )}

              {/* Total */}
              <div className="border-t border-off-white pt-5 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-cormorant text-xl font-semibold text-dark">Total</span>
                  <span className="font-cormorant text-2xl font-semibold text-dark">{formatPrice(total)}</span>
                </div>
                <p className="font-manrope text-xs text-brown/40 mt-1">Inclusive of all taxes</p>
              </div>

              <Link
                href="/checkout"
                className="btn-gold w-full flex items-center justify-center gap-2"
                id="proceed-to-checkout-btn"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              <div className="mt-6 pt-5 border-t border-off-white">
                <div className="grid grid-cols-3 gap-2 text-center">
                  {['BIS Hallmarked', 'Secure Pay', 'Easy Return'].map(t => (
                    <div key={t}>
                      <p className="font-poppins text-[9px] tracking-[1px] uppercase text-brown/40">{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Link href="/shop" className="font-poppins text-[11px] tracking-[3px] uppercase text-brown/50 hover:text-gold transition-colors inline-flex items-center gap-2">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
