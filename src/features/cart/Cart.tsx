import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { removeFromCart, updateQuantity } from './cartSlice';

export const Cart: React.FC = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h2>Giỏ hàng của bạn</h2>
      {items.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <div>
          {items.map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
              <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: '14px' }}>{item.title}</h4>
                <p style={{ margin: 0, color: '#e44d26' }}>${item.price}</p>
              </div>
              <div>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => dispatch(updateQuantity({ id: item.id, quantity: Number(e.target.value) }))}
                  style={{ width: '50px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>
              <button 
                onClick={() => dispatch(removeFromCart(item.id))}
                style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Xoá
              </button>
            </div>
          ))}
          <h3 style={{ textAlign: 'right', marginTop: '20px' }}>Tổng cộng: ${total.toFixed(2)}</h3>
        </div>
      )}
    </div>
  );
};
