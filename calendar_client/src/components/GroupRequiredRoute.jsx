import { Box, CircularProgress } from '@mui/material'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

function GroupRequiredRoute({ children }) {
  const { token } = useSelector((state) => state.auth)
  const { activeGroupId, initialized } = useSelector((state) => state.group)

  if (!token) {
    return <Navigate to="/dashboard" replace />
  }

  if (!initialized) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!activeGroupId) {
    return <Navigate to="/groups/create" replace />
  }

  return children || <Outlet />
}

export default GroupRequiredRoute
