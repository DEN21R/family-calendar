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
import { NavLink, useNavigate } from 'react-router-dom'
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
  const menuNav = [
    {
      navigate: '/calendar',
      title: 'Календарь',
    },
    {
      navigate: '/notes',
      title: 'Заметки',
    },
    {
      navigate: '/groups/create',
      title: 'Создать группу',
    },
  ]
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        borderBottom: '2px solid #e8e8ed',
        background: '#ffffff',
        py: 3.75,
      }}
    >
      <Toolbar disableGutters sx={{ px: 0 }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              component="img"
              src={logo}
              alt="Company logo"
              sx={{ cursor: 'pointer', height: 60 }}
            />
            <Typography
              variant="h4"
              component="div"
              color="logo"
              sx={{
                display: { xs: 'none', sm: 'block' },
                fontSize: { sm: '1.6rem', md: '2.125rem' },
                lineHeight: 1.1,
                whiteSpace: 'nowrap',
              }}
            >
              Family Calendar
            </Typography>
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
                <Box sx={{ display: 'flex', gap: 3 }}>
                  {menuNav.map((el) => (
                    <Box
                      key={el.navigate}
                      component={NavLink}
                      to={el.navigate}
                      sx={{
                        textDecoration: 'none',
                        color: '#20419c',
                        fontWeight: 600,
                        '&.active': {
                          color: '#20419c80',
                        },
                      }}
                    >
                      {el.title}
                    </Box>
                  ))}
                </Box>
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
                      '& .MuiSelect-select': {
                        padding: '6px 12px',
                      },
                      '& .MuiSelect-icon': {
                        color: '#20419c',
                      },
                    }}
                    displayEmpty
                  >
                    {groups.map((group) => (
                      <MenuItem key={group._id} value={group._id}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}

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
