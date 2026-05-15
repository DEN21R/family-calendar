import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Header from '../components/header'
import Footer from '../components/footer'

function MainLayout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box
        component="main"
        sx={{ flex: 1, px: { xs: 2, sm: 3, md: 4 }, py: 3 }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
}

export default MainLayout
