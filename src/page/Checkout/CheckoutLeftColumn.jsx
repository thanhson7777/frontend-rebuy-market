import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import {
  Box, Typography, Grid, TextField, Paper, Divider,
  FormControl, InputLabel, Select, MenuItem, RadioGroup,
  FormControlLabel, Radio, Switch, Stack, Collapse
} from '@mui/material'

import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import ReceiptIcon from '@mui/icons-material/Receipt'
import PaymentIcon from '@mui/icons-material/Payment'
import logoMomo from '~/assets/momo-logo.png'
import logoVnpay from '~/assets/vnpay-logo.png'

import { selectCurrentUser } from '~/redux/user/userSlice'

function CheckoutLeftColumn({
  shippingInfo, setShippingInfo,
  paymentMethod, setPaymentMethod,
  requireVAT, setRequireVAT,
  vatInfo, setVatInfo
}) {
  const currentUser = useSelector(selectCurrentUser)

  // States lấy dữ liệu API Hành chính
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [loadingProvinces, setLoadingProvinces] = useState(false)
  const [loadingDistricts, setLoadingDistricts] = useState(false)

  // 1. Lấy danh sách Tỉnh/Thành phố khi Component Mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true)
      try {
        const res = await axios.get('https://provinces.open-api.vn/api/p/')
        setProvinces(res.data)
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu Tỉnh/Thành:', error)
      } finally {
        setLoadingProvinces(false)
      }
    }
    fetchProvinces()
  }, [])

  // 2. Điền sẵn thông tin User từ Redux
  useEffect(() => {
    if (currentUser) {
      setShippingInfo(prev => ({
        ...prev,
        fullname: prev.fullname || currentUser.displayName || '',
        phone: prev.phone || currentUser.phone || '',
      }))
    }
  }, [currentUser, setShippingInfo])

  // 3. Khi Tỉnh/Thành thay đổi -> Gọi API lấy Quận/Huyện
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!shippingInfo.province) {
        setDistricts([])
        return
      }

      setLoadingDistricts(true)
      try {
        const selectedProvinceObj = provinces.find(p => p.name === shippingInfo.province)
        if (selectedProvinceObj) {
          const res = await axios.get(`https://provinces.open-api.vn/api/p/${selectedProvinceObj.code}?depth=2`)
          setDistricts(res.data.districts)
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu Quận/Huyện:', error)
      } finally {
        setLoadingDistricts(false)
      }
    }

    if (provinces.length > 0) {
      fetchDistricts()
    }
  }, [shippingInfo.province, provinces])


  const handleShippingChange = (e) => {
    const { name, value } = e.target
    setShippingInfo(prev => ({ ...prev, [name]: value }))
    if (name === 'province') {
      setShippingInfo(prev => ({ ...prev, district: '' }))
    }
  }

  const handleVatChange = (e) => {
    const { name, value } = e.target
    setVatInfo(prev => ({ ...prev, [name]: value }))
  }

  return (
    <Box>
      {/* 1. KHỐI ĐỊA CHỈ GIAO HÀNG */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <LocalShippingIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold" color="#1e293b">Thông tin giao hàng</Typography>
        </Box>

        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Họ và tên người nhận *" name="fullname" value={shippingInfo.fullname} onChange={handleShippingChange} color="primary" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Số điện thoại *" name="phone" value={shippingInfo.phone} onChange={handleShippingChange} color="primary" />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth color="primary" disabled={loadingProvinces}>
              <InputLabel>{loadingProvinces ? 'Đang tải...' : 'Tỉnh / Thành phố *'}</InputLabel>
              <Select name="province" value={shippingInfo.province} label={loadingProvinces ? 'Đang tải...' : 'Tỉnh / Thành phố *'} onChange={handleShippingChange}>
                {provinces.map(p => <MenuItem key={p.code} value={p.name}>{p.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth color="primary" disabled={!shippingInfo.province || loadingDistricts}>
              <InputLabel>{loadingDistricts ? 'Đang tải...' : 'Quận / Huyện *'}</InputLabel>
              <Select name="district" value={shippingInfo.district} label={loadingDistricts ? 'Đang tải...' : 'Quận / Huyện *'} onChange={handleShippingChange}>
                {districts.map(d => <MenuItem key={d.code} value={d.name}>{d.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth label="Địa chỉ chi tiết (Số nhà, tên đường...) *" name="address" value={shippingInfo.address} onChange={handleShippingChange} color="primary" />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth label="Ghi chú đơn hàng (Tùy chọn)" name="note" value={shippingInfo.note} onChange={handleShippingChange} color="primary"
              multiline rows={2}
            />
          </Grid>
        </Grid>

        <Collapse in={requireVAT}>
          <Grid container spacing={2} sx={{ mt: 1, p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
            <Grid item xs={12} sm={8}>
              <TextField fullWidth size="small" label="Tên Công ty" name="companyName" value={vatInfo.companyName} onChange={handleVatChange} color="primary" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth size="small" label="MST" name="taxCode" value={vatInfo.taxCode} onChange={handleVatChange} color="primary" />
            </Grid>
          </Grid>
        </Collapse>
      </Paper>

      {/* 2. KHỐI PHƯƠNG THỨC THANH TOÁN */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <PaymentIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold" color="#1e293b">Phương thức thanh toán</Typography>
        </Box>

        <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <Stack spacing={2}>
            {/* COD - Chuyển sang Blue theme */}
            <Paper elevation={0} sx={{ border: paymentMethod === 'COD' ? '2px solid #1976d2' : '1px solid #e2e8f0', p: 1, borderRadius: 2, transition: '0.2s', bgcolor: paymentMethod === 'COD' ? '#eff6ff' : '#fff' }}>
              <FormControlLabel
                value="COD"
                control={<Radio color="primary" />}
                label={<Typography variant="body2" fontWeight="600">Thanh toán khi nhận hàng (COD)</Typography>}
                sx={{ width: '100%', m: 0 }}
              />
            </Paper>

            {/* MOMO - Giữ nguyên màu thương hiệu Pink */}
            <Paper elevation={0} sx={{ border: paymentMethod === 'MOMO' ? '2px solid #a50064' : '1px solid #e2e8f0', p: 1, borderRadius: 2, bgcolor: paymentMethod === 'MOMO' ? '#fdf2f8' : '#fff' }}>
              <FormControlLabel
                value="MOMO"
                control={<Radio sx={{ color: paymentMethod === 'MOMO' ? '#a50064' : 'default' }} />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <img src={logoMomo} alt="MoMo" width="24" style={{ borderRadius: 4 }} />
                    <Typography variant="body2" fontWeight="600" color={paymentMethod === 'MOMO' ? '#a50064' : 'inherit'}>Ví MoMo</Typography>
                  </Box>
                }
                sx={{ width: '100%', m: 0 }}
              />
            </Paper>

            {/* VNPAY - Giữ nguyên màu thương hiệu Blue */}
            <Paper elevation={0} sx={{ border: paymentMethod === 'VNPAY' ? '2px solid #005baa' : '1px solid #e2e8f0', p: 1, borderRadius: 2, bgcolor: paymentMethod === 'VNPAY' ? '#eff6ff' : '#fff' }}>
              <FormControlLabel
                value="VNPAY"
                control={<Radio sx={{ color: paymentMethod === 'VNPAY' ? '#005baa' : 'default' }} />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <img src={logoVnpay} alt="VNPAY" width="50" />
                    <Typography variant="body2" fontWeight="600" color={paymentMethod === 'VNPAY' ? '#005baa' : 'inherit'}>Cổng VNPAY</Typography>
                  </Box>
                }
                sx={{ width: '100%', m: 0 }}
              />
            </Paper>
          </Stack>
        </RadioGroup>
      </Paper>
    </Box>
  )
}

export default CheckoutLeftColumn