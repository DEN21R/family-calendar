import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import groupReducer from '../features/group/groupSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    group: groupReducer,
  },
})
export default store
