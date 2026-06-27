import ReactDOM from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { SocketProvider } from './hooks/useSocket'
import './index.css'
import store from './store'

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <ReduxProvider store={store}>
    <SocketProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SocketProvider>
  </ReduxProvider>
)
