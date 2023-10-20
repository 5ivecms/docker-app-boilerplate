import { CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'

import App from './App'
import { AuthMiddleware } from './components/middleware'
import { store } from './core/redux/store'
import reportWebVitals from './reportWebVitals'

const helmetContext = {}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <CssBaseline />
      <SnackbarProvider anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} autoHideDuration={2000} maxSnack={5}>
        <HelmetProvider context={helmetContext}>
          <AuthMiddleware>
            <App />
          </AuthMiddleware>
        </HelmetProvider>
      </SnackbarProvider>
    </Provider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
