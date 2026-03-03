import { useState, useEffect } from 'react'
import { Box, Container, Typography, Grid, Breadcrumbs, Link } from '@mui/material'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

import CheckoutLeftColumn from './CheckoutLeftColumn'
import CheckoutRightColumn from './CheckoutRightColumn'
import { createOrderAPI } from '~/apis'
import { clearCurrentCarts } from '~/redux/carts/cartSlice'

function Checkout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 1. STATE QUẢN LÝ THÔNG TIN (Lifting State Up)
  const [shippingInfo, setShippingInfo] = useState({
    fullname: '', phone: '', province: '', district: '', address: '', note: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [requireVAT, setRequireVAT] = useState(false)
  const [vatInfo, setVatInfo] = useState({
    companyName: '', taxCode: '', companyAddress: ''
  })

  // Cuộn lên đầu trang khi vào trang Thanh toán
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // 2. LOGIC ĐẶT HÀNG CHÍNH
  const handlePlaceOrder = async (orderSummaryParams) => {
    const { totalProductPrice, shippingFee, discountAmount, finalPrice, appliedCoupon } = orderSummaryParams

    // Validate nhanh
    if (!shippingInfo.fullname || !shippingInfo.phone || !shippingInfo.province || !shippingInfo.district || !shippingInfo.address) {
      toast.error('Vui lòng điền đầy đủ địa chỉ giao hàng nhé!')
      return
    }

    // Chuẩn bị dữ liệu gửi về Backend
    const orderPayload = {
      shippingAddress: shippingInfo,
      paymentMethod,
      shippingFee,
      totalProductPrice,
      discountAmount,
      finalPrice,
      couponCode: appliedCoupon?.code,
      couponId: appliedCoupon?._id,
      // Bổ sung VAT nếu khách yêu cầu
      isVatRequired: requireVAT,
      vatInfo: requireVAT ? vatInfo : undefined
    }

    try {
      setIsSubmitting(true)
      const res = await createOrderAPI(orderPayload)

      if (paymentMethod === 'COD') {
        toast.success(res?.message || 'Đặt hàng thành công! Cảm ơn bạn đã tin tưởng Rebuy Market.')
        dispatch(clearCurrentCarts())
        navigate('/order-success', { state: { orderData: res?.data } })
      } else if (res.data?.paymentUrl) {
        // Nếu là MoMo hoặc VNPAY, chuyển hướng sang cổng thanh toán
        window.location.href = res.data.paymentUrl
      } else {
        toast.warning('Tạo đơn thành công nhưng không tìm thấy link thanh toán!')
        navigate('/user/orders')
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!'
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: { xs: 3, md: 6 } }}>
      <Container maxWidth="lg">

        {/* Điều hướng Breadcrumbs giúp khách biết mình đang ở đâu */}
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 3 }}
        >
          <Link component={RouterLink} to="/" underline="hover" color="inherit">Trang chủ</Link>
          <Link component={RouterLink} to="/cart" underline="hover" color="inherit">Giỏ hàng</Link>
          <Typography color="primary.main" fontWeight="bold">Thanh toán</Typography>
        </Breadcrumbs>

        <Typography
          variant="h4"
          fontWeight="900"
          sx={{
            color: '#0f172a', // Navy Dark (Cùng màu Footer)
            textTransform: 'uppercase',
            mb: 4,
            fontSize: { xs: '1.5rem', md: '2.125rem' }
          }}
        >
          Thanh Toán Đơn Hàng
        </Typography>

        <Grid container spacing={4}>
          {/* CỘT TRÁI: FORM ĐIỀN THÔNG TIN */}
          <Grid item xs={12} md={7}>
            <CheckoutLeftColumn
              shippingInfo={shippingInfo}
              setShippingInfo={setShippingInfo}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              requireVAT={requireVAT}
              setRequireVAT={setRequireVAT}
              vatInfo={vatInfo}
              setVatInfo={setVatInfo}
            />
          </Grid>

          {/* CỘT PHẢI: TỔNG KẾT & NÚT ĐẶT HÀNG */}
          <Grid item xs={12} md={5}>
            <CheckoutRightColumn
              onPlaceOrder={handlePlaceOrder}
              paymentMethod={paymentMethod}
              shippingInfo={shippingInfo}
              isSubmitting={isSubmitting}
            />
          </Grid>
        </Grid>

      </Container>
    </Box>
  )
}

export default Checkout