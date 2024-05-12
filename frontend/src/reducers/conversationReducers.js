import { createReducer } from "@reduxjs/toolkit";


const initialState = {
    loading: false,
    conversation: null,
    error: null,
}

export const conversationReducer = createReducer(initialState, {

    CREATE_CONVERSATION_REQUEST: (state) => {
        state.loading = true;
        state.conversation = null;
        state.error = null;
    },
    CREATE_CONVERSATION_SUCCESS: (state, action) => {
        state.conversation = action.payload;
        state.loading = false;
    },
    CREATE_CONVERSATION_FAIL: (state, action) => {
        state.conversation = false;
        state.error = action.payload;
    },

    GET_CONVERSATION_REQUEST: (state) => {
        state.loading = true;
        state.conversation = null;
        state.error = null;
    },
    GET_CONVERSATION_SUCCESS: (state, action) => {
        state.conversation = action.payload;
        state.loading = false;
    },
    GET_CONVERSATION_FAIL: (state, action) => {
        state.conversation = false;
        state.error = action.payload;
    },


})


const conversationsInitialState = {
    loading: false,
    conversations: null,
    error: null,
}

export const conversationsReducer = createReducer(conversationsInitialState, {
    GET_ALL_CONVERSATIONS_REQUEST: (state) => {
        state.loading = true;
        state.conversations = null;
        state.error = null;
    },
    GET_ALL_CONVERSATIONS_SUCCESS: (state, action) => {
        state.conversations = action.payload;
        state.loading = false;
    },
    GET_ALL_CONVERSATIONS_FAIL: (state, action) => {
        state.conversations = false;
        state.error = action.payload;
    },
})



const messagesInitialState = {
    loading: false,
    messages: [],
    error: null,
}

export const messagesReducer = createReducer(messagesInitialState, {

    GET_MESSAGES_REQUEST: (state) => {
        state.loading = true;
        state.messages = [];
        state.error = null;
    },
    GET_MESSAGES_SUCCESS: (state, action) => {
        state.messages = action.payload;
        state.loading = false;
    },
    GET_CONVERSATION_FAIL: (state, action) => {
        state.loadingi = false;
        state.error = action.payload;
    },


})
