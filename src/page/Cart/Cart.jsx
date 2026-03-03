import React, { useState, useMemo } from 'react'
import {
  Container, Grid, Box, Typography, Button, Checkbox,
  IconButton, Divider, Card, CardContent, Stack, CircularProgress
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'

import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentCarts, deleteItemCartAPI } from '~/redux/carts/cartSlice'
import { formatCurrency } from '~/utils/formatCurrency'
import { toast } from 'react-toastify'

function CartPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentCartRaw = useSelector(selectCurrentCarts)
  const currentCart = currentCartRaw?.data || currentCartRaw || {}
  const cartItems = currentCart?.items || []

  // Lưu trữ danh sách productId đang được chọn
  const [selectedItemIds, setSelectedItemIds] = useState([])
  const [deletingId, setDeletingId] = useState(null)

  // Xử lý Checkbox Chọn/Bỏ chọn
  const handleToggleItem = (productId) => {
    setSelectedItemIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  // Chọn tất cả
  const handleToggleAll = (e) => {
    if (e.target.checked) {
      // Chỉ chọn những sản phẩm hợp lệ (AVAILABLE)
      const availableIds = cartItems
        .filter(item => item.status?.toLowerCase() === 'available')
        .map(item => item.productId)
      setSelectedItemIds(availableIds)
    } else {
      setSelectedItemIds([])
    }
  }

  // Tính tổng tiền dựa trên sản phẩm đã chọn
  const selectedTotalAmount = useMemo(() => {
    return cartItems.reduce((total, item) => {
      console.log(item)
      if (selectedItemIds.includes(item.productId)) {
        return total + (item.price || 0)
      }
      return total
    }, 0)
  }, [cartItems, selectedItemIds])

  // Xóa sản phẩm khỏi giỏ
  const handleDeleteItem = async (productId) => {
    setDeletingId(productId)
    try {
      await dispatch(deleteItemCartAPI({ productId })).unwrap()
      toast.success('Đã xóa khỏi giỏ hàng')
      // Bỏ khỏi danh sách chọn (nếu có)
      setSelectedItemIds(prev => prev.filter(id => id !== productId))
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa!')
    } finally {
      setDeletingId(null)
    }
  }

  // TIến hành thanh toán
  const handleCheckout = () => {
    if (selectedItemIds.length === 0) {
      toast.warning('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!')
      return
    }
    // TODO: Truyền state/selectedItemIds sang trang Checkout
    navigate('/checkout', { state: { selectedItems: selectedItemIds } })
  }

  // Biến kiểm tra checkbox "Chọn tất cả"
  const availableItemsCount = cartItems.filter(item => item.status?.toLowerCase() === 'available').length
  const isAllSelected = cartItems.length > 0 && availableItemsCount === selectedItemIds.length && availableItemsCount > 0

  if (!cartItems.length) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <ShoppingCartOutlinedIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" mb={3}>Giỏ hàng của bạn đang trống</Typography>
        <Button variant="contained" component={Link} to="/products">Tiếp tục mua sắm</Button>
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', pb: 8, pt: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingCartOutlinedIcon fontSize="large" /> Giỏ hàng ({cartItems.length})
        </Typography>

        <Grid container spacing={3}>
          {/* CỘT TRÁI: DANH SÁCH GIỎ HÀNG */}
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', mb: 2 }}>
              {/* Header List */}
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.200', display: 'flex', alignItems: 'center', bgcolor: '#f8fafc' }}>
                <Checkbox
                  checked={isAllSelected}
                  onChange={handleToggleAll}
                  disabled={availableItemsCount === 0}
                />
                <Typography fontWeight="bold" sx={{ flexGrow: 1 }}>Sản phẩm</Typography>
                <Typography fontWeight="bold" sx={{ width: 120, textAlign: 'right' }}>Thành tiền</Typography>
                <Box sx={{ width: 48 }}></Box> {/* Khoảng trống cho icon Xóa */}
              </Box>

              {/* Items List */}
              <Box>
                {cartItems.map((item, index) => {
                  const isAvailable = item.status?.toLowerCase() === 'available'
                  const isChecked = selectedItemIds.includes(item.productId)

                  return (
                    <Box key={item.productId}>
                      {index > 0 && <Divider />}
                      <Box sx={{
                        p: 2, display: 'flex', alignItems: 'center',
                        bgcolor: isChecked ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                        opacity: isAvailable ? 1 : 0.6,
                        position: 'relative'
                      }}>
                        <Checkbox
                          checked={isChecked}
                          onChange={() => handleToggleItem(item.productId)}
                          disabled={!isAvailable}
                        />

                        {/* Ảnh SP */}
                        <Box
                          component={Link}
                          to={`/product/${item.productId}`}
                          sx={{ width: 80, height: 80, borderRadius: 2, overflow: 'hidden', mr: 2, flexShrink: 0, border: '1px solid #eee' }}
                        >
                          <img src={item.image?.[0] || 'https://via.placeholder.com/80'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>

                        {/* Thông tin SP */}
                        <Box sx={{ flexGrow: 1, mr: 2 }}>
                          <Typography
                            variant="subtitle1"
                            component={Link}
                            to={`/product/${item.productId}`}
                            sx={{ fontWeight: 'bold', textDecoration: 'none', color: 'text.primary', '&:hover': { color: 'primary.main' } }}
                          >
                            {item.name}
                          </Typography>

                          {/* Label số lượng và Tình trạng */}
                          <Stack direction="row" spacing={1} sx={{ mt: 0.5, alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                              Số lượng: <Typography component="span" fontWeight="bold">1</Typography> (Duy nhất)
                            </Typography>
                            {item.defects && (
                              <Typography variant="caption" sx={{ bgcolor: 'grey.200', px: 1, py: 0.2, borderRadius: 1 }}>
                                {item.defects.length > 20 ? item.defects.substring(0, 20) + '...' : item.defects}
                              </Typography>
                            )}
                          </Stack>

                          {/* Thông báo nếu Hết hàng */}
                          {!isAvailable && (
                            <Typography variant="body2" color="error.main" fontWeight="bold" sx={{ mt: 1 }}>
                              Sản phẩm này đã được bán cho người khác!
                            </Typography>
                          )}
                        </Box>

                        {/* Giá tiền */}
                        <Box sx={{ width: 120, textAlign: 'right' }}>
                          <Typography fontWeight="bold" color="error.main">
                            {formatCurrency(item.price)}
                          </Typography>
                        </Box>

                        {/* Nút Xóa */}
                        <Box sx={{ width: 48, display: 'flex', justifyContent: 'center' }}>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteItem(item.productId)}
                            disabled={deletingId === item.productId}
                          >
                            {deletingId === item.productId ? <CircularProgress size={24} /> : <DeleteOutlineIcon />}
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            </Card>
          </Grid>

          {/* CỘT PHẢI: SUMMARY CHECKOUT */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 80 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>Thanh Toán</Typography>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography color="text.secondary">Tạm tính ({selectedItemIds.length} món)</Typography>
                  <Typography fontWeight="bold">{formatCurrency(selectedTotalAmount)}</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography color="text.secondary">Giảm giá</Typography>
                  <Typography fontWeight="bold">0đ</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography color="text.secondary">Phí vận chuyển</Typography>
                  <Typography variant="caption" color="primary.main" sx={{ fontStyle: 'italic', alignSelf: 'center' }}>
                    (Tính ở bước sau)
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography fontWeight="bold" variant="subtitle1">Tổng cộng</Typography>
                  <Typography fontWeight="900" variant="h5" color="error.main">
                    {formatCurrency(selectedTotalAmount)}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  size="large"
                  onClick={handleCheckout}
                  disabled={selectedItemIds.length === 0}
                  sx={{ py: 1.5, fontWeight: 'bold', fontSize: '1.05rem', borderRadius: 2 }}
                >
                  Tiến Hành Mua Hàng
                </Button>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Container>
    </Box>
  )
}

export default CartPage