'use client';
import Link from 'next/link';
import { ExternalLink, Globe, Play, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const FOOTER_LINKS = {
  shop: [
    { label: 'All Jewellery', href: '/shop' },
    { label: 'Jhumka Earrings', href: '/collections/jhumkas' },
    { label: 'Chain & Mala Sets', href: '/collections/chains' },
    { label: 'Pendant Sets', href: '/collections/pendants' },
    { label: 'Bangles & Kadas', href: '/collections/bangles' },
    { label: 'Bridal Collection', href: '/collections/bridal' },
  ],
  help: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping Policy', href: '/shipping' },
    { label: 'Return Policy', href: '/returns' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Anti-Tarnish Care Guide', href: '/care-guide' },
  ],
  account: [
    { label: 'My Account', href: '/account' },
    { label: 'My Orders', href: '/account' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'Track Order', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

const SOCIAL_LINKS = [
  { icon: ExternalLink, href: 'https://www.instagram.com/houseofanvera?igsh=NTJ1NWY5dmc2OTBw', label: 'Instagram' },
  { icon: Globe, href: 'https://facebook.com/houseofanvera', label: 'Facebook' },
  { icon: Play, href: 'https://youtube.com/@houseofanvera', label: 'YouTube' },
];

export function Footer() {
  return (
    <footer className="bg-dark text-white">
      {/* Newsletter Banner */}
      <div className="border-b border-white/10 py-14 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <p className="font-poppins text-[11px] tracking-[4px] text-gold uppercase mb-3">
              Join the Inner Circle
            </p>
            <h3 className="font-cormorant text-4xl font-light leading-tight">
              Exclusive Access &amp; <br className="hidden lg:block" />
              <em className="font-light not-italic" style={{ color: '#DDB96A' }}>Early Launches</em>
            </h3>
            <p className="font-manrope text-sm text-white/50 mt-3 max-w-sm">
              Be the first to know about new collections, private events, and members-only offers.
            </p>
          </div>
          <form
            className="flex w-full lg:w-auto gap-0"
            onSubmit={e => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 lg:w-80 px-5 py-4 bg-white/10 border border-white/20 text-white placeholder-white/40 font-manrope text-sm outline-none focus:border-gold transition-colors"
            />
            <button
              type="submit"
              className="btn-gold flex items-center gap-2 whitespace-nowrap"
            >
              Subscribe <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="py-16 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex flex-col leading-none mb-6">
              <span className="font-cormorant text-2xl font-semibold tracking-[0.15em] text-white uppercase">
                House of
              </span>
              <span
                className="font-cormorant text-2xl font-light tracking-[0.3em] uppercase -mt-1"
                style={{
                  background: 'linear-gradient(135deg, #C89B3C 0%, #DDB96A 40%, #A47425 60%, #C89B3C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Anvera
              </span>
            </Link>
            <p className="font-manrope text-sm text-white/50 leading-relaxed mb-8 max-w-xs">
              Handcrafted luxury jewelry celebrating India&apos;s rich heritage through timeless
              craftsmanship and contemporary design.
            </p>

            {/* Contact Info */}
            <div className="flex flex-col gap-3 mb-8">
              <a
                href="mailto:hackathon039@gmail.com"
                className="flex items-center gap-3 text-white/60 hover:text-gold transition-colors font-manrope text-sm"
              >
                <Mail size={14} className="text-gold flex-shrink-0" />
                hackathon039@gmail.com
              </a>
              <a
                href="tel:+919400856725"
                className="flex items-center gap-3 text-white/60 hover:text-gold transition-colors font-manrope text-sm"
              >
                <Phone size={14} className="text-gold flex-shrink-0" />
                +91 9400 856 725
              </a>
              <div className="flex items-start gap-3 text-white/60 font-manrope text-sm">
                <MapPin size={14} className="text-gold flex-shrink-0 mt-0.5" />
                <span>Kerala, India</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-white/20 flex items-center justify-center text-white/60 hover:border-gold hover:text-gold transition-all duration-200"
                  aria-label={label}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-poppins text-[10px] tracking-[3px] text-gold uppercase mb-6">
              Shop
            </h4>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.shop.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-manrope text-sm text-white/50 hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-poppins text-[10px] tracking-[3px] text-gold uppercase mb-6">
              Help
            </h4>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.help.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-manrope text-sm text-white/50 hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h4 className="font-poppins text-[10px] tracking-[3px] text-gold uppercase mb-6">
              Account
            </h4>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.account.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-manrope text-sm text-white/50 hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-white/10 py-8 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-center gap-8">
          {[
            'BIS Hallmarked',
            'Lifetime Warranty',
            'Insured Shipping',
            'Secure Payments',
            '15-Day Returns',
          ].map(badge => (
            <div key={badge} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-gold" />
              <span className="font-poppins text-[10px] tracking-[2px] text-white/40 uppercase">
                {badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-5 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-manrope text-xs text-white/30">
            © {new Date().getFullYear()} House of Anvera. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="font-manrope text-xs text-white/30 hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="font-manrope text-xs text-white/30 hover:text-gold transition-colors">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="font-manrope text-xs text-white/30 hover:text-gold transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
