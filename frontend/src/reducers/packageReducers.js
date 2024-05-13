import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    package: null,
    price: null,
    description: null,
    packageId: null,
};

export const packageReducer = createReducer(initialState, (builder) => {
    builder.addCase('PLAN_PURCHASE', (state, action) => {
        state.package = action.payload.packageName;
        state.price = action.payload.packagePrice;
        state.description = action.payload.packageDescription;
        state.packageId = action.payload.packageId;
    });
});

const paymentInitialState = {
    loading: false,
    error: null
};

export const paymentReducer = createReducer(paymentInitialState, (builder) => {
    builder
        .addCase('PLAN_PAYMENT_REQUEST', (state) => {
            state.loading = true;
        })
        .addCase('PLAN_PAYMENT_SUCCESS', (state) => {
            state.loading = false;
        })
        .addCase('PLAN_PAYMENT_FAIL', (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
});
