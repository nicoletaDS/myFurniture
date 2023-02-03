import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = { orders: [] };

export const orderListSlice = createSlice({
  name: "orderList",
  initialState: initialState,
  reducers: {
    orderListRequest: (state) => {
      state.loading = true;
    },
    orderListSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    orderListFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    orderListReset: () => initialState,
  },
});
export const {
  orderListRequest,
  orderListSuccess,
  orderListFail,
  orderListReset,
} = orderListSlice.actions;
export default orderListSlice.reducer;

// thunk function
export const getOrderList = () => async (dispatch, getState) => {
  try {
    dispatch(orderListRequest());

    const {
      userLogin: { userInfo },
    } = getState();

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.token}`,
    };

    const { data } = await axios.get(`/api/orders/myorders/`, {
      headers: headers,
    });

    dispatch(orderListSuccess(data));
  } catch (error) {
    const msg =
      error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message;
    dispatch(orderListFail(msg));
  }
};
