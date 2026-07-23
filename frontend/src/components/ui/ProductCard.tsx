'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { toggle, isInWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const inWishlist = isInWishlist(product._id);
  const mainImage = product.images[0]?.url || '/placeholder-jewelry.jpg';
  const hoverImage = product.images[1]?.url || mainImage;
  const discount = product.discountPrice ? calculateDiscount(product.price, product.discountPrice) : 0;

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    await toggle(product);
    toast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist ♥');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="product-card group relative"
    >
      <Link href={`/shop/${product.slug}`}>
        {/* Image */}
        <div className="product-card-image aspect-[3/4] bg-ivory relative overflow-hidden">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover group-hover:opacity-0 transition-opacity duration-500"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          <Image
            src={hoverImage}
            alt={product.name}
            fill
            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {product.isNewArrival && (
              <span className="luxury-badge text-[9px]">New</span>
            )}
            {discount > 0 && (
              <span className="luxury-badge text-[9px]" style={{ background: '#473428' }}>
                {discount}% OFF
              </span>
            )}
            {product.isBestSeller && (
              <span className="luxury-badge text-[9px]" style={{ background: '#1D1D1D' }}>
                Best Seller
              </span>
            )}
            <span
              className="text-[8px] font-poppins tracking-[2px] uppercase px-2 py-0.5"
              style={{ background: 'rgba(200,155,60,0.15)', color: '#C89B3C', border: '1px solid rgba(200,155,60,0.4)' }}
            >
              Anti-Tarnish
            </span>
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <button
              onClick={handleWishlist}
              className="w-9 h-9 bg-white flex items-center justify-center shadow-sm hover:bg-gold hover:text-white transition-colors duration-200"
              aria-label="Add to wishlist"
            >
              <Heart
                size={14}
                className={inWishlist ? 'fill-gold text-gold' : 'text-dark'}
              />
            </button>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-9 h-9 bg-white flex items-center justify-center shadow-sm hover:bg-gold hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Add to cart"
            >
              <ShoppingBag size={14} className="text-dark" />
            </button>
            <Link
              href={`/shop/${product.slug}`}
              className="w-9 h-9 bg-white flex items-center justify-center shadow-sm hover:bg-gold hover:text-white transition-colors duration-200"
              aria-label="Quick view"
            >
              <Eye size={14} className="text-dark" />
            </Link>
          </div>

          {/* Stock Warning */}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="absolute bottom-0 left-0 right-0 bg-brown/90 py-1.5 px-3 text-white text-[10px] font-poppins tracking-widest text-center z-10">
              Only {product.stock} left
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
              <span className="font-poppins text-xs tracking-widest text-dark uppercase bg-white/80 px-4 py-2">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          {product.category && (
            <p className="font-poppins text-[10px] tracking-[3px] text-gold uppercase mb-1">
              {product.category.name}
            </p>
          )}
          <h3 className="font-cormorant text-lg font-medium text-dark leading-tight mb-2 group-hover:text-brown transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>

          {/* Star Rating */}
          {product.numReviews > 0 && (
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={i < Math.floor(product.rating) ? 'star-filled text-xs' : 'star-empty text-xs'}
                >
                  ★
                </span>
              ))}
              <span className="font-manrope text-[11px] text-brown/60 ml-1">
                ({product.numReviews})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-cormorant text-xl font-semibold text-dark">
              {formatPrice(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <span className="font-manrope text-sm text-brown/40 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
