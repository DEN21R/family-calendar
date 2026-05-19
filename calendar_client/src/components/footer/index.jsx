import { Box, Typography } from '@mui/material'
import XIcon from '@mui/icons-material/X'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid rgba(32, 65, 156, 0.16)',
        py: 2,
        background: 'linear-gradient(135deg, #a78bfa, #7c3aed) !important',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 3,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ textAlign: 'center' }}>
            Family Calendar
          </Typography>
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              width: '100%',
              maxWidth: 240,
              mx: 'auto',
              mt: 1,
            }}
          >
            {' '}
            Планируйте важное Проводите больше времени с семьей
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ textAlign: 'center' }}>
            Навигация
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Kалендарь
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Заметки
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Семья
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Настройки
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ textAlign: 'center' }}>
            Поддержка
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Помощь
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Политика конфиденциальности
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Условия использования
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ textAlign: 'center' }}>
            Мы в соцсетях
          </Typography>
          <Box
            sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}
          >
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit' }}
            >
              <XIcon
                sx={{
                  fontSize: 32,
                  transition: '0.2s',
                  '&:hover': { opacity: 0.6 },
                }}
              />
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit' }}
            >
              <FacebookIcon
                sx={{
                  fontSize: 32,
                  transition: '0.2s',
                  '&:hover': { opacity: 0.6 },
                }}
              />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit' }}
            >
              <InstagramIcon
                sx={{
                  fontSize: 32,
                  transition: '0.2s',
                  '&:hover': { opacity: 0.6 },
                }}
              />
            </a>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: '100%',
          maxWidth: 1440,
          mx: 'auto',
          px: 10,
          py: 2,
          pt: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" sx={{ color: '#20419c' }}>
          © 2026 Family Calendar. Все права защищены.
        </Typography>
      </Box>
    </Box>
  )
}

export default Footer
