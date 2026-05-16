import { AppBar, Typography, Box, Button } from '@mui/material'
import Toolbar from '@mui/material/Toolbar'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { logout } from '../../features/auth/authSlice'

function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/dashboard')
  }

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        borderBottom: '2px solid #20419c',
        backgroundColor: '#c0cff6',
        px: { xs: 2, sm: 3, md: 5 },
        py: 3.75,
      }}
    >
      <Toolbar sx={{ px: 0 }}>
        <Box
          sx={{
            width: '100%',
            maxWidth: 1440,
            mx: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h4" component="div" sx={{ color: '#20419c' }}>
              Задания
            </Typography>
            <Box
              component="img"
              src={logo}
              alt="Company logo"
              sx={{ cursor: 'pointer', height: 50, ml: 2 }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" sx={{ color: '#20419c' }}>
              {user?.name || 'User'}
            </Typography>
            <Button variant="contained" onClick={handleLogout}>
              Выйти
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
export default Header
