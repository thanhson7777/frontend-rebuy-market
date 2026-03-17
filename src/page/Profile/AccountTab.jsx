import React, { useState, useEffect } from 'react'
import { Box, Button, TextField, Avatar, Grid, Typography, Badge, IconButton, Stack, Paper, Divider } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, updateUserAPI } from '~/redux/user/userSlice'
import { useForm } from 'react-hook-form'
import FieldErrorAlert from '~/components/FieldErrorAlert/FieldErrorAlert'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import InfoIcon from '@mui/icons-material/Info'
import { toast } from 'react-toastify'

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

function AccountTab() {
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar)
  const [selectedFile, setSelectedFile] = useState(null)

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      email: currentUser?.email || '',
      username: currentUser?.username || '',
      displayName: currentUser?.displayName || '',
      fullName: currentUser?.fullName || '',
      phone: currentUser?.phone || '',
      address: currentUser?.address || ''
    }
  })

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview)
      }
      setAvatarPreview(URL.createObjectURL(file))
      setSelectedFile(file)
    }
  }

  const onSubmit = (data) => {
    const formData = new FormData()
    // formData.append('displayName', data.displayName)
    formData.append('fullName', data.fullName)
    formData.append('phone', data.phone)
    formData.append('address', data.address)
    if (selectedFile) {
      formData.append('avatar', selectedFile)
    }

    dispatch(updateUserAPI(formData)).then((res) => {
      if (!res.error) {
        toast.success('Cập nhật hồ sơ thành công! ✨')
        setSelectedFile(null)
      }
    })
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4, mb: 5 }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={avatarPreview || ''}
            sx={{
              width: 120,
              height: 120,
              border: '4px solid white',
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
            }}
          />
          <IconButton
            color="primary"
            component="label"
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              bgcolor: 'white',
              boxShadow: 2,
              '&:hover': { bgcolor: '#f1f5f9' }
            }}
          >
            <PhotoCamera />
            <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
          </IconButton>
        </Box>
        <Box>
          <Typography variant="h6" fontWeight="800" color="primary.main">
            {currentUser?.displayName || currentUser?.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cập nhật ảnh đại diện và thông tin cá nhân của bạn tại đây.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            {...register('email')}
            disabled
            sx={{
              '& .MuiInputBase-root': { bgcolor: '#f8fafc' },
              '& .Mui-disabled': { WebkitTextFillColor: '#64748b' },
              ...fieldSx
            }}
            InputProps={{ startAdornment: <InfoIcon fontSize="small" sx={{ mr: 1, color: '#94a3b8' }} /> }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Tên hiển thị"
            {...register('displayName')}
            disabled
            sx={{
              '& .MuiInputBase-root': { bgcolor: '#f8fafc' },
              '& .Mui-disabled': { WebkitTextFillColor: '#64748b' },
              ...fieldSx
            }}
            InputProps={{ startAdornment: <InfoIcon fontSize="small" sx={{ mr: 1, color: '#94a3b8' }} /> }}
          />
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            Tên đầy đủ <Box component="span" sx={{ color: 'error.main' }}>*</Box>
          </Typography>
          <TextField
            fullWidth
            placeholder="Nhập họ và tên đầy đủ"
            sx={{ ...fieldSx }}
            {...register('fullName', {
              required: 'Vui lòng không bỏ trống họ tên',
              minLength: { value: 3, message: 'Họ tên phải có ít nhất 3 ký tự' }
            })}
            error={!!errors.fullName}
            color="primary"
          />
          <FieldErrorAlert errors={errors} fieldName="fullName" />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            Số điện thoại <Box component="span" sx={{ color: 'error.main' }}>*</Box>
          </Typography>
          <TextField
            fullWidth
            placeholder="Nhập số điện thoại"
            sx={{ ...fieldSx }}
            {...register('phone', {
              required: 'Vui lòng không bỏ trống số điện thoại'
            })}
            error={!!errors.phone}
            color="primary"
          />
          <FieldErrorAlert errors={errors} fieldName="phone" />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            Địa chỉ <Box component="span" sx={{ color: 'error.main' }}>*</Box>
          </Typography>
          <TextField
            fullWidth
            placeholder="Nhập địa chỉ"
            sx={{ ...fieldSx }}
            {...register('address', {
              required: 'Vui lòng không bỏ trống địa chỉ'
            })}
            error={!!errors.address}
            color="primary"
          />
          <FieldErrorAlert errors={errors} fieldName="address" />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={!isDirty && !selectedFile}
          sx={{
            px: 6,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 'bold',
            textTransform: 'none',
            boxShadow: '0 8px 16px rgba(25, 118, 210, 0.2)'
          }}
        >
          Lưu thay đổi hồ sơ
        </Button>
      </Box>
    </Box>
  )
}

export default AccountTab