import React, { useState } from 'react'
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import {
  Box, Button, Avatar, Typography, TextField, Zoom, Alert, Fade, InputAdornment, Divider
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import IconButton from '@mui/material/IconButton'
import EmailIcon from '@mui/icons-material/Email'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import {
  FIELD_REQUIRED_MESSAGE,
  EMAIL_RULE, EMAIL_RULE_MESSAGE,
  PASSWORD_RULE, PASSWORD_RULE_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/FieldErrorAlert/FieldErrorAlert'
import { loginUserAPI } from '~/redux/user/userSlice'

const fieldSx = {
  bgcolor: 'transparent',
  '& .MuiOutlinedInput-root': {
    bgcolor: 'transparent',
    '& fieldset': { borderColor: 'rgba(25, 118, 210, 0.3)' },
    '&:hover fieldset': { borderColor: 'rgba(25, 118, 210, 0.5)' },
    '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1px' }
  },
  '& .MuiInputLabel-root': { bgcolor: 'transparent' }
}

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useTheme()
  const location = useLocation()

  const [showPassword, setShowPassword] = useState(false)
  const from = location.state?.from || '/'

  let [searchParams] = useSearchParams()
  const registeredEmail = searchParams.get('registeredEmail')
  const verifiedEmail = searchParams.get('verifiedEmail')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  const submitLogIn = (data) => {
    const { email, password } = data

    toast.promise(
      dispatch(loginUserAPI({ email, password })).unwrap(),
      { pending: 'Đang đăng nhập...' }
    ).then((res) => {
      const userRole = res?.role || res?.data?.users?.[0]?.role

      if (userRole === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate(from, { replace: true })
      }
    }).catch((error) => {
      console.log('Đăng nhập thất bại:', error)
      toast.error('Tài khoản hoặc mật khẩu không chính xác!')
    })
  }

  return (
    <Zoom in={true} style={{ transitionDelay: '100ms' }}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56, boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)' }}>
            <LockOutlinedIcon fontSize="medium" />
          </Avatar>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: 0.5, mt: 1 }}>
            ĐĂNG NHẬP
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Chào mừng bạn quay lại hệ thống
          </Typography>
        </Box>
        <Fade in={!!registeredEmail} timeout={500}>
          <Box>
            {registeredEmail && (
              <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
                Đăng ký thành công. Vui lòng check email: <b>{registeredEmail}</b>
              </Alert>
            )}
          </Box>
        </Fade>
        <Fade in={!!verifiedEmail} timeout={500}>
          <Box>
            {verifiedEmail && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                Xác thực email thành công. Vui lòng đăng nhập!
              </Alert>
            )}
          </Box>
        </Fade>

        <Box component="form" onSubmit={handleSubmit(submitLogIn)} noValidate>
          <TextField
            fullWidth
            autoFocus
            label="Email"
            placeholder="your.email@example.com"
            variant="outlined"
            margin="normal"
            color="primary"
            sx={fieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="primary" sx={{ mr: 0.5 }} />
                </InputAdornment>
              )
            }}
            {...register('email', {
              required: FIELD_REQUIRED_MESSAGE,
              pattern: { value: EMAIL_RULE, message: EMAIL_RULE_MESSAGE }
            })}
            error={!!errors.email}
          />
          <FieldErrorAlert errors={errors} fieldName={'email'} />

          <TextField
            fullWidth
            label="Mật khẩu"
            placeholder="••••••••"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            color="primary"
            sx={fieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon color="primary" sx={{ mr: 0.5 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" color="primary">
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            {...register('password', {
              required: FIELD_REQUIRED_MESSAGE,
              pattern: { value: PASSWORD_RULE, message: PASSWORD_RULE_MESSAGE }
            })}
            error={!!errors.password}
          />
          <FieldErrorAlert errors={errors} fieldName={'password'} />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={isSubmitting}
            sx={{ mt: 3, mb: 3, py: 1.5, fontWeight: 'bold', fontSize: '1rem', borderRadius: 2, boxShadow: '0 4px 12px rgba(25, 118, 210, 0.25)' }}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Đăng Nhập'}
          </Button>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">Chưa có tài khoản?</Typography>
          </Divider>

          <Button
            component={Link}
            to="/register"
            fullWidth
            variant="outlined"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            sx={{ py: 1.2, fontWeight: 'bold', borderRadius: 2 }}
          >
            Đăng ký tài khoản mới
          </Button>

        </Box>
      </Box>
    </Zoom>
  )
}

export default Login