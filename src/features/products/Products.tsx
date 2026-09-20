import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchProducts } from './productsSlice';
import { addToCart } from '../cart/cartSlice';

export const Products: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  if (status === 'loading') return <div>Đang tải sản phẩm...</div>;
  if (status === 'failed') return <div>Lỗi: {error}</div>;

  return (
    <div>
      <h2>Danh sách sản phẩm</h2>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {items.map((product) => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '10px', width: '200px', borderRadius: '8px' }}>
            <img src={product.image} alt={product.title} style={{ width: '100%', height: '150px', objectFit: 'contain' }} />
            <h4 style={{ fontSize: '16px', margin: '10px 0' }}>{product.title}</h4>
            <p style={{ fontWeight: 'bold', color: '#e44d26' }}>${product.price}</p>
            <button 
              onClick={() => dispatch(addToCart(product))}
              style={{ padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Thêm vào giỏ
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
