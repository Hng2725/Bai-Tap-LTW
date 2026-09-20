import React from 'react';
import { Products } from './features/products/Products';
import { Cart } from './features/cart/Cart';
import './App.css';

function App() {
  return (
    <div className="App" style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Redux Toolkit</h1>
      <div style={{ display: 'flex', gap: '40px', marginTop: '30px' }}>
        <div style={{ flex: 2 }}>
          <Products />
        </div>
        <div style={{ flex: 1, backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <Cart />
        </div>
      </div>
    </div>
  );
}

export default App;
