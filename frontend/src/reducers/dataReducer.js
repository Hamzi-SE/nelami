import { createReducer } from "@reduxjs/toolkit";


const initialState = {
    loading: true,
    data: null,
    error: null,
}


export const dataReducer = createReducer(initialState, {
    LOAD_DATA_REQUEST: (state) => {
        state.loading = true;
        state.error = null;
    },
    LOAD_DATA_SUCCESS: (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
    },
    LOAD_DATA_FAIL: (state, action) => {
        state.loading = false;
        state.data = null;
        state.error = action.payload;
    }
})


const featureInitialState = {
    loading: false,
    feature: null,
    success: null,
    error: null,
}


export const featureReducer = createReducer(featureInitialState, {
    ADD_FEATURE_REQUEST: (state) => {
        state.loading = true;
        state.error = null;
    },
    ADD_FEATURE_SUCCESS: (state, action) => {
        state.loading = false;
        state.feature = action.payload;
        state.success = true;
        state.error = null;
    },
    ADD_FEATURE_FAIL: (state, action) => {
        state.loading = false;
        state.data = null;
        state.success = false;
        state.error = action.payload;
    },


    REMOVE_FEATURE_REQUEST: (state) => {
        state.loading = true;
        state.error = null;
    },
    REMOVE_FEATURE_SUCCESS: (state, action) => {
        state.loading = false;
        state.feature = action.payload;
        state.success = true;
        state.error = null;
    },
    REMOVE_FEATURE_FAIL: (state, action) => {
        state.loading = false;
        state.data = null;
        state.success = false;
        state.error = action.payload;
    }
})

