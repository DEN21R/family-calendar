import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const { token } = useSelector((state) => state.auth)
  const location = useLocation()

  if (!token) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(`${location.pathname}${location.search}`)}`}
        replace
      />
    )
  }

  return children || <Outlet />
}

export default ProtectedRoute
