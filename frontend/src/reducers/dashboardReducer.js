import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    activeComponent: "statsDashboard",
};

export const dashboardReducer = createReducer(initialState, (builder) => {
    builder
        .addCase('SET_ACTIVE_COMPONENT', (state, action) => {
            state.activeComponent = action.payload;
        })
        .addCase('RESET_ACTIVE_COMPONENT', (state) => {
            state.activeComponent = "statsDashboard";
        });
});
