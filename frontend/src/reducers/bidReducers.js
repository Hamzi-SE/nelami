import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    bid: null,
    error: null,
};

export const bidReducer = createReducer(initialState, (builder) => {
    builder
        .addCase('BID_REQUEST', (state) => {
            state.loading = true;
            state.bid = null;
            state.error = null;
        })
        .addCase('BID_SUCCESS', (state, action) => {
            state.bid = action.payload;
            state.loading = false;
        })
        .addCase('BID_FAIL', (state, action) => {
            state.loading = false;
            state.bid = null;
            state.error = action.payload;
        });
});


const bidsInitialState = {
    loading: false,
    bids: null,
    error: null,
};

export const bidsReducer = createReducer(bidsInitialState, (builder) => {
    builder
        .addCase('PRODUCT_BIDS_REQUEST', (state) => {
            state.loading = true;
            state.bids = null;
            state.error = null;
        })
        .addCase('PRODUCT_BIDS_SUCCESS', (state, action) => {
            state.bids = action.payload;
            state.loading = false;
        })
        .addCase('PRODUCT_BIDS_FAIL', (state, action) => {
            state.loading = false;
            state.bids = null;
            state.error = action.payload;
        })
        .addCase('BUYER_ALL_BIDS_REQUEST', (state) => {
            state.loading = true;
            state.bids = null;
            state.error = null;
        })
        .addCase('BUYER_ALL_BIDS_SUCCESS', (state, action) => {
            state.bids = action.payload;
            state.loading = false;
        })
        .addCase('BUYER_ALL_BIDS_FAIL', (state, action) => {
            state.loading = false;
            state.bids = null; 
            state.error = action.payload;
        });
});