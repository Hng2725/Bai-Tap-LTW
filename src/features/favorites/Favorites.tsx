import React from 'react';
import { useFavoritesStore } from './favoritesStore';

export const Favorites: React.FC = () => {
  const { favorites, toggleFavorite } = useFavoritesStore();

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Sản phẩm yêu thích</h2>
      {favorites.length === 0 ? (
        <p>Chưa có sản phẩm yêu thích</p>
      ) : (
        <div>
          {favorites.map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
              <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: '14px' }}>{item.title}</h4>
                <p style={{ margin: 0, color: '#e44d26' }}>${item.price}</p>
              </div>
              <button 
                onClick={() => toggleFavorite(item)}
                style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Bỏ yêu thích
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
