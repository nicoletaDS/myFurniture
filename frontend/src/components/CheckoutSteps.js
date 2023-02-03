import React from 'react'
import { Link } from 'react-router-dom'

import './CheckoutSteps.css'


function CheckoutSteps({ step1, step2, step3, step4 }) {
  return (
    <div className='checkout-nav-body'>
      
      {step1 ? <Link to='/login'>Login -</Link>
          : <span>Login -</span>}

      {step2 ? <Link to='/shipping'>Shipping -</Link>
          : <span>Shipping -</span>}

      {step3 ? <Link to='/placeorder'>Place Order</Link>
          : <span>Place Order</span>}

    </div>
  )
}

export default CheckoutSteps
