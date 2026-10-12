import productsReducer, {
  fetchProducts,
  type Product,
} from '../productsSlice';
import { setupStore } from '../../../test-utils';

describe('productsSlice reducer and async thunk', () => {
  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'Fjallraven Backpack',
      price: 109.95,
      description: 'Your perfect pack for everyday use',
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    },
    {
      id: 2,
      title: 'Mens Casual T-Shirts',
      price: 22.3,
      description: 'Slim-fitting style, contrast raglan long sleeve',
      image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
    },
  ];

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('reducer actions', () => {
    it('should return the initial state when passed an unknown action', () => {
      expect(productsReducer(undefined, { type: 'unknown' })).toEqual({
        items: [],
        status: 'idle',
        error: null,
      });
    });

    it('should set status to loading on fetchProducts.pending', () => {
      const initialState = { items: [], status: 'idle' as const, error: null };
      const action = { type: fetchProducts.pending.type };
      const state = productsReducer(initialState, action);

      expect(state.status).toBe('loading');
    });

    it('should set status to succeeded and populate items on fetchProducts.fulfilled', () => {
      const initialState = { items: [], status: 'loading' as const, error: null };
      const action = {
        type: fetchProducts.fulfilled.type,
        payload: mockProducts,
      };
      const state = productsReducer(initialState, action);

      expect(state.status).toBe('succeeded');
      expect(state.items).toEqual(mockProducts);
    });

    it('should set status to failed and set error message on fetchProducts.rejected', () => {
      const initialState = { items: [], status: 'loading' as const, error: null };
      const action = {
        type: fetchProducts.rejected.type,
        error: { message: 'Network error occurred' },
      };
      const state = productsReducer(initialState, action);

      expect(state.status).toBe('failed');
      expect(state.error).toBe('Network error occurred');
    });

    it('should use fallback error message if action.error.message is undefined on rejected', () => {
      const initialState = { items: [], status: 'loading' as const, error: null };
      const action = {
        type: fetchProducts.rejected.type,
        error: {},
      };
      const state = productsReducer(initialState, action);

      expect(state.status).toBe('failed');
      expect(state.error).toBe('Something went wrong');
    });
  });

  describe('fetchProducts async thunk (Async test with mocked API)', () => {
    it('should fetch products successfully from the mocked API and update store state', async () => {
      // Mock global fetch returning 200 OK with mockProducts
      const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      } as Response);

      const store = setupStore();
      const result = await store.dispatch(fetchProducts());

      expect(mockFetch).toHaveBeenCalledWith(
        'https://fakestoreapi.com/products?limit=5'
      );
      expect(result.type).toBe('products/fetchProducts/fulfilled');
      expect(result.payload).toEqual(mockProducts);

      const state = store.getState().products;
      expect(state.status).toBe('succeeded');
      expect(state.items).toEqual(mockProducts);
      expect(state.error).toBeNull();
    });

    it('should dispatch rejected when API returns response with ok: false', async () => {
      // Mock global fetch returning 500 error
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      } as Response);

      const store = setupStore();
      const result = await store.dispatch(fetchProducts());

      expect(result.type).toBe('products/fetchProducts/rejected');
      const state = store.getState().products;
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Failed to fetch products');
      expect(state.items).toEqual([]);
    });

    it('should dispatch rejected when API throws network failure', async () => {
      // Mock global fetch throwing network error
      jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network offline'));

      const store = setupStore();
      const result = await store.dispatch(fetchProducts());

      expect(result.type).toBe('products/fetchProducts/rejected');
      const state = store.getState().products;
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Network offline');
    });
  });
});
