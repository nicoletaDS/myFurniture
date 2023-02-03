import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { userDetailsReset } from "./userDetailsSlice";
import { orderListReset } from "../order/orderListSlice";

const initialState = {};

export const userLoginSlice = createSlice({
  name: "userLogin",
  initialState: initialState,
  reducers: {
    userLoginRequest: (state, action) => {
      state.loading = true;
    },

    userLoginSucces: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
    },

    userLoginFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    userLogout: () => initialState,
  },
});
export const { userLoginRequest, userLoginSucces, userLoginFail, userLogout } =
  userLoginSlice.actions;
export default userLoginSlice.reducer;

// thunk functions to login a user

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(userLoginRequest());

    const headers = {
      "Content-Type": "application/json",
    };

    const { data } = await axios.post(
      "api/users/login/",
      { username: email, password: password },
      { headers: headers }
    );

    dispatch(userLoginSucces(data));

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    const msg =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch(userLoginFail(msg));
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch(userLogout());
  dispatch(userDetailsReset());
  dispatch(orderListReset());
};
