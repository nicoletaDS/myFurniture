import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector} from 'react-redux'


import { savePaymentMethod } from '../slices/cart/cartSlice'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import './PaymentScreen.css'


function PaymentScreen() {
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [paymentMethod, setPaymentMethod] = useState('PayPal')

    if(!shippingAddress.address){
        navigate('/shipping')
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')
    }

    return (
        <FormContainer>
            <h1 className='form-title'>Payment</h1>
            <CheckoutSteps step1 step2 step3 />
            <div className='form-body payment'>
                <form onSubmit={submitHandler}>
                    <p>Select payment method:</p>
                    <label>
                        <input
                            type="radio"
                            value="PayPal"
                            checked={paymentMethod === 'PayPal'}
                            onChange={e => setPaymentMethod(e.target.value)}
                        />
                        PayPal
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="Credit Card"
                            checked={paymentMethod === 'Credit Card'}
                            onChange={e => setPaymentMethod(e.target.value)}
                        />
                        Credit Card
                    </label>

                    <div className='input-wrapper'>
                        <button className='btn form-item' type='submit'>Continue</button>
                    </div>

                </form>
            </div>
        
        </FormContainer>
    )
}

export default PaymentScreen
