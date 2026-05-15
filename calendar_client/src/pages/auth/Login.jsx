import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { setError, setLoading, setUser } from '../../features/auth/authSlice'
import authService from '../../services/authService'
import { Box, Button, Typography, TextField } from '@mui/material'

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const { email, password } = formData
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, token, error } = useSelector((state) => state.auth)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    if (token) {
      navigate('/calendar')
    }
  }, [token, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()

    dispatch(setLoading())

    try {
      const data = await authService.login(email, password)
      dispatch(setUser(data))
      navigate('/calendar')
    } catch (requestError) {
      dispatch(setError(requestError.response?.data?.error || 'Login failed'))
    }
  }

  return (
    <Box>
      <Typography variant="h3" sx={{ color: 'blue' }}>
        Login
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          backgroundColor: '#7897f3',
          display: 'flex',
          flexDirection: 'column',
          p: 3,
          mt: 2,
          gap: 4,
          maxWidth: 400,
        }}
      >
        <TextField
          variant="outlined"
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <TextField
          variant="outlined"
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </Button>
      </Box>
      {error && <p>{error}</p>}
      <Typography variant="h5" sx={{ color: 'blue' }}>
        No account yet? <Link to="/register">Register</Link>
      </Typography>
    </Box>
  )
}

export default Login
