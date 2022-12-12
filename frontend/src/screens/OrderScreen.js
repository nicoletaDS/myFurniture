import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector} from 'react-redux'

import { getOrderDetails } from '../slices/order/orderDetailsSlice'
import { payOrder } from '../slices/order/orderPaySlice'
import './OrderScreen.css'


function OrderScreen() {
    const { id } = useParams();
    const dispatch = useDispatch();

    const [sdkReady, setSkdReady] = useState(false)

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, error, loading } = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const { loading:loadingPay, success: successPay } = orderPay

    useEffect(() => {
        if(!order || successPay || (order.id !== Number(id))){
            dispatch(getOrderDetails(id))
        }
    }, [dispatch, order, id])

    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(id, paymentResult))
    }

    return (
        <div className='placeorder'>
            <div className='placeorder-title'>
                <h2>Order: { id }</h2>
            </div>

            {loading ? <h2>Loading...</h2>
                : error ? <p className='error'>{error}</p>
                    : <div className='placeorder-body'>
                            <div className='shipping-info'>
                                <p>
                                    <strong>Contact information:</strong><br/>
                                    Email: <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                                </p>
                                <p>
                                    <strong>Shipping: - &nbsp;
                                    {order.isDelivered ? <>Delivered on {order.deliveredAt}</> : <>Not Delivered</>}</strong><br/>
                                    Address: {order.shippingAddress.address}<br/>
                                    City: {order.shippingAddress.city}<br/>
                                    Postal Code: {order.shippingAddress.postalCode}<br/>
                                    Country: {order.shippingAddress.country}
                                </p>
                                <p>
                                    <strong>Payment method:</strong><br/>
                                    {order.paymentMethod} -&nbsp;
                                    <strong>{order.isPaid ? <>Paid on {order.paidAt}</> : <>Not Paid</>}</strong>
                                </p>
                            </div>

                            <div className='shipping-summary'>
                                {order.orderItems.map((item, index) => (
                                    <div className='cart-item' key={index}>
                                        <img src={item.image} alt=''></img>
                                        <p>{item.name}<br/>{item.price}&euro;</p>
                                        <p>Qty:<br/>{item.qty}</p>
                                        <p>Price: <br/><strong>{item.qty*item.price}&euro;</strong></p>
                                    </div>
                                ))}
                                <div className='price'>   
                                    <p>Total: <strong>{order.totalPrice || 0}&euro;</strong></p>
                                </div> 

                                {!order.isPaid && (
                                    <div>
                                        {!loadingPay && <p>Loading...</p>}
                                        {}
                                    </div>
                                )}
                            </div>
                        </div>
            }
        </div>
    )
}

export default OrderScreen
