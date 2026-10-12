import { screen, fireEvent } from '@testing-library/react';
import { Cart } from '../Cart';
import { renderWithProviders } from '../../../test-utils';

describe('Cart component integration tests', () => {
  it('should render empty cart message when no items exist in cart', () => {
    renderWithProviders(<Cart />, {
      preloadedState: {
        cart: { items: [] },
      },
    });

    expect(screen.getByText('Giỏ hàng của bạn')).toBeInTheDocument();
    expect(screen.getByText('Giỏ hàng trống')).toBeInTheDocument();
    expect(screen.queryByText(/Tổng cộng:/i)).not.toBeInTheDocument();
  });

  it('should render list of cart items and display correct total price', () => {
    const preloadedCartItems = [
      {
        id: 1,
        title: 'Fjallraven Backpack',
        price: 50.0,
        description: 'Pack',
        image: 'https://example.com/pack.jpg',
        quantity: 2,
      },
      {
        id: 2,
        title: 'Mens Casual Shirt',
        price: 25.0,
        description: 'Shirt',
        image: 'https://example.com/shirt.jpg',
        quantity: 1,
      },
    ];

    renderWithProviders(<Cart />, {
      preloadedState: {
        cart: { items: preloadedCartItems },
      },
    });

    expect(screen.getByText('Fjallraven Backpack')).toBeInTheDocument();
    expect(screen.getByText('$50')).toBeInTheDocument();
    expect(screen.getByText('Mens Casual Shirt')).toBeInTheDocument();
    expect(screen.getByText('$25')).toBeInTheDocument();

    // Check images
    const packImg = screen.getByAltText('Fjallraven Backpack');
    expect(packImg).toBeInTheDocument();
    expect(packImg).toHaveAttribute('src', 'https://example.com/pack.jpg');

    // Total: 50 * 2 + 25 * 1 = 125.00
    expect(screen.getByText('Tổng cộng: $125.00')).toBeInTheDocument();
  });

  it('should update item quantity and recalculate total price when user changes quantity input', () => {
    const preloadedCartItems = [
      {
        id: 1,
        title: 'Fjallraven Backpack',
        price: 50.0,
        description: 'Pack',
        image: 'https://example.com/pack.jpg',
        quantity: 1,
      },
    ];

    const { store } = renderWithProviders(<Cart />, {
      preloadedState: {
        cart: { items: preloadedCartItems },
      },
    });

    const quantityInput = screen.getByRole('spinbutton');
    expect(quantityInput).toHaveValue(1);
    expect(screen.getByText('Tổng cộng: $50.00')).toBeInTheDocument();

    // Change quantity to 3
    fireEvent.change(quantityInput, { target: { value: '3' } });

    // Store state should be updated
    expect(store.getState().cart.items[0].quantity).toBe(3);
    // UI total should be updated to $150.00
    expect(screen.getByText('Tổng cộng: $150.00')).toBeInTheDocument();
  });

  it('should remove item from cart when clicking delete button ("Xoá")', () => {
    const preloadedCartItems = [
      {
        id: 1,
        title: 'Fjallraven Backpack',
        price: 50.0,
        description: 'Pack',
        image: 'https://example.com/pack.jpg',
        quantity: 1,
      },
    ];

    const { store } = renderWithProviders(<Cart />, {
      preloadedState: {
        cart: { items: preloadedCartItems },
      },
    });

    const deleteButton = screen.getByRole('button', { name: 'Xoá' });
    fireEvent.click(deleteButton);

    // State in store updated
    expect(store.getState().cart.items).toHaveLength(0);

    // UI should show empty cart message
    expect(screen.getByText('Giỏ hàng trống')).toBeInTheDocument();
    expect(screen.queryByText('Fjallraven Backpack')).not.toBeInTheDocument();
  });
});
