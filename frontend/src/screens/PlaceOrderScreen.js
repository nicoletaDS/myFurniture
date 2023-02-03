import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  createOrder,
  orderCreateReset,
} from "../slices/order/orderCreateSlice";
import CheckoutSteps from "../components/CheckoutSteps";
import "./PlaceOrderScreen.css";

function PlaceOrderScreen() {
  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, error, success } = orderCreate;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const itemsPrice = cart.cartItems
    .reduce((acc, item) => acc + item.price * item.qty, 0)
    .toFixed(2);
  const shippingPrice = (itemsPrice > 100 ? 0 : 10).toFixed(2);
  const totalPrice = (Number(itemsPrice) + Number(shippingPrice)).toFixed(2);

  useEffect(() => {
    if (success) {
      navigate(`/orders/${order.id}`);
      dispatch(orderCreateReset());
    }
  }, [success, navigate, dispatch]);

  const placeOrder = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: itemsPrice,
        shippingPrice: shippingPrice,
        totalPrice: totalPrice,
      })
    );
  };

  return (
    <div className="placeorder">
      <div className="placeorder-title">
        <h2>Place Order</h2>
        <CheckoutSteps step1 step2 step3 step4 />
      </div>

      <div className="placeorder-body">
        <div className="shipping-info">
          <p>
            <strong>Contact information:</strong>
            <br />
            Email: {userInfo.email}
          </p>
          <p>
            <strong>Shipping address:</strong>
            <br />
            Address: {cart.shippingAddress.address}
            <br />
            City: {cart.shippingAddress.city}
            <br />
            Postal Code: {cart.shippingAddress.postalCode}
            <br />
            Country: {cart.shippingAddress.country}
          </p>
          <p>
            <strong>Payment method:</strong>
            <br />
            card
            {/* {cart.paymentMethod} */}
          </p>

          {error && <p className="error">{error}</p>}
          <button
            disabled={cart.cartItems.length === 0}
            className="btn"
            onClick={placeOrder}
          >
            Place Order
          </button>
          <Link className="return-cart" to="/cart">
            Return to cart
          </Link>
        </div>

        <div className="shipping-summary">
          {cart.cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              {cart.cartItems.map((item, index) => (
                <div className="cart-item" key={index}>
                  <img src={item.image} alt=""></img>
                  <p>
                    {item.name}
                    <br />
                    {item.price}&euro;
                  </p>
                  <p>
                    Qty:
                    <br />
                    {item.qty}
                  </p>
                  <p>
                    Price: <br />
                    <strong>{item.qty * item.price}&euro;</strong>
                  </p>
                </div>
              ))}
            </>
          )}
          <div className="price">
            <p>Subtotal: {itemsPrice}&euro;</p>
            <p>Shipping: {shippingPrice}&euro;</p>
            <p>
              Total: <strong>{totalPrice}&euro;</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrderScreen;
