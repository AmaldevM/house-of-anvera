'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag, Tag, ArrowRight, Truck, RefreshCcw } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { GoldDivider } from '@/components/ui/GoldDivider';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getShipping, getTax, getTotal, clearCart, applyCoupon, removeCoupon, couponCode, couponDiscount } = useCartStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const { data } = await api.post('/coupons/validate', { code: couponInput, orderTotal: getSubtotal() });
      applyCoupon(data.coupon.code, data.coupon.discount);
      toast.success(`Coupon applied! You saved ${formatPrice(data.coupon.discount)}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Invalid coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream pt-24 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag size={64} className="text-brown/20 mx-auto mb-6" />
          <h1 className="font-cormorant text-4xl font-semibold text-dark mb-3">Your Cart is Empty</h1>
          <p className="font-manrope text-brown/60 mb-8">Discover our handcrafted luxury pieces and add them to your cart.</p>
          <Link href="/shop" className="btn-gold">Explore Collection</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-24">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="font-poppins text-[11px] tracking-[4px] text-gold uppercase mb-2">Review</p>
          <h1 className="font-cormorant text-5xl font-semibold text-dark">Your Cart</h1>
          <GoldDivider align="left" className="mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-0">
            <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b border-off-white">
              <div className="col-span-6 font-poppins text-[10px] tracking-[3px] uppercase text-brown/50">Product</div>
              <div className="col-span-2 font-poppins text-[10px] tracking-[3px] uppercase text-brown/50 text-center">Price</div>
              <div className="col-span-2 font-poppins text-[10px] tracking-[3px] uppercase text-brown/50 text-center">Qty</div>
              <div className="col-span-2 font-poppins text-[10px] tracking-[3px] uppercase text-brown/50 text-right">Total</div>
            </div>

            <AnimatePresence>
              {items.map(item => {
                const price = item.product.discountPrice || item.product.price;
                const img = item.product.images[0]?.url;
                return (
                  <motion.div
                    key={item.product._id}
                    layout
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-12 gap-4 py-6 border-b border-off-white items-center"
                  >
                    {/* Image + Name */}
                    <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
                      <div className="relative w-20 h-24 bg-ivory shrink-0 overflow-hidden">
                        {img && <Image src={img} alt={item.product.name} fill className="object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-poppins text-[10px] tracking-[2px] text-gold uppercase mb-1">{item.product.category?.name}</p>
                        <Link href={`/shop/${item.product.slug}`} className="font-cormorant text-lg font-semibold text-dark hover:text-gold transition-colors line-clamp-2">
                          {item.product.name}
                        </Link>
                        {item.product.material && (
                          <p className="font-manrope text-xs text-brown/50 mt-1">{item.product.material}</p>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-4 md:col-span-2 text-center">
                      <span className="font-cormorant text-lg text-dark">{formatPrice(price)}</span>
                    </div>

                    {/* Qty */}
                    <div className="col-span-4 md:col-span-2 flex items-center justify-center gap-2">
                      <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} className="w-7 h-7 border border-brown/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center font-manrope text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product._id, Math.min(item.quantity + 1, item.product.stock))} className="w-7 h-7 border border-brown/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Total + Remove */}
                    <div className="col-span-4 md:col-span-2 flex items-center justify-end gap-3">
                      <span className="font-cormorant text-lg font-semibold text-dark">{formatPrice(price * item.quantity)}</span>
                      <button onClick={() => removeItem(item.product._id)} className="text-brown/30 hover:text-red-400 transition-colors" aria-label="Remove">
                        <X size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Continue Shopping */}
            <div className="flex items-center justify-between pt-6">
              <Link href="/shop" className="flex items-center gap-2 font-poppins text-xs tracking-wider text-brown/60 hover:text-gold transition-colors uppercase">
                ← Continue Shopping
              </Link>
              <button onClick={clearCart} className="font-poppins text-xs tracking-wider text-brown/40 hover:text-red-400 transition-colors uppercase">
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-ivory border border-off-white p-6 sticky top-28">
              <h2 className="font-cormorant text-2xl font-semibold text-dark mb-6">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-6">
                <p className="font-poppins text-[11px] tracking-[2px] uppercase text-brown/50 mb-3 flex items-center gap-2">
                  <Tag size={12} /> Coupon Code
                </p>
                {couponCode ? (
                  <div className="flex items-center justify-between p-3 bg-gold/10 border border-gold/30">
                    <span className="font-poppins text-sm font-semibold text-gold">{couponCode}</span>
                    <button onClick={removeCoupon} className="text-brown/40 hover:text-red-400 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-0">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="luxury-input flex-1 text-sm"
                      id="coupon-input"
                    />
                    <button onClick={handleApplyCoupon} disabled={couponLoading} className="btn-gold text-[11px] px-4 shrink-0">
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>

              <GoldDivider className="mb-6" />

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between font-manrope text-sm">
                  <span className="text-brown/60">Subtotal</span>
                  <span className="text-dark font-medium">{formatPrice(getSubtotal())}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between font-manrope text-sm">
                    <span className="text-green-600">Coupon Discount</span>
                    <span className="text-green-600 font-medium">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-manrope text-sm">
                  <span className="text-brown/60 flex items-center gap-1">
                    <Truck size={12} /> Shipping
                  </span>
                  <span className={getShipping() === 0 ? 'text-green-600 font-medium' : 'text-dark font-medium'}>
                    {getShipping() === 0 ? 'FREE' : formatPrice(getShipping())}
                  </span>
                </div>
                <div className="flex justify-between font-manrope text-sm">
                  <span className="text-brown/60">Tax (3%)</span>
                  <span className="text-dark font-medium">{formatPrice(getTax())}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-off-white mb-6">
                <span className="font-cormorant text-xl font-semibold text-dark">Total</span>
                <span className="font-cormorant text-2xl font-semibold gold-text">{formatPrice(getTotal())}</span>
              </div>

              {getShipping() > 0 && (
                <p className="font-manrope text-xs text-brown/50 mb-4 text-center">
                  Add {formatPrice(2000 - getSubtotal())} more for free shipping
                </p>
              )}

              <Link href="/checkout" className="btn-gold w-full flex items-center justify-center gap-2 mb-3">
                Proceed to Checkout <ArrowRight size={14} />
              </Link>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="flex items-center gap-1 font-manrope text-[10px] text-brown/40">
                  <RefreshCcw size={10} /> Easy Returns
                </div>
                <div className="flex items-center gap-1 font-manrope text-[10px] text-brown/40">
                  <Truck size={10} /> Insured Delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
