import React, { useState } from 'react'
import { Box, Button, TextField, Typography, InputAdornment, IconButton, Stack, Paper } from '@mui/material'
import { useDispatch } from 'react-redux'
import { updateUserAPI, logoutUserAPI } from '~/redux/user/userSlice'
import { useForm } from 'react-hook-form'
import FieldErrorAlert from '~/components/FieldErrorAlert/FieldErrorAlert'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'
import { useNavigate } from 'react-router-dom'

import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import LockIcon from '@mui/icons-material/Lock'
import SecurityIcon from '@mui/icons-material/Security'

function SettingsTab() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const confirmPasswordChange = useConfirm()
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm()

  const handleClickShowPassword = () => setShowPassword(!showPassword)

  const onSubmit = (data) => {
    const payload = {
      current_password: data.current_password,
      new_password: data.new_password
    }

    confirmPasswordChange({
      title: 'Xác nhận thay đổi mật khẩu?',
      description: 'Hệ thống sẽ đăng xuất bạn ra khỏi tất cả các thiết bị sau khi đổi mật khẩu thành công để bảo mật thông tin.',
      confirmationText: 'Đồng ý thay đổi',
      cancellationText: 'Hủy bỏ',
      confirmationButtonProps: { color: 'primary', variant: 'contained' }
    }).then(() => {
      dispatch(updateUserAPI(payload)).then((res) => {
        if (!res.error) {
          toast.success('Thay đổi mật khẩu thành công! Hãy đăng nhập lại.')
          reset()
          dispatch(logoutUserAPI(false))
          navigate('/login')
        } else {
          toast.error(res.payload?.message || 'Mật khẩu hiện tại không chính xác')
        }
      })
    }).catch(() => { })
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 500, mx: 'auto' }}>
      <Stack spacing={1} mb={4} textAlign="center">
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
          <SecurityIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.8 }} />
        </Box>
        <Typography variant="h6" fontWeight="800">Cài đặt bảo mật</Typography>
        <Typography variant="body2" color="text.secondary">
          Bạn nên sử dụng mật khẩu mạnh bao gồm chữ cái, số và ký tự đặc biệt.
        </Typography>
      </Stack>

      <Stack spacing={3}>
        <Box>
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="Mật khẩu hiện tại"
            {...register('current_password', { required: 'Vui lòng nhập mật khẩu cũ' })}
            error={!!errors.current_password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon fontSize="small" color="disabled" />
                </InputAdornment>
              ),
            }}
          />
          <FieldErrorAlert errors={errors} fieldName="current_password" />
        </Box>

        <Box>
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="Mật khẩu mới"
            {...register('new_password', {
              required: 'Vui lòng nhập mật khẩu mới',
              minLength: { value: 6, message: 'Mật khẩu phải từ 6 ký tự trở lên' }
            })}
            error={!!errors.new_password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FieldErrorAlert errors={errors} fieldName="new_password" />
        </Box>

        <Box>
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="Xác nhận mật khẩu mới"
            {...register('confirm_password', {
              required: 'Vui lòng nhập lại mật khẩu mới',
              validate: (value) => value === watch('new_password') || 'Mật khẩu xác nhận không khớp'
            })}
            error={!!errors.confirm_password}
          />
          <FieldErrorAlert errors={errors} fieldName="confirm_password" />
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{
            py: 1.5,
            fontWeight: 'bold',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
            textTransform: 'none'
          }}
        >
          Cập nhật mật khẩu mới
        </Button>
      </Stack>
    </Box>
  )
}

export default SettingsTab