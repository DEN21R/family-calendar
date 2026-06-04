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
  Dialog,
  DialogTitle,
  DialogContent,
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
  getLocalPushSupportInfo,
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
  const [browserPushSupported, setBrowserPushSupported] = useState(
    () => getLocalPushSupportInfo().supported,
  )
  const [serverPushSupported, setServerPushSupported] = useState(false)
  const [pushSupportReason, setPushSupportReason] = useState(
    () => getLocalPushSupportInfo().reason,
  )
  const [pushLoading, setPushLoading] = useState(false)
  const [pushDebugOpen, setPushDebugOpen] = useState(false)
  const [pushDebugCopied, setPushDebugCopied] = useState(false)
  const [pushDebug, setPushDebug] = useState({
    origin: '',
    hasLocalSubscription: false,
    hasServerSubscription: false,
    permission: 'default',
    lastPushDataUrl: '-',
  })

  const reminderMenuOpen = Boolean(reminderAnchorEl)

  const getLastPushDataUrl = () => {
    try {
      return localStorage.getItem('fc_last_push_data_url') || '-'
    } catch {
      return '-'
    }
  }

  const saveLastPushDataUrlFromQuery = () => {
    try {
      const current = new URL(window.location.href)
      const pushDataUrl = current.searchParams.get('_pushDataUrl')
      if (!pushDataUrl) {
        return
      }

      localStorage.setItem('fc_last_push_data_url', pushDataUrl)
      current.searchParams.delete('_pushDataUrl')
      window.history.replaceState(
        {},
        '',
        `${current.pathname}${current.search}${current.hash}`,
      )
    } catch {
      // Ignore parse errors in diagnostics helper.
    }
  }

  useEffect(() => {
    saveLastPushDataUrlFromQuery()
  }, [])

  useEffect(() => {
    if (!navigator.serviceWorker) {
      return undefined
    }

    const handleMessage = (event) => {
      const messageType = event.data?.type
      const pushDataUrl = event.data?.url

      if (messageType !== 'push-notification-click' || !pushDataUrl) {
        return
      }

      try {
        localStorage.setItem('fc_last_push_data_url', pushDataUrl)
      } catch {
        // Ignore storage errors in diagnostics helper.
      }

      setPushDebug((current) => ({
        ...current,
        lastPushDataUrl: pushDataUrl,
      }))
    }

    navigator.serviceWorker.addEventListener('message', handleMessage)

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage)
    }
  }, [])

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
        setBrowserPushSupported(Boolean(status.browserSupported))
        setServerPushSupported(Boolean(status.serverSupported))
        setPushSupportReason(status.reason || null)
        setPushEnabled(Boolean(status.pushEnabled && status.hasSubscription))
        setPushDebug({
          origin: window.location.origin,
          hasLocalSubscription: Boolean(status?.hasLocalSubscription),
          hasServerSubscription: Boolean(status?.hasServerSubscription),
          permission:
            status?.permission ||
            (typeof Notification !== 'undefined' ? Notification.permission : 'n/a'),
          lastPushDataUrl: getLastPushDataUrl(),
        })
      })
      .catch(() => {
        const local = getLocalPushSupportInfo()
        setBrowserPushSupported(local.supported)
        setServerPushSupported(false)
        setPushSupportReason(local.reason)
        setPushEnabled(false)
        setPushDebug({
          origin: window.location.origin,
          hasLocalSubscription: false,
          hasServerSubscription: false,
          permission:
            typeof Notification !== 'undefined' ? Notification.permission : 'n/a',
          lastPushDataUrl: getLastPushDataUrl(),
        })
      })
  }, [token])

  const handleOpenPushDebug = async () => {
    if (!token) {
      return
    }

    try {
      const status = await getPushStatus()
      setPushDebug({
        origin: window.location.origin,
        hasLocalSubscription: Boolean(status?.hasLocalSubscription),
        hasServerSubscription: Boolean(status?.hasServerSubscription),
        permission:
          status?.permission ||
          (typeof Notification !== 'undefined' ? Notification.permission : 'n/a'),
        lastPushDataUrl: getLastPushDataUrl(),
      })
    } catch {
      setPushDebug({
        origin: window.location.origin,
        hasLocalSubscription: false,
        hasServerSubscription: false,
        permission:
          typeof Notification !== 'undefined' ? Notification.permission : 'n/a',
        lastPushDataUrl: getLastPushDataUrl(),
      })
    }

    setPushDebugOpen(true)
  }

  const buildPushDebugText = () => {
    return [
      `Origin: ${pushDebug.origin || '-'}`,
      `Local subscription: ${pushDebug.hasLocalSubscription ? 'true' : 'false'}`,
      `Server subscription: ${pushDebug.hasServerSubscription ? 'true' : 'false'}`,
      `Notification permission: ${pushDebug.permission}`,
      `Last push data URL: ${pushDebug.lastPushDataUrl}`,
    ].join('\n')
  }

  const handleCopyPushDebug = async () => {
    const debugText = buildPushDebugText()

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(debugText)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = debugText
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }

      setPushDebugCopied(true)
      window.setTimeout(() => setPushDebugCopied(false), 1500)
    } catch {
      window.alert('Не удалось скопировать автоматически. Скопируй текст вручную.')
    }
  }

  const handleTogglePush = async () => {
    if (!token || pushLoading) {
      return
    }

    if (!browserPushSupported) {
      if (pushSupportReason === 'ios_not_standalone') {
        window.alert(
          'На iPhone откройте приложение с иконки на Домашнем экране (Add to Home Screen). В обычной вкладке Safari push не работает.',
        )
      } else if (pushSupportReason === 'not_secure_context') {
        window.alert('Push работает только по HTTPS.')
      } else if (pushSupportReason === 'no_notification_api') {
        window.alert(
          'В этом браузере/режиме нет поддержки Notification API. На iPhone используйте Safari и запускайте сайт с иконки на Домашнем экране.',
        )
      } else if (pushSupportReason === 'no_service_worker') {
        window.alert(
          'В этом браузере/режиме нет поддержки Service Worker. Для iPhone нужен Safari (добавить на Домой).',
        )
      } else {
        window.alert(
          `Push недоступен в этом браузере/режиме (reason: ${pushSupportReason || 'unknown'}).`,
        )
      }
      return
    }

    if (!serverPushSupported && !pushEnabled) {
      window.alert(
        'Push не настроен на сервере (VAPID). Нужно задать VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY и VAPID_SUBJECT и перезапустить backend.',
      )
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
        setBrowserPushSupported(true)
        setServerPushSupported(true)
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
                  disabled={pushLoading}
                  onClick={handleTogglePush}
                  sx={{ textTransform: 'none' }}
                >
                  {pushLoading ?
                    '...'
                  : pushEnabled ?
                    'Отключить Push'
                  : 'Включить Push'}
                </Button>

                <Button
                  variant="text"
                  size="small"
                  onClick={handleOpenPushDebug}
                  sx={{ textTransform: 'none' }}
                >
                  Push debug
                </Button>

                <Button variant="contained" onClick={handleLogout}>
                  Выйти
                </Button>

                <Dialog
                  open={pushDebugOpen}
                  onClose={() => {
                    setPushDebugOpen(false)
                    setPushDebugCopied(false)
                  }}
                  fullWidth
                  maxWidth="sm"
                >
                  <DialogTitle>Push diagnostics</DialogTitle>
                  <DialogContent>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Origin: {pushDebug.origin || '-'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Local subscription: {pushDebug.hasLocalSubscription ? 'true' : 'false'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Server subscription: {pushDebug.hasServerSubscription ? 'true' : 'false'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Notification permission: {pushDebug.permission}
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      Last push data URL: {pushDebug.lastPushDataUrl}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                      <Button size="small" onClick={handleCopyPushDebug}>
                        {pushDebugCopied ? 'Скопировано' : 'Скопировать debug'}
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          setPushDebugOpen(false)
                          setPushDebugCopied(false)
                        }}
                      >
                        Закрыть
                      </Button>
                    </Box>
                  </DialogContent>
                </Dialog>
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
