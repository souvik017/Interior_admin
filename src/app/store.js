import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from '../features/auth/authSlice'
import { quotationsReducer } from '../features/quotations/quotationsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quotations: quotationsReducer,
  },
})
