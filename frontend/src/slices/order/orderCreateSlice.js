import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

import { cartClearItems } from '../cart/cartSlice';

const initialState = {}

export const orderCreateSlice = createSlice({
    name: 'orderCreate',
    initialState: initialState,
    reducers: {
        orderCreateRequest: (state) => { 
            state.loading = true;
        },
        orderCreateSuccess: (state, action) => { 
            state.loading = false;
            state.success = true;
            state.order = action.payload; 
        },
        orderCreateFail: (state, action) => { 
            state.loading = false; 
            state.error = action.payload;
        },
        orderCreateReset: () => initialState,
    }
})
export const { orderCreateRequest, orderCreateSuccess, orderCreateFail, orderCreateReset } = orderCreateSlice.actions
export default orderCreateSlice.reducer;


// thunk function to fetch the product details
export const createOrder = (order) => async (dispatch, getState) => {
    try{
        dispatch(orderCreateRequest());

        const { userLogin: { userInfo }} = getState()

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        }

        const { data } = await axios.post(
            'api/orders/add/',
            order,
            { headers: headers }
            )

        dispatch(orderCreateSuccess(data));

        dispatch(cartClearItems())
        localStorage.removeItem('cartItems')

    } catch (error) {
        const msg = (error.response && error.response.data.detail ? error.response.data.detail : error.message)
        dispatch(orderCreateFail(msg))
    }
}