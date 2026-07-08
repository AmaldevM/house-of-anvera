import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import { Product } from '@/types';

interface WishlistState {
  items: Product[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  toggle: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      fetchWishlist: async () => {
        set({ isLoading: true });
        try {
          const { data } = await api.get('/wishlist');
          set({ items: data.wishlist, isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      toggle: async (product) => {
        const isIn = get().isInWishlist(product._id);
        // Optimistic update
        set(state => ({
          items: isIn
            ? state.items.filter(i => i._id !== product._id)
            : [...state.items, product],
        }));
        try {
          await api.post('/wishlist/toggle', { productId: product._id });
        } catch {
          // Revert on failure
          set(state => ({
            items: isIn
              ? [...state.items, product]
              : state.items.filter(i => i._id !== product._id),
          }));
        }
      },

      isInWishlist: (productId) => get().items.some(i => i._id === productId),

      clearWishlist: () => set({ items: [] }),
    }),
    { name: 'hoa-wishlist' }
  )
);
