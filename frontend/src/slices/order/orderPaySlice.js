import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {}

export const orderPaySlice = createSlice({
    name: 'orderPay',
    initialState: initialState,
    reducers: {
        orderPayRequest: (state) => { 
            state.loading = true;
        },
        orderPaySuccess: (state, action) => { 
            state.loading = false;
            state.success = true
        },
        orderPayFail: (state, action) => { 
            state.loading = false; 
            state.error = action.payload;
        },
        orderPayReset: () => initialState
    }
})
export const { orderPayRequest, orderPaySuccess, orderPayFail, orderPayReset } = orderPaySlice.actions
export default orderPaySlice.reducer;


// thunk function 

// export const payOrder = (id) => async (dispatch, getState) => {
//     try{
//         dispatch(orderPayRequest());

//         const { userLogin: { userInfo }} = getState()

//         const headers = {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${userInfo.token}`
//         }

//         const { data } = await axios.post(
//             `/api/orders/${id}/stripe/create-checkout-session`,
//             { headers: headers }
//             )

//         dispatch(orderPaySuccess(data));

//     } catch (error) {
//         const msg = (error.response && error.response.data.detail ? error.response.data.detail : error.message)
//         dispatch(orderPayFail(msg))
//     }
// }