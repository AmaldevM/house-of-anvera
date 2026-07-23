'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, User, Menu, X, Search, ChevronDown } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { cn } from '@/lib/utils';

const MEGA_MENU_COLLECTIONS = [
  { name: 'Jhumka Earrings', href: '/collections/jhumkas', description: 'Traditional & contemporary Jhumka designs' },
  { name: 'Chain & Mala Sets', href: '/collections/chains', description: 'Elakkathali, Chali Mala & more' },
  { name: 'Pendant Sets', href: '/collections/pendants', description: 'Lakshmi pendants & designer sets' },
  { name: 'Bangles & Kadas', href: '/collections/bangles', description: 'Anti-tarnish bangles for daily wear' },
  { name: 'Bridal Collection', href: '/collections/bridal', description: 'Complete bridal jewelry sets' },
  { name: 'Festival Edit', href: '/collections/festival', description: 'Festive & occasion jewellery' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const cartCount = useCartStore(s => s.getItemCount());
  const wishlistCount = useWishlistStore(s => s.items.length);
  const { isAuthenticated, user } = useAuthStore();
  const searchRef = useRef<HTMLInputElement>(null);
  const collectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setCollectionsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (collectionsRef.current && !collectionsRef.current.contains(e.target as Node)) {
        setCollectionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-dark text-white text-center py-2 px-4">
        <p className="font-poppins text-[10px] tracking-[3px] uppercase text-white/80">
          ✨ Anti-Tarnish Guarantee &nbsp;·&nbsp; Free shipping above ₹2,000 &nbsp;·&nbsp;
          <a
            href="https://www.instagram.com/houseofanvera"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:text-gold/80 transition-colors"
          >
            @houseofanvera
          </a>
        </p>
      </div>

      {/* Header */}
      <header
        className={cn(
          'sticky top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled ? 'glass shadow-card' : 'bg-cream',
          'py-4'
        )}
      >
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none flex-shrink-0">
            <span className="font-cormorant text-[22px] font-semibold tracking-[0.15em] text-dark uppercase">
              House of
            </span>
            <span className="font-cormorant text-[22px] font-light tracking-[0.3em] gold-text uppercase -mt-1">
              Anvera
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(link => {
              if (link.label === 'Collections') {
                return (
                  <div key={link.href} className="relative" ref={collectionsRef}>
                    <button
                      className={cn('nav-link flex items-center gap-1', pathname.startsWith('/collections') && 'active')}
                      onClick={() => setCollectionsOpen(v => !v)}
                      onMouseEnter={() => setCollectionsOpen(true)}
                    >
                      {link.label}
                      <ChevronDown size={12} className={cn('transition-transform duration-200', collectionsOpen && 'rotate-180')} />
                    </button>

                    <AnimatePresence>
                      {collectionsOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[480px] bg-white shadow-luxury border border-off-white z-50"
                          onMouseLeave={() => setCollectionsOpen(false)}
                        >
                          <div className="p-6 grid grid-cols-2 gap-1">
                            {MEGA_MENU_COLLECTIONS.map(col => (
                              <Link
                                key={col.href}
                                href={col.href}
                                className="group/col p-3 hover:bg-cream transition-colors duration-150 rounded-sm"
                              >
                                <p className="font-cormorant text-base font-medium text-dark group-hover/col:text-gold transition-colors duration-150">
                                  {col.name}
                                </p>
                                <p className="font-manrope text-[11px] text-brown/60 mt-0.5">
                                  {col.description}
                                </p>
                              </Link>
                            ))}
                          </div>
                          <div className="border-t border-off-white px-6 py-3 flex justify-between items-center">
                            <span className="font-poppins text-[10px] tracking-[3px] text-gold uppercase">
                              View All Collections
                            </span>
                            <Link href="/collections" className="text-xs font-manrope text-brown hover:text-gold transition-colors">
                              →
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'nav-link',
                    (pathname === link.href || pathname.startsWith(link.href + '?')) && 'active'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button
              className="hidden md:flex w-9 h-9 items-center justify-center text-dark hover:text-gold transition-colors"
              onClick={() => setSearchOpen(v => !v)}
              aria-label="Search"
            >
              {searchOpen ? <X size={18} /> : <Search size={18} />}
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative w-9 h-9 flex items-center justify-center text-dark hover:text-gold transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-white text-[9px] font-poppins flex items-center justify-center rounded-full">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative w-9 h-9 flex items-center justify-center text-dark hover:text-gold transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-white text-[9px] font-poppins flex items-center justify-center rounded-full">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              href={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/account') : '/login'}
              className="w-9 h-9 flex items-center justify-center text-dark hover:text-gold transition-colors"
              aria-label="Account"
            >
              <User size={18} />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden w-9 h-9 flex items-center justify-center text-dark"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-off-white"
            >
              <div className="max-w-[1400px] mx-auto px-6 py-4">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-4">
                  <Search size={16} className="text-gold flex-shrink-0" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search for jewelry, collections, styles..."
                    className="flex-1 bg-transparent outline-none font-manrope text-sm text-dark placeholder-brown/40"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-brown/40 hover:text-dark transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-dark/40 z-40 lg:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35 }}
              className="fixed top-0 right-0 h-full w-[300px] bg-cream z-50 flex flex-col overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-off-white">
                <span className="font-cormorant text-lg font-semibold tracking-wider text-dark">Menu</span>
                <button onClick={() => setMenuOpen(false)} className="w-8 h-8 flex items-center justify-center text-dark">
                  <X size={18} />
                </button>
              </div>

              <nav className="flex flex-col p-6 gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        'block font-cormorant text-2xl font-light py-3 border-b border-off-white text-dark hover:text-gold transition-colors',
                        pathname === link.href && 'text-gold'
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto p-6 border-t border-off-white">
                {isAuthenticated ? (
                  <Link href="/account" className="flex items-center gap-3 mb-4 text-dark hover:text-gold transition-colors">
                    <User size={16} />
                    <span className="font-manrope text-sm">My Account</span>
                  </Link>
                ) : (
                  <div className="flex gap-3 mb-4">
                    <Link href="/login" className="btn-outline-gold text-xs px-4 py-2">Sign In</Link>
                    <Link href="/register" className="btn-gold text-xs px-4 py-2">Register</Link>
                  </div>
                )}
                <p className="font-poppins text-[10px] tracking-[3px] text-brown/50 uppercase">
                  House of Anvera
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
