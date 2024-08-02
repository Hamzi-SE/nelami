import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { Provider as ReduxProvider } from 'react-redux'
import store from './store'
import { SocketProvider } from './hooks/useSocket'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <ReduxProvider store={store}>
    <SocketProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SocketProvider>
  </ReduxProvider>
)
