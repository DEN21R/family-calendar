import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const { token } = useSelector((state) => state.auth)

  if (!token) {
    return <Navigate to="/dashboard" replace />
  }

  return children || <Outlet />
}

export default ProtectedRoute
