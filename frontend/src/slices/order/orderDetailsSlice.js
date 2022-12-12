import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    loading: true,
    orderItems: [],
    shippingAddress: {}
}

export const orderDetailsSlice = createSlice({
    name: 'orderDetails',
    initialState: initialState,
    reducers: {
        orderDetailsRequest: (state) => { 
            state.loading = true;
        },
        orderDetailsSuccess: (state, action) => { 
            state.loading = false;
            state.order = action.payload; 
        },
        orderDetailsFail: (state, action) => { 
            state.loading = false; 
            state.error = action.payload;
        },
    }
})
export const { orderDetailsRequest, orderDetailsSuccess, orderDetailsFail, orderDetailsReset } = orderDetailsSlice.actions
export default orderDetailsSlice.reducer;


// thunk function 
export const getOrderDetails = (id) => async (dispatch, getState) => {
    try{
        dispatch(orderDetailsRequest());

        const { userLogin: { userInfo }} = getState()

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        }

        const { data } = await axios.get(
            `/api/orders/${id}/`,
            { headers: headers }
            )

        dispatch(orderDetailsSuccess(data));

    } catch (error) {
        const msg = (error.response && error.response.data.detail ? error.response.data.detail : error.message)
        dispatch(orderDetailsFail(msg))
    }
}