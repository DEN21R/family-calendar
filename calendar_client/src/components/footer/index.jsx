import { Box, Typography, Paper } from '@mui/material'
import XIcon from '@mui/icons-material/X'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import { styled } from '@mui/material/styles'
import logoAl from '../../assets/logoAl.png'

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  backgroundColor: '#ccd6f180',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(0.5),
  boxShadow: 'none',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
    alignItems: 'center',
  },
}))

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid rgba(32, 65, 156, 0.16)',
        py: 3,
        // background: 'linear-gradient(135deg, #a78bfa, #7c3aed) !important',
        background: '#ffffff',
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: 'repeat(4, 1fr)',
          },
          gap: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        <Item>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              justifyContent: { xs: 'flex-start', sm: 'center' },
              width: '100%',
            }}
          >
            <Box
              component="img"
              src={logoAl}
              alt="Company logo"
              sx={{
                cursor: 'pointer',
                height: { xs: 34, sm: 40 },
                pb: { xs: 1, sm: 2 },
              }}
            />
            <Typography color="logo" variant="footerTitle">
              Family Calendar
            </Typography>
          </Box>

          <Typography
            color="logo"
            variant="footerDescription"
            sx={{
              maxWidth: 240,
              textAlign: { xs: 'left', sm: 'center' },
            }}
          >
            {' '}
            Планируйте важное Проводите больше времени с семьей
          </Typography>
        </Item>
        <Item>
          <Typography variant="footerTitle">Навигация</Typography>
          <Typography variant="footerDescription">Kалендарь</Typography>
          <Typography variant="footerDescription">Заметки</Typography>
          <Typography variant="footerDescription">Семья</Typography>
          <Typography variant="footerDescription">Настройки</Typography>
        </Item>
        <Item>
          <Typography variant="footerTitle">Поддержка</Typography>
          <Typography variant="footerDescription">Помощь</Typography>
          <Typography variant="footerDescription">
            Политика конфиденциальности
          </Typography>
          <Typography variant="footerDescription">
            Условия использования
          </Typography>
        </Item>
        <Item>
          <Typography variant="footerTitle">Мы в соцсетях</Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: { xs: 'flex-start', sm: 'center' },
              gap: 2,
              mt: 1,
              width: '100%',
            }}
          >
            <a href="https://x.com" target="_blank" rel="noopener noreferrer">
              <XIcon
                color="secondary"
                sx={{
                  fontSize: { xs: 28, sm: 32 },
                  transition: '0.2s',
                  '&:hover': { opacity: 0.6 },
                }}
              />
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon
                color="secondary"
                sx={{
                  fontSize: { xs: 28, sm: 32 },
                  transition: '0.2s',
                  '&:hover': { opacity: 0.6 },
                }}
              />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon
                color="secondary"
                sx={{
                  fontSize: { xs: 28, sm: 32 },
                  transition: '0.2s',
                  '&:hover': { opacity: 0.6 },
                }}
              />
            </a>
          </Box>
        </Item>
      </Box>
      <Box
        sx={{
          py: 2,
          pt: { xs: 2.5, sm: 4 },
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
