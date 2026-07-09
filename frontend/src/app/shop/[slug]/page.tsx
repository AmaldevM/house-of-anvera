import ProductPageClient from './ProductPageClient';
import { notFound } from 'next/navigation';
import { Product } from '@/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProductData(slug: string): Promise<{ product: Product; relatedProducts: Product[] } | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/products/${slug}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.success || !data.product) return null;

    const product = data.product;

    // Fetch related products (same category)
    let relatedProducts: Product[] = [];
    try {
      const relRes = await fetch(`${apiUrl}/products?category=${product.category._id}&limit=5`, {
        next: { revalidate: 60 },
      });
      if (relRes.ok) {
        const relData = await relRes.json();
        relatedProducts = (relData.products || [])
          .filter((p: Product) => p._id !== product._id)
          .slice(0, 4);
      }
    } catch {
      // Fail silently for related
    }

    return { product, relatedProducts };
  } catch (err) {
    console.error('Error fetching product data:', err);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/products/${slug}`);
    const data = await res.json();
    if (!data.success) return {};
    const p = data.product;
    return {
      title: p.seoTitle || p.name,
      description: p.seoDescription || p.shortDescription || p.description?.slice(0, 160),
      openGraph: {
        images: p.images?.[0] ? [p.images[0].url] : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getProductData(slug);

  if (!data) {
    notFound();
  }

  return (
    <ProductPageClient
      product={data.product}
      relatedProducts={data.relatedProducts}
    />
  );
}
