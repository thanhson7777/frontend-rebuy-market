import React from 'react'
import {
  Card, CardMedia, CardContent, Typography, Box,
  Chip, IconButton, Tooltip, Stack
} from '@mui/material'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { addToCartAPI, selectCurrentCarts } from '~/redux/carts/cartSlice'
import { toast } from 'react-toastify'

const formatVND = (price) => price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })

function ProductCard({ product }) {
  const navigate = useNavigate()
  const location = useLocation()
  const currentUser = useSelector(selectCurrentUser)
  const currentCart = useSelector(selectCurrentCarts)
  const dispatch = useDispatch()

  const getConditionColor = (condition) => {
    const c = condition?.toLowerCase()
    if (c?.includes('new') || c?.includes('100')) return 'success'
    if (c?.includes('99')) return 'primary'
    return 'default'
  }

  const handleQuickAddToCart = async (e) => {
    e.stopPropagation()
    e.preventDefault()

    if (!currentUser) {
      toast.warning('Vui lòng đăng nhập để mua hàng nhé!')
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    if (currentCart && currentCart.items) {
      const isExist = currentCart.items.some(item => item.productId === product._id || item.productId?._id === product._id)
      if (isExist) {
        toast.warning('Sản phẩm này đã có trong giỏ hàng của bạn!')
        return
      }
    }

    const cartData = {
      productId: product._id,
      quantity: 1
    }

    dispatch(addToCartAPI(cartData))
      .unwrap()
      .then(() => {
        toast.success('Đã thêm vào giỏ hàng!')
      })
      .catch((error) => {
        console.log('Lỗi thêm giỏ hàng:', error)
      })
  }

  return (
    <Card
      sx={{
        maxWidth: '100%',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
        }
      }}
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <Chip
        label={product.condition || 'Zin ốc'}
        size="small"
        color={getConditionColor(product.condition)}
        sx={{
          position: 'absolute', top: 12, left: 12, zIndex: 2,
          fontWeight: 'bold', fontSize: '12px'
        }}
      />

      <CardMedia
        component="img"
        height="200"
        image={product.image?.[0] || 'https://via.placeholder.com/300'}
        alt={product.name}
        sx={{ objectFit: 'cover', p: 1, borderRadius: 4 }}
      />

      <CardContent sx={{ pt: 1 }}>
        <Typography
          variant="body1"
          fontWeight="bold"
          noWrap
          sx={{ color: 'text.primary', mb: 0.5 }}
        >
          {product.name}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" color="error.main" fontWeight="800">
            {formatVND(product.price)}
          </Typography>
          {product.originalPrice && (
            <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
              {formatVND(product.originalPrice)}
            </Typography>
          )}
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {product.location || 'Toàn quốc'} • {product.postedAt || 'Vừa xong'}
          </Typography>

          <Tooltip title="Thêm vào giỏ hàng">
            <IconButton
              size="small"
              color="primary"
              onClick={handleQuickAddToCart}
              sx={{ bgcolor: 'rgba(25, 118, 210, 0.08)', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}
            >
              <AddShoppingCartIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ProductCard