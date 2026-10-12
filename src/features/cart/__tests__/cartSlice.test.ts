import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  type CartItem,
} from '../cartSlice';
import type { Product } from '../../products/productsSlice';

describe('cartSlice reducer', () => {
  const initialProduct: Product = {
    id: 1,
    title: 'Test Product 1',
    price: 25.5,
    description: 'Test description',
    image: 'https://example.com/item1.jpg',
  };

  const secondProduct: Product = {
    id: 2,
    title: 'Test Product 2',
    price: 40.0,
    description: 'Another test description',
    image: 'https://example.com/item2.jpg',
  };

  it('should return initial state when passed an unknown action', () => {
    expect(cartReducer(undefined, { type: 'unknown' })).toEqual({
      items: [],
    });
  });

  it('should add a new product to cart with quantity 1 when addToCart is dispatched', () => {
    const previousState = { items: [] };
    const actual = cartReducer(previousState, addToCart(initialProduct));

    expect(actual.items).toHaveLength(1);
    expect(actual.items[0]).toEqual({
      ...initialProduct,
      quantity: 1,
    });
  });

  it('should increment quantity if the product is already in the cart', () => {
    const existingCartItem: CartItem = {
      ...initialProduct,
      quantity: 1,
    };
    const previousState = { items: [existingCartItem] };

    const actual = cartReducer(previousState, addToCart(initialProduct));

    expect(actual.items).toHaveLength(1);
    expect(actual.items[0].quantity).toBe(2);
  });

  it('should remove a product from cart by id when removeFromCart is dispatched', () => {
    const previousState = {
      items: [
        { ...initialProduct, quantity: 2 },
        { ...secondProduct, quantity: 1 },
      ],
    };

    const actual = cartReducer(previousState, removeFromCart(1));

    expect(actual.items).toHaveLength(1);
    expect(actual.items[0].id).toBe(2);
  });

  it('should update product quantity when updateQuantity is called with positive value', () => {
    const previousState = {
      items: [{ ...initialProduct, quantity: 1 }],
    };

    const actual = cartReducer(
      previousState,
      updateQuantity({ id: 1, quantity: 5 })
    );

    expect(actual.items[0].quantity).toBe(5);
  });

  it('should not update quantity if the target quantity is 0 or negative', () => {
    const previousState = {
      items: [{ ...initialProduct, quantity: 3 }],
    };

    const actualZero = cartReducer(
      previousState,
      updateQuantity({ id: 1, quantity: 0 })
    );
    expect(actualZero.items[0].quantity).toBe(3);

    const actualNegative = cartReducer(
      previousState,
      updateQuantity({ id: 1, quantity: -2 })
    );
    expect(actualNegative.items[0].quantity).toBe(3);
  });

  it('should do nothing when updating quantity of a non-existing item', () => {
    const previousState = {
      items: [{ ...initialProduct, quantity: 2 }],
    };

    const actual = cartReducer(
      previousState,
      updateQuantity({ id: 999, quantity: 5 })
    );

    expect(actual.items[0].quantity).toBe(2);
  });
});
