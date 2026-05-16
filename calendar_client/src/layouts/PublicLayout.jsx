import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Footer from '../components/footer'

function PublicLayout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
          maxWidth: 1440,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
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
