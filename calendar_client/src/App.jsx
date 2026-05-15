import './App.css'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Calendar } from './pages/calendar'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ProtectedRoute from './components/ProtectedRoute'
import AuthLayout from './layouts/AuthLayout'
import MainLayout from './layouts/MainLayout'
import Home from './pages/home'
import Notes from './pages/notes'
import authService from './services/authService'
import { restoreAuth } from './features/auth/authSlice'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      return
    }

    authService
      .me()
      .then((user) => {
        dispatch(restoreAuth(user))
      })
      .catch(() => {
        localStorage.removeItem('token')
      })
  }, [dispatch])

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Home />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/notes" element={<Notes />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
