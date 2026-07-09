import type { Metadata } from 'next';
import { HeroSection } from '@/components/home/HeroSection';
import { LuxuryFeaturesSection } from '@/components/home/LuxuryFeaturesSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { CollectionsSection } from '@/components/home/CollectionsSection';
import { NewArrivalsSection } from '@/components/home/NewArrivalsSection';
import { BrandStorySection } from '@/components/home/BrandStorySection';
import { TrustBanner } from '@/components/home/TrustBanner';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { InstagramSection } from '@/components/home/InstagramSection';

export const metadata: Metadata = {
  title: 'House of Anvera | Handcrafted Luxury Jewelry',
  description: 'Discover our curated collection of handcrafted luxury jewelry — bridal, traditional, and contemporary pieces that celebrate your most precious moments.',
};

async function getFeaturedProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/featured`, {
      next: { revalidate: 300 }, // cache 5 minutes
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

async function getNewArrivals() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/new-arrivals`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, newArrivals] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
  ]);

  return (
    <>
      <HeroSection />
      <LuxuryFeaturesSection />
      <FeaturedProducts products={featuredProducts} />
      <CollectionsSection />
      <NewArrivalsSection products={newArrivals} />
      <BrandStorySection />
      <TrustBanner />
      <TestimonialsSection />
      <InstagramSection />
    </>
  );
}
