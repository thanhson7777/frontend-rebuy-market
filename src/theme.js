import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { cyan, deepOrange, orange, teal, red } from '@mui/material/colors'

const APP_BAR_HEIGHT = '64px'
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT})`

const theme = extendTheme({
  storeCustomVars: {
    appBarHeight: APP_BAR_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT
  },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#f19066' },
        secondary: { main: '#e77f67' }
      }
    },
    dark: {
      palette: {
        primary: { main: cyan[400] },
        secondary: { main: orange[400] }
      }
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#dcdde1',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#a4b0be'
          },
          '@keyframes pulse': {
            '0%': {
              boxShadow: '0 8px 20px rgba(255, 165, 0, 0.4)'
            },
            '50%': {
              boxShadow: '0 8px 30px rgba(255, 165, 0, 0.6)'
            },
            '100%': {
              boxShadow: '0 8px 20px rgba(255, 165, 0, 0.4)'
            }
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderWidth: '1px',
          '&:hover': { borderWidth: '1px' }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          color: '#FFA500',
          fontWeight: 500,
          top: '2px'
        },
        shrink: {
          top: 0,
          background: '#fff',
          padding: '0 4px',
          marginLeft: '-4px'
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-body1': { fontSize: '0.875rem' }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          '& fieldset': { borderWidth: '1.5px !important' },
          '&:hover fieldset': { borderWidth: '1.75px !important' },
          '&.Mui-focused fieldset': { borderWidth: '1.75px !important' }
        }
      }
    }
  }
})

export default theme