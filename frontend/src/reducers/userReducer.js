import { createReducer } from "@reduxjs/toolkit";


const initialState = {
    loading: true,
    user: null,
    isAuthenticated: false,
    error: null,
}


export const userReducer = createReducer(initialState, {

    LOAD_USER_REQUEST: (state) => {
        state.loading = true;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
    },
    LOAD_USER_SUCCESS: (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        state.loading = false;
    },
    LOAD_USER_FAIL: (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
    },

    LOGIN_USER_REQUEST: (state) => {
        state.loading = true;
        state.isAuthenticated = false;
    },
    LOGIN_USER_SUCCESS: (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
    },
    LOGIN_USER_FAIL: (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
    },

    SIGNUP_USER_REQUEST: (state) => {
        state.loading = true;
        state.isAuthenticated = false;
    },
    SIGNUP_USER_SUCCESS: (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
    },
    SIGNUP_USER_FAIL: (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
    },
    OTP_SENT_SUCCESS: (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
    },

    LOGOUT_USER_REQUEST: (state, action) => {
        state.loading = true;
    },
    LOGOUT_USER_SUCCESS: (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
    },
    LOGOUT_USER_FAIL: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
})


const profileInitialState = {
    loading: false,
    allUsers: null,
    isUpdated: false,
    isDeleted: false,
    error: null,
}

export const profileReducer = createReducer(profileInitialState, {
    UPDATE_PROFILE_REQUEST: (state) => {
        state.loading = true;
        state.error = null;
    },
    UPDATE_PROFILE_SUCCESS: (state, action) => {
        state.loading = false;
        state.isUpdated = true;
        state.error = null;
    },
    UPDATE_PROFILE_FAIL: (state, action) => {
        state.loading = false;
        state.isUpdated = false;
        state.error = action.payload;
    },

    UPDATE_PASSWORD_REQUEST: (state) => {
        state.loading = true;
    },
    UPDATE_PASSWORD_SUCCESS: (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload;
    },
    UPDATE_PASSWORD_FAIL: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },


    //ADMIN 
    ALL_USERS_REQUEST: (state) => {
        state.loading = true;
        state.error = null;
    },
    ALL_USERS_SUCCESS: (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
        state.error = null;
    },
    ALL_USERS_FAIL: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },


    DELETE_USER_REQUEST: (state) => {
        state.loading = true;
        state.error = null;
    },
    DELETE_USER_SUCCESS: (state) => {
        state.loading = false;
        state.isDeleted = true;
        state.error = null;
    },
    DELETE_USER_FAIL: (state, action) => {
        state.loading = false;
        state.isDeleted = false;
        state.error = action.payload;
    }
})

const forgotPasswordInitialState = {
    loading: false,
    message: null,
    success: null,
    error: null,
}


const sellerInitialState = {
    loading: true,
    seller: null,
    products: null,
    error: null,
}


export const sellerReducer = createReducer(sellerInitialState, {

    LOAD_SELLER_REQUEST: (state) => {
        state.loading = true;
        state.seller = null;
        state.products = null;
        state.error = null;
    },
    LOAD_SELLER_SUCCESS: (state, action) => {
        state.seller = action.payload.seller;
        state.products = action.payload.products;
        state.error = null;
        state.loading = false;
    },
    LOAD_SELLER_FAIL: (state, action) => {
        state.loading = false;
        state.seller = null;
        state.products = null;
        state.error = action.payload;
    },

})



export const forgotPasswordReducer = createReducer(forgotPasswordInitialState, {
    FORGOT_PASSWORD_REQUEST: (state) => {
        state.loading = true;
    },
    FORGOT_PASSWORD_SUCCESS: (state, action) => {
        state.loading = false;
        state.message = action.payload;
    },
    FORGOT_PASSWORD_FAIL: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

    RESET_PASSWORD_REQUEST: (state) => {
        state.loading = true;
    },
    RESET_PASSWORD_SUCCESS: (state, action) => {
        state.loading = false;
        state.message = action.payload;
    },
    RESET_PASSWORD_FAIL: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
})
