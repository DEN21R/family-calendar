import {
  AppBar,
  Typography,
  Box,
  Button,
  MenuItem,
  IconButton,
  Menu,
  Divider,
  Badge,
  Tooltip,
  ListItemText,
} from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Toolbar from '@mui/material/Toolbar'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import logo from '../../assets/logo.png'
import { logout } from '../../features/auth/authSlice'
import { setActiveGroupId } from '../../features/group/groupSlice'
import { getGroupAvatarIcon } from '../../utils/groupAvatar'
import { getUpcomingReminders } from '../../services/reminderService'
import {
  disablePush,
  enablePush,
  getPushStatus,
} from '../../services/pushService'

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

function formatDateTime(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
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
  const [reminderAnchorEl, setReminderAnchorEl] = useState(null)
  const [reminderCount, setReminderCount] = useState(0)
  const [reminderItems, setReminderItems] = useState([])
  const [pushEnabled, setPushEnabled] = useState(false)
  const [pushSupported, setPushSupported] = useState(false)
  const [pushLoading, setPushLoading] = useState(false)

  const reminderMenuOpen = Boolean(reminderAnchorEl)

  useEffect(() => {
    if (!token) {
      return
    }

    async function loadReminders() {
      try {
        const data = await getUpcomingReminders(5)
        setReminderCount(Number(data?.count) || 0)
        setReminderItems(Array.isArray(data?.reminders) ? data.reminders : [])
      } catch {
        setReminderCount(0)
        setReminderItems([])
      }
    }

    loadReminders()
  }, [token])

  useEffect(() => {
    if (!token) {
      return
    }

    getPushStatus()
      .then((status) => {
        setPushSupported(status.supported)
        setPushEnabled(Boolean(status.pushEnabled && status.hasSubscription))
      })
      .catch(() => {
        setPushSupported(false)
        setPushEnabled(false)
      })
  }, [token])

  const handleTogglePush = async () => {
    if (!token || pushLoading) {
      return
    }

    setPushLoading(true)
    try {
      if (pushEnabled) {
        await disablePush()
        setPushEnabled(false)
      } else {
        await enablePush()
        setPushEnabled(true)
        setPushSupported(true)
      }
    } catch (error) {
      window.alert(
        error?.message ||
          'Не удалось изменить настройки push-уведомлений. Проверьте разрешение браузера.',
      )
    } finally {
      setPushLoading(false)
    }
  }

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

  const handleOpenReminderMenu = (event) => {
    setReminderAnchorEl(event.currentTarget)

    getUpcomingReminders(5)
      .then((data) => {
        setReminderCount(Number(data?.count) || 0)
        setReminderItems(Array.isArray(data?.reminders) ? data.reminders : [])
      })
      .catch(() => {
        setReminderCount(0)
        setReminderItems([])
      })
  }

  const handleCloseReminderMenu = () => {
    setReminderAnchorEl(null)
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
              onClick={() => navigate('/dashboard')}
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
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          mr: 1,
                          bgcolor: group.color || '#1976D2',
                        }}
                      >
                        {(() => {
                          const Icon = getGroupAvatarIcon(group.avatarKey)
                          return <Icon sx={{ fontSize: 16 }} />
                        })()}
                      </Avatar>
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
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          mr: 1,
                          bgcolor: group.color || '#1976D2',
                        }}
                      >
                        {(() => {
                          const Icon = getGroupAvatarIcon(group.avatarKey)
                          return <Icon sx={{ fontSize: 16 }} />
                        })()}
                      </Avatar>
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

                <Tooltip title="Напоминания">
                  <IconButton onClick={handleOpenReminderMenu}>
                    <Badge
                      color="error"
                      badgeContent={reminderCount > 99 ? '99+' : reminderCount}
                    >
                      <NotificationsNoneIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={reminderAnchorEl}
                  open={reminderMenuOpen}
                  onClose={handleCloseReminderMenu}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  {reminderItems.length ?
                    reminderItems.map((item) => (
                      <MenuItem
                        key={item.taskId}
                        onClick={handleCloseReminderMenu}
                      >
                        <ListItemText
                          primary={item.title}
                          secondary={`${item.groupName} · ${formatDateTime(item.dueAt)}`}
                        />
                      </MenuItem>
                    ))
                  : <MenuItem disabled>Скорых напоминаний нет</MenuItem>}
                </Menu>

                <Button
                  variant={pushEnabled ? 'contained' : 'outlined'}
                  size="small"
                  disabled={!pushSupported || pushLoading}
                  onClick={handleTogglePush}
                  sx={{ textTransform: 'none' }}
                >
                  {pushLoading ?
                    '...' : pushEnabled ?
                      'Push: вкл' :
                      'Push: выкл'}
                </Button>

                <Button variant="contained" onClick={handleLogout}>
                  Выйти
                </Button>
              </>
            : <>
                <Button
                  variant="outlined"
                  sx={{ color: '#0051f9' }}
                  onClick={() => navigate('/login')}
                >
                  Войти
                </Button>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#0051f9' }}
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
