'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Star, ChevronLeft, ChevronRight, ZoomIn, Minus, Plus, Share2, Check } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { ProductCard } from '@/components/ui/ProductCard';
import { GoldDivider } from '@/components/ui/GoldDivider';
import api from '@/lib/api';
import { toast } from 'sonner';
import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${params.slug}`);
    const data = await res.json();
    if (!data.success) return {};
    const p = data.product;
    return {
      title: p.seoTitle || p.name,
      description: p.seoDescription || p.shortDescription || p.description?.slice(0, 160),
      openGraph: { images: [p.images[0]?.url] },
    };
  } catch { return {}; }
}

export default function ProductDetailPage({ params }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [isLoading, setIsLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addItem } = useCartStore();
  const { toggle, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get(`/products/${params.slug}`);
        if (!data.success) return notFound();
        setProduct(data.product);
        // Fetch related
        const rel = await api.get(`/products?category=${data.product.category._id}&limit=4`);
        setRelatedProducts(rel.data.products.filter((p: Product) => p._id !== data.product._id).slice(0, 4));
      } catch {
        notFound();
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [params.slug]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) addItem(product);
    setAddedToCart(true);
    toast.success(`${product.name} added to cart`);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = async () => {
    if (!product) return;
    await toggle(product);
    toast(isInWishlist(product._id) ? 'Removed from wishlist' : 'Added to wishlist ♥');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream pt-24">
        <div className="max-w-[1400px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="aspect-square shimmer" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => <div key={i} className={`shimmer h-8 ${i === 0 ? 'w-2/3' : i === 1 ? 'w-1/2' : 'w-full'}`} />)}
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const inWishlist = isInWishlist(product._id);
  const discount = product.discountPrice ? calculateDiscount(product.price, product.discountPrice) : 0;
  const displayPrice = product.discountPrice || product.price;

  return (
    <div className="min-h-screen bg-cream pt-24">
      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 font-poppins text-[11px] tracking-wider text-brown/50">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-gold transition-colors">Shop</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/shop?category=${product.category.slug}`} className="hover:text-gold transition-colors">{product.category.name}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-dark">{product.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <motion.div
            className="relative aspect-square bg-ivory overflow-hidden group"
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {product.images[selectedImage] && (
              <Image
                src={product.images[selectedImage].url}
                alt={product.images[selectedImage].alt || product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
            )}
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNewArrival && <span className="luxury-badge text-[10px]">New Arrival</span>}
              {discount > 0 && <span className="luxury-badge bg-brown text-[10px]">{discount}% OFF</span>}
            </div>
            {/* Zoom hint */}
            <div className="absolute bottom-4 right-4 w-9 h-9 bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn size={14} className="text-dark" />
            </div>
            {/* Nav arrows */}
            {product.images.length > 1 && (
              <>
                <button onClick={() => setSelectedImage(i => (i - 1 + product.images.length) % product.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gold hover:text-white">
                  <ChevronLeft size={14} />
                </button>
                <button onClick={() => setSelectedImage(i => (i + 1) % product.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gold hover:text-white">
                  <ChevronRight size={14} />
                </button>
              </>
            )}
          </motion.div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 shrink-0 overflow-hidden transition-all ${selectedImage === i ? 'ring-2 ring-gold' : 'ring-1 ring-transparent hover:ring-gold/50'}`}
                >
                  <Image src={img.url} alt={img.alt || `${product.name} ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {/* Category */}
          {product.category && (
            <p className="font-poppins text-[11px] tracking-[3px] text-gold uppercase mb-3">{product.category.name}</p>
          )}
          <h1 className="font-cormorant text-4xl md:text-5xl font-semibold text-dark mb-4 leading-tight">{product.name}</h1>

          {/* Rating */}
          {product.numReviews > 0 && (
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'} />
                ))}
              </div>
              <span className="font-manrope text-sm text-brown/60">{product.rating.toFixed(1)} ({product.numReviews} reviews)</span>
            </div>
          )}

          <GoldDivider align="left" className="mb-6" />

          {/* Price */}
          <div className="flex items-end gap-3 mb-6">
            <span className="font-cormorant text-4xl font-semibold text-dark">{formatPrice(displayPrice)}</span>
            {product.discountPrice && (
              <span className="font-manrope text-lg text-brown/40 line-through mb-1">{formatPrice(product.price)}</span>
            )}
            {discount > 0 && (
              <span className="font-poppins text-sm text-white bg-gold px-2 py-0.5 mb-1">{discount}% OFF</span>
            )}
          </div>

          {/* Stock */}
          <div className="mb-6">
            {product.stock === 0 ? (
              <span className="font-poppins text-xs tracking-wider text-red-500 uppercase">Out of Stock</span>
            ) : product.stock <= 5 ? (
              <span className="font-poppins text-xs tracking-wider text-amber-600 uppercase">Only {product.stock} left</span>
            ) : (
              <span className="font-poppins text-xs tracking-wider text-green-600 uppercase flex items-center gap-1">
                <Check size={12} /> In Stock
              </span>
            )}
          </div>

          {/* SKU */}
          {product.SKU && (
            <p className="font-manrope text-xs text-brown/40 mb-6">SKU: {product.SKU}</p>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-poppins text-xs tracking-[2px] uppercase text-brown/60">Qty:</span>
            <div className="flex items-center border border-brown/20">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:text-gold transition-colors">
                <Minus size={14} />
              </button>
              <span className="w-12 text-center font-manrope font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="w-10 h-10 flex items-center justify-center hover:text-gold transition-colors">
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 btn-gold flex items-center justify-center gap-2 ${addedToCart ? 'bg-green-600' : ''}`}
              id="add-to-cart-btn"
            >
              {addedToCart ? <><Check size={16} /> Added!</> : <><ShoppingBag size={16} /> Add to Cart</>}
            </button>
            <Link
              href="/checkout"
              className="flex-1 btn-dark flex items-center justify-center gap-2"
              onClick={() => { if (product && product.stock > 0) addItem(product, quantity); }}
            >
              Buy Now
            </Link>
            <button
              onClick={handleWishlist}
              className={`w-12 h-12 border flex items-center justify-center transition-all ${inWishlist ? 'border-gold bg-gold text-white' : 'border-brown/20 text-dark hover:border-gold hover:text-gold'}`}
              aria-label="Add to wishlist"
            >
              <Heart size={18} className={inWishlist ? 'fill-white' : ''} />
            </button>
            <button className="w-12 h-12 border border-brown/20 flex items-center justify-center text-dark hover:border-gold hover:text-gold transition-colors" aria-label="Share">
              <Share2 size={16} />
            </button>
          </div>

          {/* Quick Specs */}
          <div className="bg-ivory p-5 space-y-3 mb-8">
            {[
              { label: 'Material', value: product.material },
              { label: 'Stone', value: product.stone },
              { label: 'Weight', value: product.weight },
              { label: 'Color', value: product.color },
              { label: 'Collection', value: product.collection?.name },
            ].filter(s => s.value).map(spec => (
              <div key={spec.label} className="flex justify-between items-center py-2 border-b border-off-white last:border-0">
                <span className="font-poppins text-[11px] tracking-[2px] uppercase text-brown/50">{spec.label}</span>
                <span className="font-manrope text-sm text-dark font-medium">{spec.value}</span>
              </div>
            ))}
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { title: 'Hallmarked', sub: 'BIS Certified' },
              { title: 'Free Returns', sub: '15-day policy' },
              { title: 'Insured Delivery', sub: 'Safe & secure' },
            ].map(g => (
              <div key={g.title} className="text-center p-3 border border-off-white">
                <p className="font-cormorant text-base font-semibold text-dark">{g.title}</p>
                <p className="font-manrope text-[11px] text-brown/50">{g.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs: Description / Specs / Reviews */}
      <div className="max-w-[1400px] mx-auto px-6 py-12 border-t border-off-white">
        <div className="flex gap-0 border-b border-off-white mb-8">
          {(['description', 'specs', 'reviews'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-poppins text-[11px] tracking-[3px] uppercase px-8 py-4 transition-colors border-b-2 -mb-px ${
                activeTab === tab ? 'border-gold text-gold' : 'border-transparent text-brown/50 hover:text-dark'
              }`}
            >
              {tab === 'reviews' ? `Reviews (${product.reviews.filter(r => r.isApproved).length})` : tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'description' && (
            <motion.div key="desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="max-w-2xl font-manrope text-brown/70 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </div>
              {product.careInstructions && (
                <div className="mt-8 p-6 bg-ivory border-l-2 border-gold">
                  <h4 className="font-cormorant text-xl font-semibold text-dark mb-3">Care Instructions</h4>
                  <p className="font-manrope text-sm text-brown/70 leading-relaxed">{product.careInstructions}</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'specs' && (
            <motion.div key="specs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-lg">
              <div className="space-y-1">
                {[
                  { label: 'Material', value: product.material },
                  { label: 'Stone', value: product.stone },
                  { label: 'Weight', value: product.weight },
                  { label: 'Color', value: product.color },
                  { label: 'Dimensions', value: product.dimensions },
                  { label: 'SKU', value: product.SKU },
                  { label: 'Collection', value: product.collection?.name },
                  { label: 'Tags', value: product.tags?.join(', ') },
                ].filter(s => s.value).map(spec => (
                  <div key={spec.label} className="flex justify-between py-3 border-b border-off-white">
                    <span className="font-poppins text-[11px] tracking-[2px] uppercase text-brown/50 w-32">{spec.label}</span>
                    <span className="font-manrope text-sm text-dark flex-1">{spec.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {product.reviews.filter(r => r.isApproved).length === 0 ? (
                <div className="py-12 text-center">
                  <p className="font-cormorant text-2xl text-dark mb-2">No reviews yet</p>
                  <p className="font-manrope text-sm text-brown/60">Be the first to review this piece</p>
                </div>
              ) : (
                <div className="space-y-6 max-w-2xl">
                  {product.reviews.filter(r => r.isApproved).map(review => (
                    <div key={review._id} className="p-6 bg-ivory border border-off-white">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-cormorant text-lg font-semibold text-dark">{review.user?.name || 'Customer'}</p>
                          <div className="flex gap-0.5 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} className={i < review.rating ? 'star-filled' : 'star-empty'} />
                            ))}
                          </div>
                        </div>
                        <span className="font-manrope text-xs text-brown/40">
                          {new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="font-manrope text-sm text-brown/70 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="bg-ivory py-16 px-6">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="font-cormorant text-3xl font-semibold text-dark mb-2 text-center">You May Also Love</h2>
            <GoldDivider className="mb-10" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
