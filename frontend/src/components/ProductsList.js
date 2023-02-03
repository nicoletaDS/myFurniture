import React from 'react'

import ProductCard from './ProductCard'
import './ProductsList.css'


function ProductsList({ products }) {
  return (
    <div className='products-wrapper'>
        {products.map((product) => (
          <div className='product-card' key={product.id}>
              <ProductCard product={product} />
          </div>
        ))}
    </div>
  )
}

export default ProductsList;
