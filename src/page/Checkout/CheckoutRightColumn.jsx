import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Box, Typography, Button, Paper, Divider, Avatar,
  TextField, Stack, CircularProgress
} from '@mui/material'

import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import LocalMallIcon from '@mui/icons-material/LocalMall'

import { toast } from 'react-toastify'
import { selectCurrentCarts } from '~/redux/carts/cartSlice'
import { fetchCouponsAPI } from '~/apis'
import { shippingHelper } from '~/utils/shipping'

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)

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

function CheckoutRightColumn({ paymentMethod, onPlaceOrder, isSubmitting, shippingInfo }) {
  const cart = useSelector(selectCurrentCarts)
  const cartItems = cart?.items || []

  const [coupons, setCoupons] = useState([])
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(true)
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [isApplying, setIsApplying] = useState(false)

  const TRUST_BLUE = '#1976d2'

  useEffect(() => {
    setIsLoadingCoupons(true)
    fetchCouponsAPI()
      .then(res => {
        setCoupons(res || [])
        console.log('Coupons fetched:', res.data)
      })
      .catch(err => console.error('Lỗi mã giảm giá:', err))
      .finally(() => setIsLoadingCoupons(false))
  }, [])

  const totalProductPrice = cart?.totalPrice || cartItems.reduce((total, item) => total + (item.price * 1), 0)

  const shippingFee = shippingHelper.calculateShippingFee(
    shippingInfo?.province || '',
    shippingInfo?.district || '',
    totalProductPrice
  )

  let discountAmount = 0
  if (appliedCoupon?.discount) {
    if (appliedCoupon.discount.type === 'FIXED') {
      discountAmount = appliedCoupon.discount.value
    } else {
      discountAmount = (totalProductPrice * appliedCoupon.discount.value) / 100
      if (appliedCoupon.discount.maxAmount) {
        discountAmount = Math.min(discountAmount, appliedCoupon.discount.maxAmount)
      }
    }
  }

  const finalPrice = Math.max(0, totalProductPrice + shippingFee - discountAmount)

  const handleApplyCoupon = (codeToApply) => {
    const code = codeToApply || couponInput.trim().toUpperCase()
    if (!code) return toast.warning('Vui lòng nhập mã giảm giá!')
    setIsApplying(true)
    setTimeout(() => {
      const foundCoupon = coupons.find(c => c.code === code)
      if (!foundCoupon) {
        toast.error('Mã giảm giá không hợp lệ!')
        setAppliedCoupon(null)
      } else if (totalProductPrice < (foundCoupon.minOrder || 0)) {
        toast.error(`Đơn hàng tối thiểu ${formatPrice(foundCoupon.minOrder)}`)
      } else {
        toast.success(`Áp dụng thành công mã ${code}!`)
        setAppliedCoupon(foundCoupon)
        setCouponInput(code)
      }
      setIsApplying(false)
    }, 500)
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponInput('')
  }

  const renderCTAButton = () => {
    let btnText = 'HOÀN TẤT ĐẶT HÀNG'
    let btnColor = TRUST_BLUE
    let btnIcon = <LocalMallIcon />

    if (paymentMethod === 'MOMO') {
      btnText = 'THANH TOÁN MOMO'
      btnColor = '#a50064'
      btnIcon = <QrCodeScannerIcon />
    } else if (paymentMethod === 'VNPAY') {
      btnText = 'THANH TOÁN VNPAY'
      btnColor = '#005baa'
      btnIcon = <AccountBalanceWalletIcon />
    }

    return (
      <Button
        fullWidth variant="contained"
        disabled={isSubmitting || cartItems.length === 0}
        onClick={() => onPlaceOrder({ totalProductPrice, shippingFee, discountAmount, finalPrice, appliedCoupon })}
        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : btnIcon}
        sx={{
          bgcolor: btnColor, color: '#fff', py: 2, fontWeight: 'bold', fontSize: '1rem', borderRadius: 3,
          boxShadow: `0 8px 16px ${btnColor}33`,
          '&:hover': { bgcolor: btnColor, opacity: 0.9, transform: 'translateY(-2px)' },
          transition: 'all 0.2s ease'
        }}
      >
        {isSubmitting ? 'ĐANG XỬ LÝ...' : btnText}
      </Button>
    )
  }

  return (
    <Box sx={{ position: 'sticky', top: 100 }}> {/* Cách Header một khoảng */}
      {/* 1. TÓM TẮT GIỎ HÀNG */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <Typography variant="subtitle1" fontWeight="bold" color="#1e293b" mb={2}>Đơn hàng ({cartItems.length} sản phẩm)</Typography>

        <Stack spacing={2} sx={{ maxHeight: 240, overflowY: 'auto', pr: 1, '::-webkit-scrollbar': { width: '4px' }, '::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: '4px' } }}>
          {cartItems.map(item => (
            <Box key={item.productId} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box position="relative">
                <Avatar variant="rounded" src={item.image[0]} sx={{ width: 50, height: 50, border: '1px solid #f1f5f9' }} />
                {/* <Box sx={{ position: 'absolute', top: -6, right: -6, bgcolor: '#475569', color: '#fff', fontSize: '10px', fontWeight: 'bold', width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
                  {1}
                </Box> */}
              </Box>
              <Box flexGrow={1}>
                <Typography variant="body2" fontWeight="600" sx={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.name}</Typography>
                <Typography variant="caption" color="text.secondary">{formatPrice(item.price)}</Typography>
              </Box>
              <Typography variant="body2" fontWeight="bold" color="primary.main">{formatPrice(item.price * 1)}</Typography>
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* 2. MÃ GIẢM GIÁ */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <ConfirmationNumberIcon sx={{ color: 'primary.main' }} />
          <Typography variant="subtitle2" fontWeight="bold">Mã giảm giá</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth size="small" placeholder="Nhập mã..."
            value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
            disabled={appliedCoupon !== null}
            sx={fieldSx}
          />
          {appliedCoupon ? (
            <Button variant="text" color="error" onClick={handleRemoveCoupon} sx={{ fontWeight: 'bold' }}>Xóa</Button>
          ) : (
            <Button variant="contained" color="primary" onClick={() => handleApplyCoupon()} disabled={!couponInput} sx={{ boxShadow: 'none' }}>Áp dụng</Button>
          )}
        </Box>

        {/* Danh sách Coupon gợi ý */}
        <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1, '::-webkit-scrollbar': { height: '4px' } }}>
          {!isLoadingCoupons && coupons.map(coupon => {
            const isEligible = totalProductPrice >= (coupon.minOrder || 0)
            const isSelected = appliedCoupon?.code === coupon.code
            return (
              <Box
                key={coupon._id}
                onClick={() => isEligible && handleApplyCoupon(coupon.code)}
                sx={{
                  minWidth: '160px', p: 1.5, border: '1px dashed', borderRadius: 2, cursor: isEligible ? 'pointer' : 'not-allowed',
                  borderColor: isSelected ? 'success.main' : (isEligible ? 'primary.main' : '#cbd5e1'),
                  bgcolor: isSelected ? '#f0fdf4' : (isEligible ? '#eff6ff' : '#f8fafc'),
                  transition: '0.2s', opacity: isEligible ? 1 : 0.6
                }}
              >
                <Typography variant="caption" fontWeight="900" color={isSelected ? 'success.main' : 'primary.main'}>{coupon.code}</Typography>
                <Typography variant="body2" fontWeight="bold" noWrap>{coupon.title}</Typography>
                <Typography variant="caption" display="block">Đơn từ {formatPrice(coupon.minOrder)}</Typography>
              </Box>
            )
          })}
        </Box>
      </Paper>

      {/* 3. TỔNG KẾT CHI PHÍ */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <Stack spacing={1.5} mb={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography color="text.secondary" variant="body2">Tạm tính</Typography>
            <Typography variant="body2" fontWeight="600">{formatPrice(totalProductPrice)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography color="text.secondary" variant="body2">Phí vận chuyển</Typography>
            <Typography variant="body2" fontWeight="600">{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</Typography>
          </Box>
          {appliedCoupon && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="success.main" variant="body2">Giảm giá</Typography>
              <Typography variant="body2" fontWeight="600" color="success.main">-{formatPrice(discountAmount)}</Typography>
            </Box>
          )}
        </Stack>

        <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography fontWeight="bold">Tổng tiền</Typography>
          <Typography variant="h5" fontWeight="900" color="primary.main">
            {formatPrice(finalPrice)}
          </Typography>
        </Box>

        {renderCTAButton()}
      </Paper>
    </Box>
  )
}

export default CheckoutRightColumn