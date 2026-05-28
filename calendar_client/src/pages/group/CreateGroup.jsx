import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import groupService from '../../services/groupService'
import {
  setActiveGroupId,
  setGroupError,
  setGroupLoading,
  setGroups,
} from '../../features/group/groupSlice'

function CreateGroup() {
  const [name, setName] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { groups, loading, error } = useSelector((state) => state.group)

  const handleSubmit = async (event) => {
    event.preventDefault()

    const groupName = name.trim()

    if (!groupName) {
      dispatch(setGroupError('Название группы обязательно'))
      return
    }

    dispatch(setGroupLoading(true))

    try {
      const response = await groupService.createGroup({ name: groupName })
      const createdGroup = response?.group

      if (!createdGroup?._id) {
        throw new Error('Invalid group response')
      }

      dispatch(setGroups([createdGroup, ...groups]))
      dispatch(setActiveGroupId(createdGroup._id))
      navigate('/calendar')
    } catch (requestError) {
      dispatch(
        setGroupError(
          requestError.response?.data?.error || 'Не удалось создать группу',
        ),
      )
    } finally {
      dispatch(setGroupLoading(false))
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 560 }}>
        <Typography variant="h4" color="logo" sx={{ mb: 1 }}>
          Создание группы
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Добавьте название вашей семейной группы. После создания вы сразу
          перейдете в календарь.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'grid', gap: 2 }}
        >
          <TextField
            label="Название группы"
            placeholder="Например: Семья Ивановых"
            value={name}
            onChange={(event) => setName(event.target.value)}
            fullWidth
            required
          />

          {error && (
            <Typography variant="body2" sx={{ color: 'error.main' }}>
              {error}
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Создаем...' : 'Создать группу'}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate('/calendar')}
            >
              Отмена
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default CreateGroup
