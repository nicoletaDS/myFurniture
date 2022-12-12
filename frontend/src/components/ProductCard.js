import React from 'react'
import {Link} from 'react-router-dom'

import './ProductCard.css'
import Rating from './Rating'

function ProductCard({ product }) {
  
  return (
    <div className='product-card'>
      <Link to={`/products/${product.id}`}>
        <img src={product.image} alt={product.name} />
        <h3 className='product-name'>{product.name}</h3>
        <Rating value={product.rating} text={`(${product.numReviews}) `} color='#ffe600' />
        <div className='product-price'>{product.price}&euro;</div>
        {product.countInStock > 0 
          ? <div className='stoc-desc'>
              <i className='fas fa-circle' style={{color:'#999999', fontSize:'10px', paddingRight:'10px'}}/>
              <p>In Stock</p>
            </div>
            : <div className='stoc-desc'>
                <i className='fas fa-circle' style={{color:'#f0f0f0', fontSize:'10px', paddingRight:'10px'}}/>
                <p>Out Of Stock</p>
              </div>
        }
      </Link>

      
    </div>
  )
}

export default ProductCard;
