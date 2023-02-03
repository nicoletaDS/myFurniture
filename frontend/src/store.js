import { configureStore } from "@reduxjs/toolkit";

import productListReducer from "./slices/product/productListSlice";
import productDetailsReducer from "./slices/product/productDetailSlice";
import cartReducer from "./slices/cart/cartSlice";
import userLoginReducer from "./slices/user/userLoginSlice";
import userRegisterReducer from "./slices/user/userRegisterSlice";
import userDetailsReducer from "./slices/user/userDetailsSlice";
import userUpdateProfileReducer from "./slices/user/userUpdateProfileSlice";
import orderCreateReducer from "./slices/order/orderCreateSlice";
import orderDetailsReducer from "./slices/order/orderDetailsSlice";
import orderPayReducer from "./slices/order/orderPaySlice";
import orderListReducer from "./slices/order/orderListSlice";

const reducer = {
  productList: productListReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderList: orderListReducer,
};

const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const shippingAddressFromStorage = localStorage.getItem("shippingAddress")
  ? JSON.parse(localStorage.getItem("shippingAddress"))
  : {};

const paymentMethodFromStorage = localStorage.getItem("paymentMethod")
  ? JSON.parse(localStorage.getItem("paymentMethod"))
  : {};

const preloadedState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
    paymentMethod: paymentMethodFromStorage,
  },
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [];

const store = configureStore({
  reducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
});

export default store;
