import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    conversation: null,
    error: null,
};

export const conversationReducer = createReducer(initialState, (builder) => {
    builder
        .addCase('CREATE_CONVERSATION_REQUEST', (state) => {
            state.loading = true;
            state.conversation = null;
            state.error = null;
        })
        .addCase('CREATE_CONVERSATION_SUCCESS', (state, action) => {
            state.conversation = action.payload;
            state.loading = false;
        })
        .addCase('CREATE_CONVERSATION_FAIL', (state, action) => {
            state.loading = false;
            state.conversation = null; 
            state.error = action.payload;
        })
        .addCase('GET_CONVERSATION_REQUEST', (state) => {
            state.loading = true;
            state.conversation = null;
            state.error = null;
        })
        .addCase('GET_CONVERSATION_SUCCESS', (state, action) => {
            state.conversation = action.payload;
            state.loading = false;
        })
        .addCase('GET_CONVERSATION_FAIL', (state, action) => {
            state.loading = false;
            state.conversation = null; 
            state.error = action.payload;
        });
});



const conversationsInitialState = {
    loading: false,
    conversations: null,
    error: null,
};

export const conversationsReducer = createReducer(conversationsInitialState, (builder) => {
    builder
        .addCase('GET_ALL_CONVERSATIONS_REQUEST', (state) => {
            state.loading = true;
            state.conversations = null;
            state.error = null;
        })
        .addCase('GET_ALL_CONVERSATIONS_SUCCESS', (state, action) => {
            state.conversations = action.payload;
            state.loading = false;
        })
        .addCase('GET_ALL_CONVERSATIONS_FAIL', (state, action) => {
            state.loading = false;
            state.conversations = null; 
            state.error = action.payload;
        });
});



const messagesInitialState = {
    loading: false,
    messages: [],
    error: null,
};

export const messagesReducer = createReducer(messagesInitialState, (builder) => {
    builder
        .addCase('GET_MESSAGES_REQUEST', (state) => {
            state.loading = true;
            state.messages = [];
            state.error = null;
        })
        .addCase('GET_MESSAGES_SUCCESS', (state, action) => {
            state.messages = action.payload;
            state.loading = false;
        })
        .addCase('GET_CONVERSATION_FAIL', (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
});
