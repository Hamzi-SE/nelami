import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    user: null,
    isAuthenticated: false,
    error: null,
};

export const userReducer = createReducer(initialState, (builder) => {
    builder
        .addCase('LOAD_USER_REQUEST', (state) => {
            state.loading = true;
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        })
        .addCase('LOAD_USER_SUCCESS', (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
            state.loading = false;
        })
        .addCase('LOAD_USER_FAIL', (state, action) => {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.error = action.payload;
        })
        .addCase('LOGIN_USER_REQUEST', (state) => {
            state.loading = true;
            state.isAuthenticated = false;
        })
        .addCase('LOGIN_USER_SUCCESS', (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        })
        .addCase('LOGIN_USER_FAIL', (state, action) => {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.error = action.payload;
        })
        .addCase('SIGNUP_USER_REQUEST', (state) => {
            state.loading = true;
            state.isAuthenticated = false;
        })
        .addCase('SIGNUP_USER_SUCCESS', (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        })
        .addCase('SIGNUP_USER_FAIL', (state, action) => {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.error = action.payload;
        })
        .addCase('OTP_SENT_SUCCESS', (state) => {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        })
        .addCase('LOGOUT_USER_REQUEST', (state) => {
            state.loading = true;
        })
        .addCase('LOGOUT_USER_SUCCESS', (state) => {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        })
        .addCase('LOGOUT_USER_FAIL', (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
});

const profileInitialState = {
    loading: false,
    allUsers: null,
    isUpdated: false,
    isDeleted: false,
    error: null,
};

export const profileReducer = createReducer(profileInitialState, (builder) => {
    builder
        .addCase('UPDATE_PROFILE_REQUEST', (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase('UPDATE_PROFILE_SUCCESS', (state, action) => {
            state.loading = false;
            state.isUpdated = true;
            state.error = null;
        })
        .addCase('UPDATE_PROFILE_FAIL', (state, action) => {
            state.loading = false;
            state.isUpdated = false;
            state.error = action.payload;
        })
        .addCase('UPDATE_PASSWORD_REQUEST', (state) => {
            state.loading = true;
        })
        .addCase('UPDATE_PASSWORD_SUCCESS', (state, action) => {
            state.loading = false;
            state.isUpdated = action.payload;
        })
        .addCase('UPDATE_PASSWORD_FAIL', (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase('ALL_USERS_REQUEST', (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase('ALL_USERS_SUCCESS', (state, action) => {
            state.loading = false;
            state.allUsers = action.payload;
            state.error = null;
        })
        .addCase('ALL_USERS_FAIL', (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase('DELETE_USER_REQUEST', (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase('DELETE_USER_SUCCESS', (state) => {
            state.loading = false;
            state.isDeleted = true;
            state.error = null;
        })
        .addCase('DELETE_USER_FAIL', (state, action) => {
            state.loading = false;
            state.isDeleted = false;
            state.error = action.payload;
        });
});

const sellerInitialState = {
    loading: false,
    seller: null,
    products: null,
    error: null,
};

export const sellerReducer = createReducer(sellerInitialState, (builder) => {
    builder
        .addCase('LOAD_SELLER_REQUEST', (state) => {
            state.loading = true;
            state.seller = null;
            state.products = null;
            state.error = null;
        })
        .addCase('LOAD_SELLER_SUCCESS', (state, action) => {
            state.seller = action.payload.seller;
            state.products = action.payload.products;
            state.error = null;
            state.loading = false;
        })
        .addCase('LOAD_SELLER_FAIL', (state, action) => {
            state.loading = false;
            state.seller = null;
            state.products = null;
            state.error = action.payload;
        });
});

const forgotPasswordInitialState = {
    loading: false,
    message: null,
    success: null,
    error: null,
};

export const forgotPasswordReducer = createReducer(forgotPasswordInitialState, (builder) => {
    builder
        .addCase('FORGOT_PASSWORD_REQUEST', (state) => {
            state.loading = true;
        })
        .addCase('FORGOT_PASSWORD_SUCCESS', (state, action) => {
            state.loading = false;
            state.message = action.payload;
        })
        .addCase('FORGOT_PASSWORD_FAIL', (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase('RESET_PASSWORD_REQUEST', (state) => {
            state.loading = true;
        })
        .addCase('RESET_PASSWORD_SUCCESS', (state, action) => {
            state.loading = false;
            state.message = action.payload;
        })
        .addCase('RESET_PASSWORD_FAIL', (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
});