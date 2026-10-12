import { screen, fireEvent, waitFor } from '@testing-library/react';
import { Products } from '../Products';
import { renderWithProviders } from '../../../test-utils';
import { useFavoritesStore } from '../../favorites/favoritesStore';
import type { Product } from '../productsSlice';

describe('Products component integration tests with RTL', () => {
  const sampleProducts: Product[] = [
    {
      id: 1,
      title: 'Fjallraven Backpack',
      price: 109.95,
      description: 'Durable backpack',
      image: 'https://fakestoreapi.com/img/backpack.jpg',
    },
    {
      id: 2,
      title: 'Casual T-Shirt',
      price: 22.3,
      description: 'Comfortable t-shirt',
      image: 'https://fakestoreapi.com/img/tshirt.jpg',
    },
  ];

  beforeEach(() => {
    // Reset Zustand store state before each test
    useFavoritesStore.setState({ favorites: [] });
    jest.restoreAllMocks();
  });

  it('should render loading indicator when status is loading', () => {
    renderWithProviders(<Products />, {
      preloadedState: {
        products: {
          items: [],
          status: 'loading',
          error: null,
        },
      },
    });

    expect(screen.getByText('Đang tải sản phẩm...')).toBeInTheDocument();
  });

  it('should render error message when status is failed', () => {
    renderWithProviders(<Products />, {
      preloadedState: {
        products: {
          items: [],
          status: 'failed',
          error: 'Không thể kết nối đến máy chủ',
        },
      },
    });

    expect(
      screen.getByText('Lỗi: Không thể kết nối đến máy chủ')
    ).toBeInTheDocument();
  });

  it('should fetch and display products on mount when initial status is idle (Async API mock)', async () => {
    // Mock API fetch response
    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => sampleProducts,
    } as Response);

    renderWithProviders(<Products />, {
      preloadedState: {
        products: {
          items: [],
          status: 'idle',
          error: null,
        },
      },
    });

    // Wait for the async API request to resolve and products to render
    await waitFor(() => {
      expect(screen.getByText('Fjallraven Backpack')).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://fakestoreapi.com/products?limit=5'
    );
    expect(screen.getByText('Casual T-Shirt')).toBeInTheDocument();
    expect(screen.getByText('$109.95')).toBeInTheDocument();
  });

  it('should dispatch addToCart when "Thêm vào giỏ" button is clicked', () => {
    const { store } = renderWithProviders(<Products />, {
      preloadedState: {
        products: {
          items: sampleProducts,
          status: 'succeeded',
          error: null,
        },
        cart: {
          items: [],
        },
      },
    });

    const addButtons = screen.getAllByRole('button', { name: 'Thêm vào giỏ' });
    expect(addButtons).toHaveLength(2);

    // Click "Thêm vào giỏ" for the first product
    fireEvent.click(addButtons[0]);

    // Verify product added to Redux cart store
    const cartItems = store.getState().cart.items;
    expect(cartItems).toHaveLength(1);
    expect(cartItems[0].id).toBe(sampleProducts[0].id);
    expect(cartItems[0].title).toBe(sampleProducts[0].title);
    expect(cartItems[0].quantity).toBe(1);
  });

  it('should toggle favorite status when "Yêu thích" button is clicked', () => {
    renderWithProviders(<Products />, {
      preloadedState: {
        products: {
          items: sampleProducts,
          status: 'succeeded',
          error: null,
        },
      },
    });

    const favoriteButtons = screen.getAllByRole('button', { name: 'Yêu thích' });
    expect(favoriteButtons).toHaveLength(2);

    // Click "Yêu thích" on first product
    fireEvent.click(favoriteButtons[0]);

    // Button text should now update to "Bỏ yêu thích"
    expect(screen.getByRole('button', { name: 'Bỏ yêu thích' })).toBeInTheDocument();
    expect(useFavoritesStore.getState().favorites).toHaveLength(1);
    expect(useFavoritesStore.getState().favorites[0].id).toBe(sampleProducts[0].id);

    // Click again to unfavorite
    const unfavoriteButton = screen.getByRole('button', { name: 'Bỏ yêu thích' });
    fireEvent.click(unfavoriteButton);

    // Should change back to "Yêu thích"
    expect(screen.queryByRole('button', { name: 'Bỏ yêu thích' })).not.toBeInTheDocument();
    expect(useFavoritesStore.getState().favorites).toHaveLength(0);
  });
});
