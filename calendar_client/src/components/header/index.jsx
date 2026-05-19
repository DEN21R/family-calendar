import {
  AppBar,
  Typography,
  Box,
  Button,
  Select,
  MenuItem,
} from '@mui/material'
import Toolbar from '@mui/material/Toolbar'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { logout } from '../../features/auth/authSlice'
import { setActiveGroupId } from '../../features/group/groupSlice'

function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, token } = useSelector((state) => state.auth)
  const { groups, activeGroupId } = useSelector((state) => state.group)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/dashboard')
  }

  const handleGroupChange = (event) => {
    const groupId = event.target.value
    dispatch(setActiveGroupId(groupId))
  }

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        borderBottom: '2px solid #20419c',
        background: 'linear-gradient(135deg, #a78bfa, #7c3aed) !important',
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
              Family Calendar
            </Typography>
            <Box
              component="img"
              src={logo}
              alt="Company logo"
              sx={{ cursor: 'pointer', height: 50, ml: 2 }}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
              gap: 1.5,
            }}
          >
            {token ?
              <>
                {groups.length > 0 && (
                  <Select
                    value={activeGroupId || ''}
                    onChange={handleGroupChange}
                    sx={{
                      backgroundColor: '#ffffff',
                      color: '#20419c',
                      fontWeight: 500,
                      borderRadius: 1,
                      minWidth: 160,
                    }}
                  >
                    {groups.map((group) => (
                      <MenuItem key={group._id} value={group._id}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                {activeGroupId && (
                  <Button
                    variant="outlined"
                    onClick={() =>
                      navigate(`/groups/${activeGroupId}/settings`)
                    }
                    sx={{
                      borderColor: '#20419c',
                      color: '#20419c',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': { borderColor: '#17327c', color: '#17327c' },
                    }}
                  >
                    Настройки группы
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={() => navigate('/groups/create')}
                  sx={{
                    backgroundColor: '#20419c',
                    color: '#ffffff',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#17327c' },
                  }}
                >
                  Новая группа
                </Button>
                <Typography variant="body1" sx={{ color: '#20419c' }}>
                  {user?.name || 'User'}
                </Typography>
                <Button variant="contained" onClick={handleLogout}>
                  Выйти
                </Button>
              </>
            : <>
                <Button variant="outlined" onClick={() => navigate('/login')}>
                  Войти
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/register')}
                >
                  Регистрация
                </Button>
              </>
            }
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
export default Header
