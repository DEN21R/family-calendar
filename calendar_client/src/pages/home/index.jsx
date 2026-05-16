import { Box, Button, Typography } from '@mui/material'
import logo from '../../assets/logo.png'
import { useNavigate } from 'react-router-dom'
import familyFoto from '../../assets/familyFoto.png'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import NotesIcon from '@mui/icons-material/Notes'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import GroupIcon from '@mui/icons-material/Group'

function Home() {
  const navigate = useNavigate()

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 4, md: 6 } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          component="img"
          src={logo}
          alt="Company logo"
          sx={{ cursor: 'pointer', height: 54 }}
        />
        <Typography variant="h4" sx={{ color: '#20419c' }}>
          Family Calendar
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
          gap: { xs: 4, md: 6 },
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h3" sx={{ lineHeight: 1.1 }}>
            Планируйте семейные дела вместе
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, maxWidth: 620 }}>
            Family Calendar помогает вашей семье быть организованной, не
            забывать важные события и проводить больше времени вместе.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 3 }}>
            <Button
              variant="outlined"
              sx={{ color: '#000' }}
              onClick={() => navigate('/login')}
            >
              Войти в календарь
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#438cf8' }}
              onClick={() => navigate('/register')}
            >
              Зарегистрироваться
            </Button>
          </Box>
        </Box>

        <Box
          component="img"
          src={familyFoto}
          alt="Family photo"
          sx={{
            width: '100%',
            maxWidth: 680,
            justifySelf: 'end',
            objectFit: 'contain',
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 3,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CalendarMonthIcon sx={{ fontSize: 40, color: '#438cf8' }} />
          <Typography variant="h6">Общий календарь</Typography>
          <Typography variant="body2">Делитесь событиями и планами</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <NotesIcon sx={{ fontSize: 40, color: '#438cf8' }} />
          <Typography variant="h6">Заметки и списки</Typography>
          <Typography variant="body2">
            Создавайте заметки и чек-листы
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <NotificationsActiveIcon sx={{ fontSize: 40, color: '#438cf8' }} />
          <Typography variant="h6">Напоминания</Typography>
          <Typography variant="body2">Не пропускайте важные дела</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <GroupIcon sx={{ fontSize: 40, color: '#438cf8' }} />
          <Typography variant="h6">Доступ для всех</Typography>
          <Typography variant="body2">У каждого свой доступ</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Home
