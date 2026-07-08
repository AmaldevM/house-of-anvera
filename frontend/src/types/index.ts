export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin';
  addresses?: Address[];
  wishlist?: string[];
  isVerified: boolean;
}

export interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export interface ProductImage {
  url: string;
  publicId: string;
  alt?: string;
}

export interface Review {
  _id: string;
  user: { _id: string; name: string; avatar?: string };
  rating: number;
  comment: string;
  images?: string[];
  isApproved: boolean;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  discountPrice?: number;
  category: { _id: string; name: string; slug: string };
  collection?: { _id: string; name: string; slug: string };
  images: ProductImage[];
  video?: { url: string; publicId: string };
  stock: number;
  SKU?: string;
  material?: string;
  stone?: string;
  weight?: string;
  color?: string;
  dimensions?: string;
  careInstructions?: string;
  reviews: Review[];
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isActive?: boolean;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: { url: string };
  parent?: Category;
}

export interface Collection {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  banner?: { url: string };
  products?: Product[];
  isFeatured: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  user: User | string;
  orderItems: Array<{
    product: Product | string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }>;
  shippingAddress: Address;
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingStatus: 'pending' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'refund_requested' | 'refunded';
  trackingNumber?: string;
  itemsTotal: number;
  couponDiscount: number;
  shippingCost: number;
  tax: number;
  total: number;
  createdAt: string;
  deliveredAt?: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: { url: string };
  author?: { name: string; avatar?: string };
  category: string;
  tags?: string[];
  isPublished: boolean;
  publishedAt?: string;
  views: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  total: number;
  pages: number;
  count: number;
  data?: T[];
}
