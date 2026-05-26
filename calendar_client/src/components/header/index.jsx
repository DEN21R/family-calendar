import {
  AppBar,
  Typography,
  Box,
  Button,
  MenuItem,
  IconButton,
  Menu,
  Divider,
} from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Toolbar from '@mui/material/Toolbar'
import MenuIcon from '@mui/icons-material/Menu'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import logo from '../../assets/logo.png'
import { logout } from '../../features/auth/authSlice'
import { setActiveGroupId } from '../../features/group/groupSlice'

function stringToColor(string) {
  let hash = 0

  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }

  return color
}

function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, token } = useSelector((state) => state.auth)
  const { groups, activeGroupId } = useSelector((state) => state.group)

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [groupAnchorEl, setGroupAnchorEl] = useState(null)
  const groupMenuOpen = Boolean(groupAnchorEl)

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleOpenGroupMenu = (event) => {
    setGroupAnchorEl(event.currentTarget)
  }

  const handleCloseGroupMenu = () => {
    setGroupAnchorEl(null)
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/dashboard')
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
    {
      title: 'Выбрать группу',
      isGroupLabel: true,
    },
  ]
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        borderBottom: '2px solid #e8e8ed',
        background: '#ffffff',
        py: { xs: 2, sm: 3.75 },
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
                fontSize: { sm: '1.4rem', md: '2.125rem' },
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
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
                  {menuNav.map((el) =>
                    el.isGroupLabel ?
                      <Button
                        key={el.title}
                        onClick={handleOpenGroupMenu}
                        sx={{
                          textTransform: 'none',
                          color: '#20419c',
                          fontWeight: 600,
                          p: 0,
                          minWidth: 'auto',
                        }}
                      >
                        {el.title}
                      </Button>
                    : <Box
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
                      </Box>,
                  )}
                </Box>
                <IconButton
                  onClick={handleOpenMenu}
                  sx={{ display: { xs: 'flex', md: 'none' } }}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleCloseMenu}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  {menuNav.map((el) =>
                    el.isGroupLabel ?
                      groups.length > 0 ?
                        <MenuItem
                          key={el.title}
                          disabled
                          sx={{ opacity: 1, fontWeight: 700 }}
                        >
                          {el.title}
                        </MenuItem>
                      : null
                    : <MenuItem
                        key={el.navigate}
                        onClick={() => {
                          handleCloseMenu()
                          navigate(el.navigate)
                        }}
                      >
                        {el.title}
                      </MenuItem>,
                  )}
                  {groups.length > 0 && <Divider />}
                  {groups.map((group) => (
                    <MenuItem
                      key={group._id}
                      selected={activeGroupId === group._id}
                      onClick={() => {
                        dispatch(setActiveGroupId(group._id))
                        handleCloseMenu()
                        handleCloseGroupMenu()
                      }}
                    >
                      {group.name}
                    </MenuItem>
                  ))}
                </Menu>
                <Menu
                  anchorEl={groupAnchorEl}
                  open={groupMenuOpen}
                  onClose={handleCloseGroupMenu}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  {groups.map((group) => (
                    <MenuItem
                      key={group._id}
                      selected={activeGroupId === group._id}
                      onClick={() => {
                        dispatch(setActiveGroupId(group._id))
                        handleCloseGroupMenu()
                      }}
                    >
                      {group.name}
                    </MenuItem>
                  ))}
                </Menu>
                <Avatar
                  sx={{
                    bgcolor: stringToColor(user?.name || 'User'),
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>

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
