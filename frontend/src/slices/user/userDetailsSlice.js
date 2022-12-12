import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'


const initialState = { user: {}}

export const userDetailsSlice = createSlice({
    name: 'userDetails',
    initialState: initialState,
    reducers: {
        userDetailsRequest: (state, action) => {
            state.loading = true;
        },

        userDetailsSucces: (state, action) => { 
            state.loading = false;
            state.user = action.payload; 
        },

        userDetailsFail: (state, action) => { 
           state.loading = false; 
            state.error = action.payload;
        },
        userDetailsReset: (state, action) => { 
            state.user = {}
         }
    }
})
export const { userDetailsRequest, userDetailsSucces, userDetailsFail, userDetailsReset } = userDetailsSlice.actions
export default userDetailsSlice.reducer;


// thunk functions to get user details

export const getUserDetails = (id) => async (dispatch, getState) => {
    try{
        dispatch(userDetailsRequest())

        const {
            userLogin: { userInfo }
        } = getState()

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        }

        // the id value is 'profile' in most cases,
        // when called from the admin panell it will be an integer, representing a user id
        const { data } = await axios.get(
            `api/users/${id}/`,
            { headers: headers }
            )

        dispatch(userDetailsSucces(data))

    } catch (error) {
        const msg = (error.response && error.response.data.message ? error.response.data.message : error.message)
        dispatch(userDetailsFail(msg))
    }
}
