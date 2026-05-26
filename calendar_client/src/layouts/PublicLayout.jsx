import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Header from '../components/header'
import Footer from '../components/footer'

function PublicLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flex: 1,
          py: { xs: 3, md: 5 },
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
}

export default PublicLayout
