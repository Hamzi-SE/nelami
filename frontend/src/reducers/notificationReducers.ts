import { createReducer } from '@reduxjs/toolkit'

const initialState = {
  notifications: [],
  loading: false,
  error: null,
}

export const notificationReducer = createReducer(initialState, (builder) => {
  builder
    .addCase('GET_NOTIFICATIONS_REQUEST', (state) => {
      state.loading = true
      state.error = null
    })
    .addCase('GET_NOTIFICATIONS_SUCCESS', (state, action: any) => {
      state.notifications = action.payload
      state.loading = false
      state.error = null
    })
    .addCase('ADD_NOTIFICATION', (state, action: any) => {
      state.notifications.unshift(action.payload)
      state.loading = false
      state.error = null
    })
    .addCase('GET_NOTIFICATIONS_FAIL', (state, action: any) => {
      state.loading = false
      state.error = action.payload
    })
    .addCase('MARK_NOTIFICATION_AS_READ', (state, action: any) => {
      const notificationId = action.payload
      state.notifications = state.notifications.map((notification) =>
        notification._id === notificationId ? { ...notification, read: true } : notification
      )
    })
    .addCase('MARK_NOTIFICATION_AS_READ_FAIL', (state, action: any) => {
      state.error = action.payload
    })
})
