import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    data: null,
    error: null,
};

export const dataReducer = createReducer(initialState, (builder) => {
    builder
        .addCase('LOAD_DATA_REQUEST', (state) => {
            state.loading = true;
            state.data = null;
            state.error = null;
        })
        .addCase('LOAD_DATA_SUCCESS', (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
        })
        .addCase('LOAD_DATA_FAIL', (state, action) => {
            state.loading = false;
            state.data = null;
            state.error = action.payload;
        });
});

const featureInitialState = {
    loading: false,
    feature: null,
    success: null,
    error: null,
};

export const featureReducer = createReducer(featureInitialState, (builder) => {
    builder
        .addCase('ADD_FEATURE_REQUEST', (state) => {
            state.loading = true;
            state.feature = null; // Clear previous data
            state.success = null; // Reset success flag
            state.error = null; // Clear any existing errors
        })
        .addCase('ADD_FEATURE_SUCCESS', (state, action) => {
            state.loading = false;
            state.feature = action.payload;
            state.success = true;
            state.error = null;
        })
        .addCase('ADD_FEATURE_FAIL', (state, action) => {
            state.loading = false;
            state.feature = null; // Ensure no stale data
            state.success = false;
            state.error = action.payload;
        })
        .addCase('REMOVE_FEATURE_REQUEST', (state) => {
            state.loading = true;
            state.feature = null; // Clear previous data
            state.success = null; // Reset success flag
            state.error = null; // Clear any existing errors
        })
        .addCase('REMOVE_FEATURE_SUCCESS', (state, action) => {
            state.loading = false;
            state.feature = action.payload;
            state.success = true;
            state.error = null;
        })
        .addCase('REMOVE_FEATURE_FAIL', (state, action) => {
            state.loading = false;
            state.feature = null; // Ensure no stale data
            state.success = false;
            state.error = action.payload;
        });
});