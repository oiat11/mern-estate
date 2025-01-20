// this file contains the user slice which is responsible for handling the user state in the redux store
import { createSlice, current } from "@reduxjs/toolkit";

// initial state of the user slice
const initialState = {
    currentUser: null,
    error: null,
    loading: false,
}

// create a user slice with the initial state and reducers
const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
});

export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;

export default userSlice.reducer;