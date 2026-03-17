import React, { useMemo, useState } from 'react'
import {
  Box, Container, Typography, Grid, TextField,
  Button, Stack, Paper, Divider, Chip
} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { toast } from 'react-toastify'
import { createContactAPI } from '~/apis'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^0\d{9,10}$/

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

function ContactPage() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const nextErrors = {}
    if (!formData.fullname.trim()) nextErrors.fullname = 'Vui lòng nhập họ và tên'
    if (!formData.email.trim() || !EMAIL_PATTERN.test(formData.email.trim())) {
      nextErrors.email = 'Email không hợp lệ'
    }
    if (!formData.phone.trim() || !PHONE_PATTERN.test(formData.phone.trim())) {
      nextErrors.phone = 'Số điện thoại không hợp lệ'
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      nextErrors.message = 'Nội dung tối thiểu 10 ký tự'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    try {
      setIsSubmitting(true)
      await createContactAPI(formData)
      toast.success('Đã gửi liên hệ thành công!')
      setFormData({ fullname: '', email: '', phone: '', message: '' })
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Không thể gửi liên hệ lúc này')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box sx={{ bgcolor: '#f8fafc', py: { xs: 5, md: 8 }, position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', bgcolor: 'rgba(25, 118, 210, 0.08)', top: -80, left: -120, filter: 'blur(40px)' }} />
      <Box sx={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', bgcolor: 'rgba(25, 118, 210, 0.08)', bottom: -90, right: -60, filter: 'blur(40px)' }} />

      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              <Chip label="Liên hệ" sx={{ width: 'fit-content', bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }} />
              <Typography variant="h3" fontWeight={900} color="#0f172a">Liên hệ với Rebuy Market</Typography>
              <Typography color="text.secondary" fontSize={16}>Bạn cần hỗ trợ về đơn hàng hay có thắc mắc về sản phẩm đồ cũ? Đừng ngần ngại gửi tin nhắn cho chúng tôi.</Typography>

              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                <Stack spacing={2.5}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <LocationOnIcon color="primary" />
                    <Typography fontWeight={600}>99 Ninh Kiều, Cần Thơ</Typography>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <PhoneIcon color="primary" />
                    <Typography fontWeight={600}>036.379.8364</Typography>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <EmailIcon color="primary" />
                    <Typography fontWeight={600}>support@rebuymarket.vn</Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Stack>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper component="form" onSubmit={handleSubmit} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, bgcolor: 'white', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <Stack spacing={3}>
                <Typography variant="h5" fontWeight={800} color="primary.main">Gửi tin nhắn cho chúng tôi</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Họ và tên" name="fullname" value={formData.fullname} onChange={handleChange} error={!!errors.fullname} helperText={errors.fullname} sx={fieldSx} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} sx={fieldSx} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} error={!!errors.phone} helperText={errors.phone} sx={fieldSx} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth multiline rows={4} label="Nội dung lời nhắn" name="message" value={formData.message} onChange={handleChange} error={!!errors.message} helperText={errors.message} sx={fieldSx} />
                  </Grid>
                </Grid>

                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    sx={{ py: 1.5, borderRadius: 2, fontWeight: 'bold', textTransform: 'none', fontSize: '1rem' }}
                  >
                    {isSubmitting ? 'Đang gửi thông tin...' : 'Gửi liên hệ ngay'}
                  </Button>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default ContactPage