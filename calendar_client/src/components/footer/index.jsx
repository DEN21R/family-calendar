import { Box, Typography } from '@mui/material'

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid rgba(32, 65, 156, 0.16)',
        py: 2,
        px: 3,
        textAlign: 'center',
        backgroundColor: '#f7f9ff',
      }}
    >
      <Typography variant="body2" sx={{ color: '#20419c' }}>
        Family Calendar
      </Typography>
    </Box>
  )
}

export default Footer
