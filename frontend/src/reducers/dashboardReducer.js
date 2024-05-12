import { createReducer } from "@reduxjs/toolkit";


const initialState = {
    activeComponent: "statsDashboard",
}

export const dashboardReducer = createReducer(initialState, {

    SET_ACTIVE_COMPONENT: (state, action) => {
        state.activeComponent = action.payload;
    },
    RESET_ACTIVE_COMPONENT: (state) => {
        state.activeComponent = "statsDashboard";
    }


})