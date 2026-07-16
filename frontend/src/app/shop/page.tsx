'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown, Grid3X3, List, Loader2 } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Product } from '@/types';
import api from '@/lib/api';
import { SORT_OPTIONS } from '@/lib/constants';
import { useSearchParams, useRouter } from 'next/navigation';

const MATERIALS = ['Gold', 'Silver', 'Rose Gold', 'Platinum', 'Oxidised Silver'];
const STONES = ['Diamond', 'Ruby', 'Emerald', 'Pearl', 'Sapphire', 'Kundan'];
const PRICE_RANGES = [
  { label: 'Under ₹5,000', min: 0, max: 5000 },
  { label: '₹5,000 – ₹15,000', min: 5000, max: 15000 },
  { label: '₹15,000 – ₹30,000', min: 15000, max: 30000 },
  { label: '₹30,000 – ₹60,000', min: 30000, max: 60000 },
  { label: 'Above ₹60,000', min: 60000, max: 999999 },
];

// Inner component that uses useSearchParams — must be inside Suspense
function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    sort: searchParams.get('sort') || '-createdAt',
    material: searchParams.get('material') || '',
    stone: searchParams.get('stone') || '',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
  });

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.keyword) params.append('keyword', filters.keyword);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.material) params.append('material', filters.material);
      if (filters.stone) params.append('stone', filters.stone);
      if (filters.priceMin) params.append('price[gte]', filters.priceMin);
      if (filters.priceMax) params.append('price[lte]', filters.priceMax);
      params.append('page', String(currentPage));
      params.append('limit', '12');
      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentPage]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const applyPriceRange = (min: number, max: number) => {
    setFilters(f => ({ ...f, priceMin: String(min), priceMax: String(max) }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ keyword: '', sort: '-createdAt', material: '', stone: '', priceMin: '', priceMax: '' });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-cream pt-24">
      {/* Header */}
      <div className="bg-dark py-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader label="Discover" title="The Collection" subtitle={`${total} handcrafted pieces`} light />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-off-white">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brown/40" />
            <input
              type="text"
              placeholder="Search jewelry..."
              value={filters.keyword}
              onChange={e => { setFilters(f => ({ ...f, keyword: e.target.value })); setCurrentPage(1); }}
              className="luxury-input pl-10 text-sm"
              id="shop-search"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Filter Toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 font-poppins text-xs tracking-wider uppercase border border-brown/20 px-4 py-2.5 hover:border-gold hover:text-gold transition-colors"
            >
              <SlidersHorizontal size={14} />
              Filters
              {(filters.material || filters.stone || filters.priceMin) && (
                <span className="w-2 h-2 bg-gold rounded-full" />
              )}
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={filters.sort}
                onChange={e => { setFilters(f => ({ ...f, sort: e.target.value })); setCurrentPage(1); }}
                className="luxury-input pr-8 text-xs font-poppins tracking-wider appearance-none"
                id="shop-sort"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/40 pointer-events-none" />
            </div>

            {/* View Mode */}
            <div className="flex gap-1">
              <button onClick={() => setViewMode('grid')} className={`p-2.5 border transition-colors ${viewMode === 'grid' ? 'border-gold text-gold bg-gold/5' : 'border-brown/20 text-brown/40 hover:border-gold hover:text-gold'}`} aria-label="Grid view">
                <Grid3X3 size={14} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2.5 border transition-colors ${viewMode === 'list' ? 'border-gold text-gold bg-gold/5' : 'border-brown/20 text-brown/40 hover:border-gold hover:text-gold'}`} aria-label="List view">
                <List size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-ivory border border-off-white p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Price Range */}
                <div>
                  <h4 className="font-poppins text-[11px] tracking-[3px] uppercase text-gold mb-4">Price Range</h4>
                  <div className="space-y-2">
                    {PRICE_RANGES.map(range => (
                      <button
                        key={range.label}
                        onClick={() => applyPriceRange(range.min, range.max)}
                        className={`block w-full text-left font-manrope text-sm px-3 py-2 transition-colors ${
                          filters.priceMin === String(range.min) && filters.priceMax === String(range.max)
                            ? 'text-gold bg-gold/10'
                            : 'text-dark hover:text-gold'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Material */}
                <div>
                  <h4 className="font-poppins text-[11px] tracking-[3px] uppercase text-gold mb-4">Material</h4>
                  <div className="space-y-2">
                    {MATERIALS.map(mat => (
                      <button
                        key={mat}
                        onClick={() => { setFilters(f => ({ ...f, material: f.material === mat ? '' : mat })); setCurrentPage(1); }}
                        className={`block w-full text-left font-manrope text-sm px-3 py-2 transition-colors ${
                          filters.material === mat ? 'text-gold bg-gold/10' : 'text-dark hover:text-gold'
                        }`}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stone */}
                <div>
                  <h4 className="font-poppins text-[11px] tracking-[3px] uppercase text-gold mb-4">Stone</h4>
                  <div className="space-y-2">
                    {STONES.map(stone => (
                      <button
                        key={stone}
                        onClick={() => { setFilters(f => ({ ...f, stone: f.stone === stone ? '' : stone })); setCurrentPage(1); }}
                        className={`block w-full text-left font-manrope text-sm px-3 py-2 transition-colors ${
                          filters.stone === stone ? 'text-gold bg-gold/10' : 'text-dark hover:text-gold'
                        }`}
                      >
                        {stone}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear */}
                <div className="md:col-span-3 flex justify-end">
                  <button onClick={clearFilters} className="flex items-center gap-2 font-poppins text-xs tracking-wider text-brown/60 hover:text-gold transition-colors">
                    <X size={12} /> Clear All Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        {isLoading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[3/4] shimmer" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center">
            <h3 className="font-cormorant text-3xl text-dark mb-3">No pieces found</h3>
            <p className="font-manrope text-brown/60 mb-6">Try adjusting your filters or search term</p>
            <button onClick={clearFilters} className="btn-outline-gold">Clear Filters</button>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
              {products.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-16">
                {[...Array(pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`w-10 h-10 font-poppins text-sm transition-all ${
                      currentPage === i + 1
                        ? 'bg-gold text-white'
                        : 'border border-brown/20 text-dark hover:border-gold hover:text-gold'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Page wrapper with Suspense boundary
export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream pt-24 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-gold" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
