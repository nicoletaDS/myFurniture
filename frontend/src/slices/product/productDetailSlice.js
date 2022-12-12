import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'


const initialState = {product: {reviews: []}}

export const productDetailsSlice = createSlice({
    name: 'productDetails',
    initialState: initialState,
    reducers: {
        productDetailsRequest: (state) => { 
            state.loading = true;
        },
        productDetailsSuccess: (state, action) => { 
            state.loading = false;
            state.product = action.payload; 
        },
        productDetailsFail: (state, action) => { 
            state.loading = false; 
            state.error = action.payload;
        },
    }
})
export const { productDetailsRequest, productDetailsSuccess, productDetailsFail } = productDetailsSlice.actions
export default productDetailsSlice.reducer;


// thunk function to fetch the product details
export const listProductDetails = (id) => async (dispatch) => {
    try{
        dispatch(productDetailsRequest());
        const { data } = await axios.get(`/api/products/${id}/`);
        dispatch(productDetailsSuccess(data));

    } catch (error) {
        const msg = (error.response && error.response.data.message ? error.response.data.message : error.message)
        dispatch(productDetailsFail(msg))
    }
}