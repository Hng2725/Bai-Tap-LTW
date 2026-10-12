import { type ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setupStore } from '../../test-utils';
import { addToCart } from '../../features/cart/cartSlice';

describe('Redux Typed Hooks (useAppDispatch, useAppSelector)', () => {
  it('should access store state and dispatch actions via useAppDispatch and useAppSelector', () => {
    const store = setupStore();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(
      () => ({
        dispatch: useAppDispatch(),
        cartItems: useAppSelector((state) => state.cart.items),
      }),
      { wrapper }
    );

    // Initial state check
    expect(result.current.cartItems).toEqual([]);

    // Dispatch action via typed dispatch hook
    act(() => {
      result.current.dispatch(
        addToCart({
          id: 99,
          title: 'Hook Item',
          price: 15,
          description: 'Desc',
          image: 'img.jpg',
        })
      );
    });

    // Selector should reflect the updated state
    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].id).toBe(99);
    expect(result.current.cartItems[0].quantity).toBe(1);
  });
});
