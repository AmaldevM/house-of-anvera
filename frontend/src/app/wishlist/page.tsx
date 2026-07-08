'use client';
import { useEffect } from 'react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { ProductCard } from '@/components/ui/ProductCard';
import { GoldDivider } from '@/components/ui/GoldDivider';
import { Heart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';

export default function WishlistPage() {
  const { items, fetchWishlist, isLoading } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) fetchWishlist();
  }, [isAuthenticated, fetchWishlist]);

  return (
    <div className="min-h-screen bg-cream pt-24">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="font-poppins text-[11px] tracking-[4px] text-gold uppercase mb-2">Saved</p>
          <h1 className="font-cormorant text-5xl font-semibold text-dark">My Wishlist</h1>
          <GoldDivider align="left" className="mt-4" />
          {items.length > 0 && (
            <p className="font-manrope text-brown/60 mt-4">
              {items.length} {items.length === 1 ? 'piece' : 'pieces'} saved
            </p>
          )}
        </div>

        {!isAuthenticated ? (
          <div className="py-24 text-center">
            <Heart size={56} className="text-brown/20 mx-auto mb-5" />
            <h2 className="font-cormorant text-3xl text-dark mb-3">Sign in to view your wishlist</h2>
            <p className="font-manrope text-brown/60 mb-8">Save pieces you love and access them across devices.</p>
            <Link href="/login?redirect=/wishlist" className="btn-gold">Sign In</Link>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] shimmer" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-24 text-center">
            <Heart size={56} className="text-brown/20 mx-auto mb-5" />
            <h2 className="font-cormorant text-3xl text-dark mb-3">Your wishlist is empty</h2>
            <p className="font-manrope text-brown/60 mb-8">
              Browse our collections and save pieces that speak to you.
            </p>
            <Link href="/shop" className="btn-gold inline-flex items-center gap-2">
              <ShoppingBag size={14} /> Explore Collection
            </Link>
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
