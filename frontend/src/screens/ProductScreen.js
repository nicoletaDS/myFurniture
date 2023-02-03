import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'

import './ProductScreen.css'
import Breadcrumbs from '../components/Breadcrumbs'
import Rating from '../components/Rating'
import ProductsList from '../components/ProductsList'
import { listProducts } from '../slices/product/productListSlice'
import { listProductDetails } from '../slices/product/productDetailSlice'


function ProductScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productList = useSelector(state => state.productList)
  const { products } = productList
  const productDetails = useSelector(state => state.productDetails);
  const { error, loading, product } = productDetails

  const { id } = useParams();
  const [qty, setQty] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // get the product details and all the products from store
  useEffect( () => {
    dispatch(listProductDetails(id));
    dispatch(listProducts());
  }, [dispatch, id]);

  // set the related products list based on the product brand
  useEffect( () => {
    const result = products.filter(elem => (elem.brand == product.brand && elem.id != product.id))
    setRelatedProducts(result);
  }, [products,]);

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  }


  return (
    <div>
      <Breadcrumbs>
        <Link to={product.category}>{product.category}</Link>/
        {product.name}
      </Breadcrumbs>

      {loading ? <h2>Loading...</h2>
        : error ? <p className='error'>{error}</p>
          : <>
              <div className='product'>

                <div className='left'>
                    <img src={product.image}></img>
                </div>

                <div className='right'>
                  <div className='name'>{product.name}</div>
                  <Rating className='rating' value={product.rating} text={`(${product.numReviews})`} />
                  <p className='price'>{product.price}&euro; - <span>{(product.countInStock > 0) ? <>In</> : <>Out of</>} Stock</span></p>

                  {product.countInStock > 0 && (
                    <>
                      <div className='qty'>
                        <label>Quantity:</label>
                        <select value={qty} onChange={(e) => setQty(e.target.value)}>
                            {[...new Array(product.countInStock).keys()].map((val) => {
                                return (<option key={val + 1} value={val + 1}>{val + 1}</option>)
                            })}
                        </select>
                      </div>
                      <p className='total'>Total: {(qty * product.price).toFixed(2)}&euro;</p>
                    </>
                  )}
                    
                  <div className='add-product'>
                      <button 
                        disabled={(product.countInStock > 0) ? false : true} 
                        className='cart'
                        onClick={addToCartHandler}
                      >
                        Add to cart
                      </button>
                      <button className='wishlist'><i className='far fa-heart'/>&nbsp;&nbsp;Add to wishlist</button>
                  </div>
                  <p className='brand'>Brand: {product.brand}</p>
                  <p className='desc'>{product.description}</p>
                </div>

              </div>

              <div className='related-products'>
                <h1 className='title'>Related products</h1>
                <ProductsList products={relatedProducts} />

              </div>
            </>
      }

      
    </div>
  )
}

export default ProductScreen;
