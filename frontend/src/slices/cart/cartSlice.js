import { createSlice, current } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {cartItems: [], shippingAddress: {}}

export const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers: {
        cartAddItem: (state, action) => {
                const item = action.payload;
                const existItem = state.cartItems.find(x => x.product === item.product)
                if (existItem){
                    // if the item already exists, change the quantity, to the new item's qty
                    const index = state.cartItems.findIndex(x => x.product === item.product);
                    state.cartItems[index].qty = item.qty;
                } else {
                    state.cartItems.push(item);
                }
        },

        cartRemoveItem: (state, action) => { 
            const id = action.payload;
            const index = state.cartItems.findIndex(x => x.product === id)
            // if the element with the given id is in cartItems, remove it
            if (index > -1) {
                state.cartItems.splice(index, 1);
            }
        },

        cartSaveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload
        },

        cartSavePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload
        },

        cartClearItems: (state, action) => {
            state.cartItems = [];
        },
    }
})
export const { cartAddItem, cartRemoveItem, cartSaveShippingAddress, cartSavePaymentMethod, cartClearItems } = cartSlice.actions
export default cartSlice.reducer;


// thunk functions to add/remove items to/from cart

export const addToCart = (id, qty) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/products/${id}`);
    dispatch(cartAddItem({
        product: data.id,
        name: data.name,
        image: data.image,
        price: data.price,
        brand: data.brand,
        countInStock: data.countInStock,
        qty
    }));

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
}


export const removeFromCart = (id) => async (dispatch, getState) => {
    dispatch(cartRemoveItem(id));

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
}

export const saveShippingAddress = (data) => async (dispatch) => {
    dispatch(cartSaveShippingAddress(data));

    localStorage.setItem('shippingAddress', JSON.stringify(data));
}

export const savePaymentMethod = (data) => async (dispatch) => {
    dispatch(cartSavePaymentMethod(data));

    localStorage.setItem('paymentMethod', JSON.stringify(data));
}
