import './App.css'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Calendar } from './pages/calendar'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ProtectedRoute from './components/ProtectedRoute'
import GroupRequiredRoute from './components/GroupRequiredRoute'
import AuthLayout from './layouts/AuthLayout'
import PublicLayout from './layouts/PublicLayout'
import MainLayout from './layouts/MainLayout'
import Home from './pages/home'
import Notes from './pages/notes'
import CreateGroup from './pages/group/CreateGroup'
import GroupSettings from './pages/group/GroupSettings'
import authService from './services/authService'
import groupService from './services/groupService'
import { logout, restoreAuth } from './features/auth/authSlice'
import {
  setActiveGroupId,
  setGroupInitialized,
  setGroupLoading,
  setGroups,
} from './features/group/groupSlice'
import { Box } from '@mui/material'

function App() {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)

  useEffect(() => {
    if (!token) {
      dispatch(setGroupInitialized(true))
      return
    }

    const restoreSession = async () => {
      dispatch(setGroupInitialized(false))
      dispatch(setGroupLoading(true))
      try {
        const profile = await authService.me()
        dispatch(restoreAuth(profile?.user || profile))

        const response = await groupService.getMyGroups()
        const groups = response?.groups || []
        dispatch(setGroups(groups))

        const savedGroupId = localStorage.getItem('activeGroupId')
        const hasGroup =
          savedGroupId && groups.some((g) => g._id === savedGroupId)
        if (hasGroup) {
          dispatch(setActiveGroupId(savedGroupId))
        } else if (groups.length > 0) {
          dispatch(setActiveGroupId(groups[0]._id))
        } else {
          dispatch(setActiveGroupId(null))
        }
      } catch (error) {
        console.error('Error restoring session:', error)
        dispatch(logout())
      } finally {
        dispatch(setGroupLoading(false))
        dispatch(setGroupInitialized(true))
      }
    }

    restoreSession()
  }, [dispatch, token])

  return (
    <Box className="app-shell">
      <Routes>
        <Route path="/" element={<Navigate to="/calendar" replace />} />
        <Route element={<PublicLayout />}>
          <Route path="/dashboard" element={<Home />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/groups/create" element={<CreateGroup />} />
            <Route element={<GroupRequiredRoute />}>
              <Route
                path="/groups/:groupId/settings"
                element={<GroupSettings />}
              />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/notes" element={<Notes />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Box>
  )
}

export default App
