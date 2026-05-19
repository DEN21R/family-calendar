import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setError, setLoading, setUser } from '../../features/auth/authSlice'
import authService from '../../services/authService'
import { Box, Button, Typography, TextField, Alert } from '@mui/material'

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const { loading, error } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(setLoading())

    try {
      const response = await authService.login(
        formData.email,
        formData.password,
      )
      dispatch(setUser(response))
      navigate('/dashboard')
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Ошибка входа'))
    }
  }

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ mb: 3, color: '#20419c', fontWeight: 'bold' }}
      >
        Вход
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          label="Email"
          required
          disabled={loading}
        />
        <TextField
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          label="Пароль"
          required
          disabled={loading}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? 'Загрузка...' : 'Войти'}
        </Button>
      </Box>

      <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
        Нет аккаунта?{' '}
        <Button size="small" onClick={() => navigate('/register')}>
          Регистрация
        </Button>
      </Typography>
    </Box>
  )
}

export default Login
