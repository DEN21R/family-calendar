import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setError, setLoading, setUser } from '../../features/auth/authSlice'
import authService from '../../services/authService'
import { Box, Button, Typography, TextField, Alert } from '@mui/material'
import logo from '../../assets/logo.png'

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
      navigate('/calendar')
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Ошибка входа'))
    }
  }

  return (
    <Box>
      <Box
        component="img"
        src={logo}
        alt="Company logo"
        sx={{
          height: 100,
          mb: 4,
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      />
      <Typography variant="TitleAuth">Вход в аккаунт</Typography>

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
          sx={{ mt: 2, backgroundColor: '#0051f9' }}
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
