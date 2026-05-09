import { AppBar, Typography } from '@mui/material'
import Toolbar from '@mui/material/Toolbar'

function Header() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        borderBottom: '2px solid #20419c',
        backgroundColor: '#c0cff6',
        px: { xs: 2, sm: 3, md: 5 },
        py: 3.75,
      }}
    >
      <Toolbar>
        <Typography variant="h4" component="div" sx={{ color: '#20419c' }}>
          Задания
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
export default Header
