import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#0051f9',
    },
    secondary: {
      main: '#267dfb',
    },
    title: {
      main: '#20419c',
    },
    logo: {
      main: '#24223c',
    },
  },
  typography: {
    fontFamily: 'Montserrat',
  },
  components: {
    MuiTypography: {
      variants: [
        {
          props: { variant: 'footerDescription' },
          style: {
            fontSize: '0.875rem',
            fontWeight: 400,
            color: '#24223c',
            opacity: 0.8,
          },
        },
        {
          props: { variant: 'footerTitle' },
          style: {
            fontSize: '1.25rem',
            fontWeight: 500,
            color: '#24223c',
            paddingBottom: '16px',
          },
        },
      ],
    },
  },
})

export default theme
