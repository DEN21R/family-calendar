import { Box, Button, Typography } from '@mui/material'
import familyCalendar from '../../assets/familyCalendar.png'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <Box>
      <Box
        component="img"
        src={familyCalendar}
        alt="Company logo"
        sx={{ cursor: 'pointer', height: 50, ml: 2 }}
      />
      <Typography variant="h4" sx={{ color: '#20419c', mb: 1 }}>
        Family Calendar
      </Typography>
      <Typography variant="h3">Планируйте семейные дела BMесте</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Family Calendar помогает вашей семье быть организованной, не забывать
        важные события и проводить больше времени вместе.
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 3 }}
        onClick={() => navigate('/login')}
      >
        Войти в календарь
      </Button>
      <Button
        variant="outlined"
        sx={{ mt: 2 }}
        onClick={() => navigate('/register')}
      >
        Зарегистрироваться
      </Button>
    </Box>
  )
}

export default Home
