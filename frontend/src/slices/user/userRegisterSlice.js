import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { userLoginSucces } from "./userLoginSlice";

const initialState = {};

export const userRegisterSlice = createSlice({
  name: "userRegister",
  initialState: initialState,
  reducers: {
    userRegisterRequest: (state, action) => {
      state.loading = true;
    },

    userRegisterSucces: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
    },

    userRegisterFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    userLogout: () => initialState,
  },
});
export const {
  userRegisterRequest,
  userRegisterSucces,
  userRegisterFail,
  userLogout,
} = userRegisterSlice.actions;
export default userRegisterSlice.reducer;

// thunk functions to login a user

export const register =
  (first_name, last_name, email, password) => async (dispatch) => {
    try {
      dispatch(userRegisterRequest());

      const headers = {
        "Content-Type": "application/json",
      };
      const params = {
        email: email,
        password: password,
        ...(first_name ? { first_name: first_name } : {}),
        ...(last_name ? { last_name: last_name } : {}),
      };

      const { data } = await axios.post("/api/users/register/", params, {
        headers: headers,
      });

      dispatch(userRegisterSucces(data));

      localStorage.setItem("userInfo", JSON.stringify(data));

      // after the user register, log the user in
      dispatch(userLoginSucces(data));
    } catch (error) {
      const msg =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch(userRegisterFail(msg));
    }
  };

export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch(userLogout());
};
