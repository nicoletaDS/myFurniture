import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


const initialState = {products: []}

export const productListSlice = createSlice({
    name: 'productList',
    initialState: initialState,
    reducers: {
        productListRequest: (state) => { 
            state.loading = true;
        },
        productListSuccess: (state, action) => { 
            state.loading = false;
            state.products = action.payload; 
        },
        productListFail: (state, action) => { 
            state.loading = false; 
            state.error = action.payload;
        },
    }
})
export const { productListRequest, productListSuccess, productListFail } = productListSlice.actions
export default productListSlice.reducer;


// thunk function to fetch all products
export const listProducts = () => async (dispatch) => {
    try{
        dispatch(productListRequest());
        const { data } = await axios.get('/api/products/');
        dispatch(productListSuccess(data));

    } catch (error) {
        const msg = (error.response && error.response.data.message ? error.response.data.message : error.message)
        dispatch(productListFail(msg))
    }
}

