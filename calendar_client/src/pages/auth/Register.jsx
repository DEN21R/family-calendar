import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { setError, setLoading, setUser } from '../../features/auth/authSlice'
import authService from '../../services/authService'
import { Box, Button, Typography, TextField } from '@mui/material'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const { name, email, password, confirmPassword } = formData
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

    if (password !== confirmPassword) {
      dispatch(setError('Passwords do not match'))
      return
    }

    dispatch(setLoading())

    try {
      const data = await authService.register(name, email, password)
      dispatch(setUser(data))
      navigate('/calendar')
    } catch (requestError) {
      dispatch(
        setError(requestError.response?.data?.error || 'Register failed'),
      )
    }
  }

  return (
    <Box>
      <Typography variant="h3" sx={{ color: 'blue' }}>
        Register
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
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          placeholder="name"
          required
        />
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
        <TextField
          variant="outlined"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          required
        />

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Loading...' : 'Register'}
        </Button>
      </Box>
      {error && <p>{error}</p>}
      <Typography variant="h5" sx={{ color: 'blue' }}>
        Already have an account? <Link to="/login">Login</Link>
      </Typography>
    </Box>
  )
}

export default Register
