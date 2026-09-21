import { create } from 'zustand';
import type { Product } from '../products/productsSlice';

interface FavoritesState {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
}

export const useFavoritesStore = create<FavoritesState>((set) => ({
  favorites: [],
  toggleFavorite: (product) =>
    set((state) => {
      const isFavorite = state.favorites.some((p) => p.id === product.id);
      if (isFavorite) {
        return {
          favorites: state.favorites.filter((p) => p.id !== product.id),
        };
      } else {
        return {
          favorites: [...state.favorites, product],
        };
      }
    }),
}));
