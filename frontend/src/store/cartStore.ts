import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/types';
import { SHIPPING_COST, SHIPPING_THRESHOLD, TAX_RATE } from '@/lib/constants';

interface CartState {
  items: CartItem[];
  couponCode: string;
  couponDiscount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getShipping: () => number;
  getTax: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: '',
      couponDiscount: 0,

      addItem: (product, quantity = 1) => {
        set(state => {
          const existing = state.items.find(i => i.product._id === product._id);
          if (existing) {
            return {
              items: state.items.map(i =>
                i.product._id === product._id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },

      removeItem: (productId) => {
        set(state => ({ items: state.items.filter(i => i.product._id !== productId) }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set(state => ({
          items: state.items.map(i =>
            i.product._id === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [], couponCode: '', couponDiscount: 0 }),

      applyCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),

      removeCoupon: () => set({ couponCode: '', couponDiscount: 0 }),

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((acc, item) => {
          const price = item.product.discountPrice || item.product.price;
          return acc + price * item.quantity;
        }, 0);
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        return subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
      },

      getTax: () => {
        const { couponDiscount } = get();
        const subtotal = get().getSubtotal();
        return Math.round((subtotal - couponDiscount) * TAX_RATE);
      },

      getTotal: () => {
        const { couponDiscount } = get();
        return get().getSubtotal() - couponDiscount + get().getShipping() + get().getTax();
      },

      getItemCount: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
    }),
    {
      name: 'hoa-cart',
    }
  )
);
