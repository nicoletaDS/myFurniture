import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

import { userLoginSucces } from './userLoginSlice'


const initialState = {}

export const userUpdateProfileSlice = createSlice({
    name: 'userUpdateProfile',
    initialState: initialState,
    reducers: {
        userUpdateProfileRequest: (state, action) => {
            state.loading = true;
        },

        userUpdateProfileSucces: (state, action) => { 
            state.loading = false;
            state.success = true;
            state.userInfo = action.payload; 
        },

        userUpdateProfileFail: (state, action) => { 
            state.loading = false; 
            state.error = action.payload;
        },

        userUpdateProfileReset: () => initialState,
    }
})
export const { userUpdateProfileRequest, userUpdateProfileSucces, userUpdateProfileFail, userUpdateProfileReset } = userUpdateProfileSlice.actions
export default userUpdateProfileSlice.reducer;


// thunk functions

export const updateUserProfile = (user) => async (dispatch, getState) => {
    try{
        dispatch(userUpdateProfileRequest())

        const { userLogin: { userInfo }} = getState()

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        }

        const params = {
            ...(user.email ? { 'email': user.email } : {}),
            ...(user.password ? { 'password': user.password } : {}),
            ...(user.firstName ? { 'first_name': user.firstName } : {}),
            ...(user.lastName ? { 'last_name': user.lastName } : {})
        }

        const { data } = await axios.post(
            'api/users/profile/update/',
            params,
            { headers: headers }
            )

        dispatch(userUpdateProfileSucces(data))

        // after the user updated his profile, log the user in
        dispatch(userLoginSucces(data))

        localStorage.setItem('userInfo', JSON.stringify(data))

    } catch (error) {
        const msg = (error.response && error.response.data.message ? error.response.data.message : error.message)
        dispatch(userUpdateProfileFail(msg))
    }
}