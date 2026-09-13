import React from 'react';
import { Accordion, AccordionItem, AccordionHeader, AccordionPanel } from './components/Accordion';
import { usePagination } from './hooks/usePagination';
import './index.css';

// Sample product data
const products = Array.from({ length: 25 }, (_, i) => ({
  id: `p-${i + 1}`,
  name: `Product ${i + 1}`,
  price: (Math.random() * 100 + 10).toFixed(2),
  description: `This is a great description for Product ${i + 1}. It has many features and benefits that you will love.`
}));

function App() {
  const { currentPage, totalPages, next, prev, goToPage, currentData } = usePagination(products, 5);

  return (
    <div className="app-container">
      <h1>Compound Component Accordion & usePagination</h1>
      
      <div className="product-list-container">
        <h2>Product List (Page {currentPage} of {totalPages})</h2>
        
        <Accordion defaultActivePanel={currentData[0]?.id}>
          {currentData.map((product) => (
            <AccordionItem key={product.id} panelId={product.id}>
              <AccordionHeader>
                {product.name} - ${product.price}
              </AccordionHeader>
              <AccordionPanel>
                <div className="product-details">
                  <p><strong>ID:</strong> {product.id}</p>
                  <p><strong>Description:</strong> {product.description}</p>
                  <button className="buy-button">Add to Cart</button>
                </div>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="pagination-controls">
          <button 
            onClick={prev} 
            disabled={currentPage === 1}
            className="page-btn"
          >
            Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`page-btn ${currentPage === page ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}
          </div>

          <button 
            onClick={next} 
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
