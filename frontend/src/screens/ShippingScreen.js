import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector} from 'react-redux'

import './ShippingScreen.css'
import { saveShippingAddress } from '../slices/cart/cartSlice'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'


function ShippingScreen() {
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [address, setAddress] = useState(shippingAddress.address)
    const [city, setCity] = useState(shippingAddress.city)
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
    const [country, setCountry] = useState(shippingAddress.country)

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({address, city, postalCode, country}))
        navigate('/placeorder')
    }

  return (
    <FormContainer>
      <h1 className='form-title'>Shipping</h1>
      <CheckoutSteps step1 step2 />
      <div className='form-body'>
        <form onSubmit={submitHandler}>

            <label className='form-item'>
                Address:
                <input
                    required
                    type="text"
                    placeholder='enter address'
                    value={address || ''}
                    onChange={e => setAddress(e.target.value)}
                />
            </label>
            <label className='form-item'>
                City:
                <input
                    required
                    type="text"
                    placeholder='enter city'
                    value={city || ''}
                    onChange={e => setCity(e.target.value)}
                />
            </label>
            <label className='form-item'>
                Postal code:
                <input
                    required
                    type="text"
                    placeholder='enter postal code'
                    value={postalCode || ''}
                    onChange={e => setPostalCode(e.target.value)}
                />
            </label>
            <label className='form-item'>
                Country:
                <input
                    required
                    type="text"
                    placeholder='enter country'
                    value={country || ''}
                    onChange={e => setCountry(e.target.value)}
                />
            </label>

            <div className='input-wrapper'>
                <button className='btn form-item' type='submit'>Continue</button>
            </div>

        </form>
      </div>
    </FormContainer>
  )
}

export default ShippingScreen
