import { createReducer } from "@reduxjs/toolkit";


const initialState = {
    loading: true,
    bid: null,
    error: null,
}

export const bidReducer = createReducer(initialState, {

    BID_REQUEST: (state) => {
        state.loading = true;
        state.bid = null;
        state.error = null;
    },
    BID_SUCCESS: (state, action) => {
        state.bid = action.payload;
        state.loading = false;
    },
    BID_FAIL: (state, action) => {
        state.bid = false;
        state.error = action.payload;
    }

})

const bidsInitialState = {
    loading: true,
    bids: null,
    error: null,
}

export const bidsReducer = createReducer(bidsInitialState, {

    PRODUCT_BIDS_REQUEST: (state) => {
        state.loading = true;
        state.bids = null;
        state.error = null;
    },
    PRODUCT_BIDS_SUCCESS: (state, action) => {
        state.bids = action.payload;
        state.loading = false;
    },
    PRODUCT_BIDS_FAIL: (state, action) => {
        state.bids = false;
        state.error = action.payload;
    },


    BUYER_ALL_BIDS_REQUEST: (state) => {
        state.loading = true;
        state.bids = null;
        state.error = null;
    },
    BUYER_ALL_BIDS_SUCCESS: (state, action) => {
        state.bids = action.payload;
        state.loading = false;
    },
    BUYER_ALL_BIDS_FAIL: (state, action) => {
        state.bids = false;
        state.error = action.payload;
    }

})
