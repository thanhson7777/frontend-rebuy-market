import { useLocation, Navigate } from 'react-router-dom'
import { Box, Grid, Paper, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Login from './Login'
import Register from './Register'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

import StorefrontIcon from '@mui/icons-material/Storefront'

function Auth() {
  const location = useLocation()
  const theme = useTheme()

  const isLogin = location.pathname === '/login'
  const isRegister = location.pathname === '/register'

  const currentUser = useSelector(selectCurrentUser)

  if (currentUser) {
    if (currentUser.role === 'admin') {
      return <Navigate to='/admin' replace={true} />
    }
    return <Navigate to='/' replace={true} />
  }

  return (
    <Grid container component="main" sx={{ height: '100vh', overflow: 'hidden' }}>

      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=1920&auto=format&fit=crop)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
        <Box
          sx={{
            position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
            backgroundColor: 'rgba(25, 118, 210, 0.75)',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center',
            color: 'white', p: { xs: 2, md: 6 }, textAlign: 'center'
          }}
        >
          <StorefrontIcon sx={{ fontSize: 80, mb: 2, color: theme.palette.warning.main }} />
          <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            SECOND-HAND STORE
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 500, lineHeight: 1.6 }}>
            Nền tảng mua bán đồ cũ uy tín, minh bạch tình trạng, bảo hành dài hạn. Mang lại giá trị mới cho những món đồ đã qua sử dụng.
          </Typography>
        </Box>
      </Grid>

      <Grid
        item
        xs={12} sm={8} md={5}
        component={Paper}
        elevation={6}
        square
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default'
        }}
      >
        <Box
          sx={{
            my: 8, mx: 4,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center',
            width: '100%', maxWidth: 420
          }}
        >
          {isLogin && <Login />}
          {isRegister && <Register />}
        </Box>
      </Grid>

    </Grid>
  )
}

export default Auth