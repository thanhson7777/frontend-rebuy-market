import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { cyan, orange } from '@mui/material/colors'

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
        primary: { main: '#1976D2' },
        secondary: { main: '#3498db' },
        background: {
          default: '#F4F6F8',
          paper: '#FFFFFF'
        },
        success: { main: '#2E7D32' },
        error: { main: '#D32F2F' }
      }
    },
    dark: {
      palette: {
        primary: { main: cyan[400] },
        secondary: { main: orange[400] },
        background: {
          default: '#121212',
          paper: '#1E1E1E'
        }
      }
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 }
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
            '0%': { boxShadow: '0 8px 20px rgba(255, 165, 0, 0.4)' },
            '50%': { boxShadow: '0 8px 30px rgba(255, 165, 0, 0.6)' },
            '100%': { boxShadow: '0 8px 20px rgba(255, 165, 0, 0.4)' }
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderWidth: '1px',
          borderRadius: '8px',
          fontWeight: 600,
          '&:hover': { borderWidth: '1px' }
        },
        containedSecondary: {
          boxShadow: '0 4px 6px rgba(255, 109, 0, 0.2)',
          '&:hover': {
            boxShadow: '0 6px 12px rgba(255, 109, 0, 0.3)',
            transform: 'translateY(-1px)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.12)'
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--mui-palette-background-paper)',
          color: 'var(--mui-palette-text-primary)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          color: 'var(--mui-palette-secondary-main)',
          fontWeight: 500,
          top: '2px'
        },
        shrink: {
          top: 0,
          background: 'var(--mui-palette-background-paper)',
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
          borderRadius: '8px',
          '& fieldset': { borderWidth: '1.5px !important' },
          '&:hover fieldset': { borderWidth: '1.75px !important' },
          '&.Mui-focused fieldset': { borderWidth: '1.75px !important' }
        }
      }
    }
  }
})

export default theme