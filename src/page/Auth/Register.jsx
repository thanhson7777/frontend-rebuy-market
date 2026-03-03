import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box, Button, Avatar, Typography, TextField, Zoom, InputAdornment, Divider, Grid
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EmailIcon from '@mui/icons-material/Email'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PersonIcon from '@mui/icons-material/Person'
import PhoneIcon from '@mui/icons-material/Phone'
import IconButton from '@mui/material/IconButton'

import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { registerUserAPI } from '~/apis'

import {
  FIELD_REQUIRED_MESSAGE,
  EMAIL_RULE, EMAIL_RULE_MESSAGE,
  PASSWORD_RULE, PASSWORD_RULE_MESSAGE,
  PASSWORD_CONFIRMATION_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/FieldErrorAlert/FieldErrorAlert'

const PHONE_RULE = /^(0[3|5|7|8|9])+([0-9]{8})\b/
const PHONE_RULE_MESSAGE = 'Số điện thoại không hợp lệ (gồm 10 số)'

function Register() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm()
  const navigate = useNavigate()
  const theme = useTheme()

  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  const submitRegister = (data) => {
    const { email, password, fullName, phone } = data

    toast.promise(
      registerUserAPI({ email, password, fullName, phone }),
      { pending: 'Đang xử lý đăng ký...' }
    ).then(() => {
      navigate(`/login?registeredEmail=${data.email}`)
    }).catch((error) => {
      console.log('Đăng ký thất bại:', error)
      toast.error('Email hoặc Số điện thoại đã tồn tại!')
    })
  }

  return (
    <Zoom in={true} style={{ transitionDelay: '100ms' }}>
      <Box sx={{ width: '100%' }}>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56, boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)' }}>
            <AppRegistrationIcon fontSize="medium" />
          </Avatar>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: 0.5, mt: 1 }}>
            TẠO TÀI KHOẢN
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Tham gia cộng đồng mua bán đồ cũ uy tín
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit(submitRegister)} noValidate>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth autoFocus label="Họ và tên" placeholder="Nguyễn Văn A"
                variant="outlined" color="primary" size="small"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><PersonIcon color="primary" sx={{ mr: 0.5 }} /></InputAdornment>
                }}
                {...register('fullName', {
                  required: FIELD_REQUIRED_MESSAGE,
                  minLength: { value: 3, message: 'Tên phải có ít nhất 3 ký tự' }
                })}
                error={!!errors.fullName}
              />
              <FieldErrorAlert errors={errors} fieldName={'fullName'} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Số điện thoại" placeholder="0901234567"
                variant="outlined" color="primary" size="small"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><PhoneIcon color="primary" sx={{ mr: 0.5 }} /></InputAdornment>
                }}
                {...register('phone', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: { value: PHONE_RULE, message: PHONE_RULE_MESSAGE }
                })}
                error={!!errors.phone}
              />
              <FieldErrorAlert errors={errors} fieldName={'phone'} />
            </Grid>
          </Grid>
          <TextField
            fullWidth label="Email" placeholder="your.email@example.com"
            variant="outlined" margin="normal" color="primary" size="small"
            InputProps={{
              startAdornment: <InputAdornment position="start"><EmailIcon color="primary" sx={{ mr: 0.5 }} /></InputAdornment>
            }}
            {...register('email', {
              required: FIELD_REQUIRED_MESSAGE,
              pattern: { value: EMAIL_RULE, message: EMAIL_RULE_MESSAGE }
            })}
            error={!!errors.email}
          />
          <FieldErrorAlert errors={errors} fieldName={'email'} />
          <TextField
            fullWidth label="Mật khẩu" placeholder="••••••••"
            type={showPassword ? 'text' : 'password'}
            variant="outlined" margin="normal" color="primary" size="small"
            InputProps={{
              startAdornment: <InputAdornment position="start"><LockOutlinedIcon color="primary" sx={{ mr: 0.5 }} /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" color="primary">
                    {showPassword ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
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
          <TextField
            fullWidth label="Xác nhận mật khẩu" placeholder="••••••••"
            type={showPasswordConfirm ? 'text' : 'password'}
            variant="outlined" margin="normal" color="primary" size="small"
            InputProps={{
              startAdornment: <InputAdornment position="start"><LockOutlinedIcon color="primary" sx={{ mr: 0.5 }} /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} edge="end" color="primary">
                    {showPasswordConfirm ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            {...register('password_confirmation', {
              required: FIELD_REQUIRED_MESSAGE,
              validate: (value) => value === watch('password') || PASSWORD_CONFIRMATION_MESSAGE
            })}
            error={!!errors.password_confirmation}
          />
          <FieldErrorAlert errors={errors} fieldName={'password_confirmation'} />
          <Button
            type="submit" fullWidth variant="contained" color="primary" size="large" disabled={isSubmitting}
            sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold', fontSize: '1rem', borderRadius: 2, boxShadow: '0 4px 12px rgba(25, 118, 210, 0.25)' }}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Đăng Ký Tài Khoản'}
          </Button>
          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">Đã có tài khoản?</Typography>
          </Divider>

          <Button
            component={Link} to="/login" fullWidth variant="outlined" color="primary"
            startIcon={<ArrowBackIcon />}
            sx={{ py: 1.2, fontWeight: 'bold', borderRadius: 2 }}
          >
            Quay lại Đăng nhập
          </Button>

        </Box>
      </Box>
    </Zoom>
  )
}

export default Register