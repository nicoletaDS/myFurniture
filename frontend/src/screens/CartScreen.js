import React, { useEffect } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import './CartScreen.css'
import { addToCart, removeFromCart } from '../slices/cart/cartSlice'
import Breadcrumbs from '../components/Breadcrumbs'


function CartScreen() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // get the selected quantity from the url
  const qty = location.search ? Number(location.search.split('=')[1]) : 1

  const cart = useSelector(state => state.cart);
  const { cartItems } = cart;

  useEffect(() => {
    if(id){
      dispatch(addToCart(id, qty));
    }
  }, [dispatch, id, qty]);

  const removeFromCartHandler = (itemId) => {
    dispatch(removeFromCart(itemId));
  }

  const checkoutHandler = () => {
    navigate('/login', {
      state: { redirect: '/shipping'}
    })
  }

  return (
    <div>
      <Breadcrumbs>Cart</Breadcrumbs>
      <div className='cart'>
        <h1 className='title'>Cart</h1>
        {cartItems.length === 0 
          ? <p>You don't have any items in your cart yet. <Link className='no-items' to='/'>Continue shopping.</Link></p>
            : <form className='cart-form'>
                <table className='cart-items'>
                  <thead>
                    <tr>
                      <th className='first'>PRODUCT</th>
                      <th>PRICE</th>
                      <th>QUANTITY</th>
                      <th className='last' colSpan="2">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr className='cart-item' key={item.product}>

                        <td className='product-item'>
                        <button className='remove' type='button' onClick={() => removeFromCartHandler(item.product)}>x</button>
                          <Link to={`/products/${item.product}`}>
                            <img src={item.image} alt={item.name}></img>
                            <span className='product-item-details'>
                              {item.name}
                              <br/>
                              Brand: {item.brand.toUpperCase()}
                            </span>
                          </Link>
                        </td>

                        <td className='price' data-title='Price'><span className='money'>{item.price}&euro;</span></td>
                        <td className='quantity' data-title='Quantity'>
                        <select value={item.qty} onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}>
                            {[...new Array(item.countInStock).keys()].map((val) => {
                                return (<option key={val + 1} value={val + 1}>{val + 1}</option>)
                            })}
                        </select>
                        </td>
                        <td className='total' data-title='Total'><span className='money'>{(item.price * item.qty).toFixed(2)}&euro;</span></td>
                      </tr>
                    ))
                    }
                  </tbody>
                </table>

                <div className='cart-totals'>
                  <p className='total-price'>{cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)} &euro;</p>
                  <button type='button' className='btn-checkout' onClick={checkoutHandler}>Checkout</button>
                </div>
              </form> 
        }
      </div>
      
    </div>
  )
}

export default CartScreen;
