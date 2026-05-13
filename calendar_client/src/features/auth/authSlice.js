import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true
      state.error = null
    },
    setUser(state, action) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.loading = false
      localStorage.setItem('token', action.payload.token)
    },
    setError(state, action) {
      state.error = action.payload
      state.loading = false
    },
    logout(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    },
    restoreAuth(state, action) {
      state.user = action.payload
      state.loading = false
    },
  },
})

export const { setLoading, setUser, setError, logout, restoreAuth } =
  authSlice.actions
export default authSlice.reducer

// Actions

//  `setLoading` — начало загрузки (показать spinner)
//  `setUser` — успешная авторизация (сохранить user + token)
//  `setError` — ошибка при логине
// `logout` — очистить данные
// `restoreAuth` — восстановить при refresh страницы
