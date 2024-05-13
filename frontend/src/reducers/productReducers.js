import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    products: null,
    error: null,
};

export const productsReducer = createReducer(initialState, (builder) => {
    builder
        .addCase('ADMIN_PRODUCTS_REQUEST', (state) => {
            state.loading = true;
            state.products = null;
            state.error = null;
        })
        .addCase('ADMIN_PRODUCTS_SUCCESS', (state, action) => {
            state.products = action.payload;
            state.loading = false;
        })
        .addCase('ADMIN_PRODUCTS_FAIL', (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase('ADMIN_APPROVAL_PRODUCTS_REQUEST', (state) => {
            state.loading = true;
            state.products = null;
            state.error = null;
        })
        .addCase('ADMIN_APPROVAL_PRODUCTS_SUCCESS', (state, action) => {
            state.products = action.payload;
            state.loading = false;
        })
        .addCase('ADMIN_APPROVAL_PRODUCTS_FAIL', (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase('SELLER_APPROVAL_PRODUCTS_REQUEST', (state) => {
            state.loading = true;
            state.products = null;
            state.error = null;
        })
        .addCase('SELLER_APPROVAL_PRODUCTS_SUCCESS', (state, action) => {
            state.products = action.payload;
            state.loading = false;
        })
        .addCase('SELLER_APPROVAL_PRODUCTS_FAIL', (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase('ALL_PRODUCTS_REQUEST', (state) => {
            state.loading = true;
            state.products = null;
            state.error = null;
        })
        .addCase('ALL_PRODUCTS_SUCCESS', (state, action) => {
            state.products = action.payload;
            state.loading = false;
        })
        .addCase('ALL_PRODUCTS_FAIL', (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
});

const productInitialState = {
    loading: false,
    product: null,
    error: null,
    isDeleted: false,
    isUpdated: false,
};

export const productReducer = createReducer(productInitialState, (builder) => {
    builder
        .addCase('NEW_PRODUCT_REQUEST', (state) => {
            state.loading = true;
            state.product = null;
            state.error = null;
        })
        .addCase('NEW_PRODUCT_SUCCESS', (state, action) => {
            state.product = action.payload;
            state.loading = false;
        })
        .addCase('NEW_PRODUCT_FAIL', (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase('LOAD_PRODUCT_REQUEST', (state) => {
            state.loading = true;
            state.product = null;
            state.error = null;
        })
        .addCase('LOAD_PRODUCT_SUCCESS', (state, action) => {
            state.product = action.payload;
            state.loading = false;
        })
        .addCase('LOAD_PRODUCT_FAIL', (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase('UPDATE_PRODUCT_REQUEST', (state) => {
            state.loading = true;
            state.isUpdated = false;
        })
        .addCase('UPDATE_PRODUCT_SUCCESS', (state, action) => {
            state.product = action.payload;
            state.loading = false;
            state.isUpdated = true;
        })
        .addCase('UPDATE_PRODUCT_FAIL', (state, action) => {
            state.loading = false;
            state.isUpdated = false;
            state.error = action.payload;
        })
        .addCase('DELETE_PRODUCT_REQUEST', (state) => {
            state.loading = true;
            state.isDeleted = false;
        })
        .addCase('DELETE_PRODUCT_SUCCESS', (state) => {
            state.loading = false;
            state.isDeleted = true;
        })
        .addCase('DELETE_PRODUCT_FAIL', (state, action) => {
            state.loading = false;
            state.isDeleted = false;
            state.error = action.payload;
        })
        .addCase('ADMIN_APPROVE_PRODUCT_REQUEST', (state) => {
            state.loading = true;
        })
        .addCase('ADMIN_APPROVE_PRODUCT_SUCCESS', (state, action) => {
            state.loading = false;
        })
        .addCase('ADMIN_APPROVE_PRODUCT_FAIL', (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
});

const singleProductInitialState = {
    loading: false,
    product: null,
    error: null,
};

export const singleProductReducer = createReducer(singleProductInitialState, (builder) => {
    builder
        .addCase('SINGLE_PRODUCT_REQUEST', (state) => {
            state.loading = true;
            state.product = null;
            state.error = null;
        })
        .addCase('SINGLE_PRODUCT_SUCCESS', (state, action) => {
            state.product = action.payload;
            state.loading = false;
        })
        .addCase('SINGLE_PRODUCT_FAIL', (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
});
