export const SITE_NAME = 'House of Anvera';
export const SITE_TAGLINE = 'Luxury Jewelry. Timeless Elegance.';
export const SITE_DESCRIPTION = 'Discover our curated collection of handcrafted luxury jewelry — bridal, traditional, and contemporary pieces that celebrate your most precious moments.';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofanvera.com';

export const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'New Arrivals', href: '/shop?sort=newest' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const COLLECTIONS = [
  { name: 'Bridal', slug: 'bridal', image: '/collections/bridal.jpg' },
  { name: 'Minimal', slug: 'minimal', image: '/collections/minimal.jpg' },
  { name: 'Traditional', slug: 'traditional', image: '/collections/traditional.jpg' },
  { name: 'Luxury', slug: 'luxury', image: '/collections/luxury.jpg' },
  { name: 'Limited Edition', slug: 'limited-edition', image: '/collections/limited.jpg' },
  { name: 'Festival', slug: 'festival', image: '/collections/festival.jpg' },
];

export const SORT_OPTIONS = [
  { label: 'Newest', value: '-createdAt' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
  { label: 'Most Popular', value: '-rating' },
  { label: 'Best Sellers', value: '-numReviews' },
];

export const SHIPPING_THRESHOLD = 2000;
export const SHIPPING_COST = 99;
export const TAX_RATE = 0.03;

export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'text-amber-600 bg-amber-50' },
  { value: 'packed', label: 'Packed', color: 'text-blue-600 bg-blue-50' },
  { value: 'shipped', label: 'Shipped', color: 'text-purple-600 bg-purple-50' },
  { value: 'delivered', label: 'Delivered', color: 'text-green-600 bg-green-50' },
  { value: 'cancelled', label: 'Cancelled', color: 'text-red-600 bg-red-50' },
  { value: 'refunded', label: 'Refunded', color: 'text-gray-600 bg-gray-50' },
];

export const LUXURY_FEATURES = [
  { icon: 'shield', title: 'Lifetime Warranty', description: 'Every piece comes with our lifetime craftsmanship guarantee' },
  { icon: 'award', title: 'Hallmarked Gold', description: 'BIS hallmarked jewelry for purity you can trust' },
  { icon: 'package', title: 'Luxury Packaging', description: 'Elegantly packaged in our signature gift boxes' },
  { icon: 'truck', title: 'Free Shipping', description: 'Complimentary insured shipping on orders above ₹2,000' },
  { icon: 'refresh', title: 'Easy Returns', description: '15-day hassle-free return & exchange policy' },
  { icon: 'phone', title: '24/7 Support', description: 'Dedicated concierge service for all your needs' },
];
