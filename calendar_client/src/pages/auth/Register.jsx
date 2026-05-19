import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setError, setLoading, setUser } from '../../features/auth/authSlice'
import authService from '../../services/authService'
import { Box, Button, Typography, TextField, Alert } from '@mui/material'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const { loading, error } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      dispatch(setError('Пароли не совпадают'))
      return
    }

    dispatch(setLoading())
    try {
      const response = await authService.register(
        formData.name,
        formData.email,
        formData.password,
      )
      dispatch(setUser(response))
      navigate('/dashboard')
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Ошибка регистрации'))
    }
  }

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ mb: 3, color: '#20419c', fontWeight: 'bold' }}
      >
        Регистрация
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
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          label="Имя"
          required
          disabled={loading}
        />
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
        <TextField
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          label="Подтвердите пароль"
          required
          disabled={loading}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? 'Загрузка...' : 'Зарегистрироваться'}
        </Button>
      </Box>

      <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
        Уже есть аккаунт?{' '}
        <Button size="small" onClick={() => navigate('/login')}>
          Войти
        </Button>
      </Typography>
    </Box>
  )
}

export default Register
