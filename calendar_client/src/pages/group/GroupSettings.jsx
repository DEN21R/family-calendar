import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import groupService from '../../services/groupService'
import {
  setActiveGroupId,
  setGroups,
  setGroupError,
} from '../../features/group/groupSlice'

function GroupSettings() {
  const { groupId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { groups, error } = useSelector((state) => state.group)
  const { user } = useSelector((state) => state.auth)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [removeLoadingId, setRemoveLoadingId] = useState(null)
  const [pageLoading, setPageLoading] = useState(false)
  const [localGroup, setLocalGroup] = useState(null)

  const currentGroup = groups.find((g) => g._id === groupId) || localGroup
  const currentUserId = user?._id || user?.id
  const ownerId =
    typeof currentGroup?.owner === 'object' ?
      currentGroup.owner?._id || currentGroup.owner?.id
    : currentGroup?.owner
  const isOwner = Boolean(currentUserId && ownerId && ownerId === currentUserId)

  useEffect(() => {
    if (!groupId) return

    const loadGroup = async () => {
      setPageLoading(true)
      try {
        const response = await groupService.getGroupById(groupId)
        const fetchedGroup = response?.group || response
        if (fetchedGroup?._id) {
          dispatch(setActiveGroupId(fetchedGroup._id))
          setLocalGroup(fetchedGroup)
        }
      } catch (err) {
        dispatch(
          setGroupError(err.response?.data?.error || 'Группа не найдена'),
        )
      } finally {
        setPageLoading(false)
      }
    }

    loadGroup()
  }, [dispatch, groupId])

  if (pageLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!currentGroup) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error">Группа не найдена</Alert>
      </Box>
    )
  }

  const handleInvite = async (e) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return

    setInviteLoading(true)
    try {
      const response = await groupService.inviteMember(groupId, inviteEmail)
      const updatedGroup = response?.group || response
      setLocalGroup(updatedGroup)
      dispatch(
        setGroups(groups.map((g) => (g._id === groupId ? updatedGroup : g))),
      )
      setInviteEmail('')
    } catch (err) {
      dispatch(setGroupError(err.response?.data?.error || 'Ошибка инвайта'))
    } finally {
      setInviteLoading(false)
    }
  }

  const handleRemoveMember = async (memberId) => {
    if (!isOwner) return

    try {
      setRemoveLoadingId(memberId)
      const response = await groupService.removeMember(groupId, memberId)
      const updatedGroup = response?.group || response
      setLocalGroup(updatedGroup)
      dispatch(
        setGroups(groups.map((g) => (g._id === groupId ? updatedGroup : g))),
      )
    } catch (err) {
      dispatch(setGroupError(err.response?.data?.error || 'Ошибка удаления'))
    } finally {
      setRemoveLoadingId(null)
    }
  }

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600 }}
    >
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2, color: '#20419c' }}>
          {currentGroup.name}
        </Typography>
        <Typography variant="body2">
          Владелец: {currentGroup.owner?.name || 'Неизвестно'}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={() => navigate('/calendar')}>
            В календарь группы
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#20419c' }}>
          Участники ({currentGroup.members?.length || 0})
        </Typography>
        <List>
          {currentGroup.members?.map((member) => {
            const memberId =
              typeof member === 'object' ? member._id || member.id : member
            const memberName =
              typeof member === 'object' ?
                member.name || member.email || 'Участник'
              : `Участник ${String(member).substring(0, 6)}`

            return (
              <ListItem
                key={memberId}
                secondaryAction={
                  isOwner && ownerId !== memberId ?
                    <Button
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleRemoveMember(memberId)}
                      color="error"
                      disabled={removeLoadingId === memberId}
                    >
                      {removeLoadingId === memberId ? 'Удаление...' : 'Удалить'}
                    </Button>
                  : null
                }
              >
                <ListItemText primary={memberName} />
              </ListItem>
            )
          })}
        </List>
      </Paper>

      {isOwner && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#20419c' }}>
            Пригласить участника
          </Typography>
          <Box
            component="form"
            onSubmit={handleInvite}
            sx={{ display: 'flex', gap: 1 }}
          >
            <TextField
              placeholder="Email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              size="small"
              sx={{ flex: 1 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={inviteLoading || !inviteEmail.trim()}
            >
              {inviteLoading ? 'Отправляю...' : 'Пригласить'}
            </Button>
          </Box>
        </Paper>
      )}

      {error && <Alert severity="error">{error}</Alert>}
    </Box>
  )
}

export default GroupSettings
