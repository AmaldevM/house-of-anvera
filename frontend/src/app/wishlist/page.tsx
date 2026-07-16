'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { GoldDivider } from '@/components/ui/GoldDivider';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';
import { toast } from 'sonner';

export default function WishlistPage() {
  const { items, toggle } = useWishlistStore();
  const { addItem } = useCartStore();
  const [mounted, setMounted] = useState(false);


  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const handleMoveToCart = (product: Product) => {
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };


  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream pt-24 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <Heart size={64} className="text-gold/30 mx-auto mb-6" />
          <h1 className="font-cormorant text-4xl font-light text-dark mb-3">Your Wishlist is Empty</h1>
          <GoldDivider className="mb-6" />
          <p className="font-manrope text-brown/60 mb-8">
            Save pieces you love and come back to them anytime. Your wishlist waits for you.
          </p>
          <Link href="/shop" className="btn-gold">Discover Pieces</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-24">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="font-poppins text-[11px] tracking-[4px] text-gold uppercase mb-2">Saved Pieces</p>
          <h1 className="font-cormorant text-4xl md:text-5xl font-light text-dark">
            My Wishlist <span className="font-manrope text-xl text-brown/40 font-light">({items.length})</span>
          </h1>
          <GoldDivider align="left" className="mt-4" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {items.map((product, i) => (
            <motion.div
              key={product._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="product-card group relative"
            >
              <Link href={`/shop/${product.slug}`}>
                <div className="relative aspect-[3/4] bg-ivory overflow-hidden">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-off-white" />
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <button
                      onClick={(e) => { e.preventDefault(); handleMoveToCart(product); }}
                      className="btn-gold text-xs px-4 py-2 flex items-center gap-1.5"
                    >
                      <ShoppingBag size={12} /> Add to Cart
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  {product.category && (
                    <p className="font-poppins text-[10px] tracking-[2px] text-gold uppercase mb-1">
                      {typeof product.category === 'string' ? product.category : product.category.name}
                    </p>
                  )}
                  <h3 className="font-cormorant text-lg font-medium text-dark leading-tight mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="font-cormorant text-lg font-semibold text-dark">
                    {formatPrice(product.discountPrice || product.price)}
                  </p>
                  {product.discountPrice && (
                    <p className="font-manrope text-xs text-brown/40 line-through">
                      {formatPrice(product.price)}
                    </p>
                  )}
                </div>
              </Link>

              {/* Remove from Wishlist */}
              <button
                onClick={() => { toggle(product); toast('Removed from wishlist'); }}
                className="absolute top-3 right-3 w-8 h-8 bg-white/90 flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors shadow-sm"
                aria-label="Remove from wishlist"
              >
                <Trash2 size={13} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-off-white pt-8">
          <Link href="/shop" className="font-poppins text-[11px] tracking-[3px] uppercase text-brown/50 hover:text-gold transition-colors">
            ← Continue Shopping
          </Link>
          <button
            onClick={() => { items.forEach(p => addItem(p)); toast.success('All items added to cart'); }}
            className="btn-gold flex items-center gap-2"
            id="add-all-to-cart-btn"
          >
            <ShoppingBag size={14} /> Add All to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
