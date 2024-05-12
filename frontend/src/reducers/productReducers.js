import { createReducer } from "@reduxjs/toolkit";


const initialState = {
    loading: false,
    products: null,
    error: null,
}

export const productsReducer = createReducer(initialState, {

    ADMIN_PRODUCTS_REQUEST: (state) => {
        state.loading = true;
        state.products = null;
        state.error = null;
    },
    ADMIN_PRODUCTS_SUCCESS: (state, action) => {
        state.products = action.payload;
        state.loading = false;
    },
    ADMIN_PRODUCTS_FAIL: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

    ADMIN_APPROVAL_PRODUCTS_REQUEST: (state) => {
        state.loading = true;
        state.products = null;
        state.error = null;
    },
    ADMIN_APPROVAL_PRODUCTS_SUCCESS: (state, action) => {
        state.products = action.payload;
        state.loading = false;
    },
    ADMIN_APPROVAL_PRODUCTS_FAIL: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

    SELLER_APPROVAL_PRODUCTS_REQUEST: (state) => {
        state.loading = true;
        state.products = null;
        state.error = null;
    },
    SELLER_APPROVAL_PRODUCTS_SUCCESS: (state, action) => {
        state.products = action.payload;
        state.loading = false;
    },
    SELLER_APPROVAL_PRODUCTS_FAIL: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

    ALL_PRODUCTS_REQUEST: (state) => {
        state.loading = true;
        state.products = null;
        state.error = null;
    },
    ALL_PRODUCTS_SUCCESS: (state, action) => {
        state.products = action.payload;
        state.loading = false;
    },
    ALL_PRODUCTS_FAIL: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

})


const productInitialState = {
    loading: false,
    product: null,
    error: null,
    isDeleted: false,
    isUpdated: false,
}

export const productReducer = createReducer(productInitialState, {

    NEW_PRODUCT_REQUEST: (state) => {
        state.loading = true;
        state.product = null;
        state.error = null;
    },
    NEW_PRODUCT_SUCCESS: (state, action) => {
        state.product = action.payload;
        state.loading = false;
    },
    NEW_PRODUCT_FAIL: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

    LOAD_PRODUCT_REQUEST: (state) => {
        state.loading = true;
        state.product = null;
        state.error = null;
    },
    LOAD_PRODUCT_SUCCESS: (state, action) => {
        state.product = action.payload;
        state.loading = false;
    },
    LOAD_PRODUCT_FAIL: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

    UPDATE_PRODUCT_REQUEST: (state) => {
        state.loading = true;
        state.product = null;
        state.error = null;
        state.isUpdated = false;
    },
    UPDATE_PRODUCT_SUCCESS: (state, action) => {
        state.product = action.payload;
        state.loading = false;
        state.isUpdated = true;
    },
    UPDATE_PRODUCT_FAIL: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isUpdated = false;
    },

    //ADMIN
    DELETE_PRODUCT_REQUEST: (state) => {
        state.loading = true;
        state.product = null;
        state.error = null;
        state.isDeleted = false;
    },
    DELETE_PRODUCT_SUCCESS: (state, action) => {
        state.product = action.payload;
        state.loading = false;
        state.isDeleted = true;
    },
    DELETE_PRODUCT_FAIL: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isDeleted = false;
    },

    ADMIN_APPROVE_PRODUCT_REQUEST: (state) => {
        state.loading = true;
        state.product = null;
        state.error = null;
    },
    ADMIN_APPROVE_PRODUCT_SUCCESS: (state, action) => {
        state.product = action.payload;
        state.loading = false;
    },
    ADMIN_APPROVE_PRODUCT_FAIL: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    }


})

const singleProductInitialState = {
    loading: false,
    product: null,
    error: null,
}

export const singleProductReducer = createReducer(singleProductInitialState, {

    SINGLE_PRODUCT_REQUEST: (state) => {
        state.loading = true;
        state.product = null;
        state.error = null;
    },
    SINGLE_PRODUCT_SUCCESS: (state, action) => {
        state.product = action.payload;
        state.loading = false;
    },
    SINGLE_PRODUCT_FAIL: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

})