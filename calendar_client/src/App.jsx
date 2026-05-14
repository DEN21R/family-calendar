import './App.css'
import { Calendar } from './pages/calendar'
import Header from './components/header'
import { Box } from '@mui/material'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/auth/Login'

function App() {
  return (
    <Box>
      <Header />
      <Routes>
        <Route path="/dashboard" element={<Login />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </Box>
  )
}

export default App
