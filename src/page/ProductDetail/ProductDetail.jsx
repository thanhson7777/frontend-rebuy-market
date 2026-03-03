import React, { useState, useEffect } from 'react'
import {
  Container, Grid, Box, Typography, Button, Breadcrumbs,
  Link as MuiLink, Stack, Chip, Divider, Paper, Tab, Tabs,
  CircularProgress
} from '@mui/material'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import LocalMallIcon from '@mui/icons-material/LocalMall'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { addToCartAPI, selectCurrentCarts } from '~/redux/carts/cartSlice'
import { toast } from 'react-toastify'

import { fetchProductDetailAPI } from '~/apis'
import ProductImageGallery from './ProductImageGallery'

function TabPanel(props) {
  const { children, value, index, ...other } = props
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const currentUser = useSelector(selectCurrentUser)
  const currentCartRaw = useSelector(selectCurrentCarts)
  const currentCart = currentCartRaw?.data || currentCartRaw || {}

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    const getProductDetail = async () => {
      setLoading(true)
      try {
        const res = await fetchProductDetailAPI(id)
        if (res) setProduct(res)
      } catch (error) {
        toast.error('Không tìm thấy sản phẩm hoặc lỗi tải!')
      } finally {
        setLoading(false)
      }
    }
    getProductDetail()
    window.scrollTo(0, 0)
  }, [id])

  const formatVND = (price) => price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })

  const handleTabChange = (event, newValue) => setTabValue(newValue)

  const handleAddToCart = async () => {
    if (!currentUser) {
      toast.warning('Vui lòng đăng nhập để mua hàng!')
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    if (currentCart && currentCart.items) {
      const isExist = currentCart.items.some(item => item.productId === product._id || item.productId?._id === product._id)
      if (isExist) {
        toast.warning('Sản phẩm này đã có trong giỏ hàng của bạn!')
        return
      }
    }

    try {
      await dispatch(addToCartAPI({ productId: product._id, quantity: 1 })).unwrap()
      toast.success('Đã thêm sản phẩm vào giỏ hàng!')
    } catch (error) {
      console.error(error)
    }
  }

  const handleBuyNow = () => {
    // Để mua ngay, ta thêm và gán state đi tới Checkout 
    // Tuy nhiên đơn giản nhất là chuyển giỏ với item này
    if (!currentUser) {
      toast.warning('Vui lòng đăng nhập để tiếp tục thanh toán!')
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    // Logic: Nếu chưa có trong giỏ -> Thêm -> sang giỏ/trang checkout
    // Nếu có rồi -> sang luôn
    const isExist = currentCart?.items?.some(item => item.productId === product._id || item.productId?._id === product._id)

    if (!isExist) {
      dispatch(addToCartAPI({ productId: product._id, quantity: 1 }))
        .unwrap()
        .then(() => navigate('/cart')) // Chuyển sang giỏ hàng trước -> rồi qua checkout
    } else {
      navigate('/cart')
    }
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!product) {
    return (
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">Sản phẩm không tồn tại!</Typography>
        <Button variant="outlined" sx={{ mt: 2 }} component={Link} to="/products">Quay lại danh sách</Button>
      </Container>
    )
  }

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', pb: 8, pt: 4 }}>
      <Container maxWidth="lg">
        {/* Breadcrumb */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1, p: 3 }}>
          <MuiLink component={Link} to="/" underline="hover" color="inherit">Trang chủ</MuiLink>
          <MuiLink component={Link} to="/products" underline="hover" color="inherit">Sản phẩm</MuiLink>
          <Typography color="text.primary" fontWeight="bold" noWrap sx={{ maxWidth: 300 }}>{product.name}</Typography>
        </Breadcrumbs>

        {/* Khối Thông tin chính */}
        <Grid container spacing={5}>
          {/* Cột Trái - Gallery */}
          <Grid item xs={12} md={5}>
            <ProductImageGallery images={product.image} />
          </Grid>

          {/* Cột Phải - Info */}
          <Grid item xs={12} md={7}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1.5, color: '#111827' }}>
              {product.name}
            </Typography>

            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
              {product.status === 'available' ? (
                <Chip icon={<CheckCircleOutlineIcon />} label="Còn hàng (Chỉ 1 sản phẩm)" color="success" size="small" variant="filled" />
              ) : (
                <Chip label="Đã bán / Hết hàng" color="error" size="small" variant="filled" />
              )}
              <Chip label="Đồ cũ" color="primary" size="small" variant="outlined" />
              <Typography variant="body2" color="text.secondary">SKU: {product.sku || 'N/A'}</Typography>
            </Stack>

            <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 3, mb: 4, border: '1px solid', borderColor: 'grey.200' }}>
              <Typography variant="h3" fontWeight="800" color="error.main" sx={{ mb: 1 }}>
                {formatVND(product.price)}
              </Typography>
            </Box>

            {/* Thông tin tình trạng (Quan trọng với đồ cũ) */}
            <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <HelpOutlineIcon sx={{ mr: 1, color: '#f59e0b', fontSize: 24 }} />
                <Typography variant="h6" fontWeight="bold" color="#1e293b">Tình trạng thực tế</Typography>
              </Box>
              <Typography variant="body1" color="#334155" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {product.defects || 'Chủ cũ giữ gìn cẩn thận, chưa phát hiện khuyết điểm nổi bật. Sản phẩm zin all đúng như ảnh chụp.'}
              </Typography>
            </Paper>

            {/* Thống tin bảo hành */}
            <Stack direction="column" spacing={1.5} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <VerifiedUserIcon color="primary" />
                <Typography variant="body2">Cam kết ảnh chụp sản phẩm thực tế 100%</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <VerifiedUserIcon color="primary" />
                <Typography variant="body2">Hỗ trợ trả hàng / hoàn tiền nếu lỗi phát sinh do người bán</Typography>
              </Box>
            </Stack>

            {/* Actions */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="outlined"
                size="large"
                color="primary"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                disabled={product.status !== 'available'}
                sx={{ py: 1.5, px: 4, borderRadius: 2, fontWeight: 'bold', fontSize: '1rem', border: '2px solid', '&:hover': { border: '2px solid' } }}
              >
                Thêm Vào Giỏ
              </Button>
              <Button
                variant="contained"
                size="large"
                color="error"
                startIcon={<LocalMallIcon />}
                onClick={handleBuyNow}
                disabled={product.status !== 'available'}
                sx={{ py: 1.5, px: 6, borderRadius: 2, fontWeight: 'bold', fontSize: '1rem', flexGrow: 1 }}
              >
                Mua Ngay
              </Button>
            </Stack>
          </Grid>
        </Grid>

        {/* Khối Tabs miêu tả */}
        <Box sx={{ mt: 8, bgcolor: 'white', borderRadius: 3, p: { xs: 2, md: 4 }, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ '& .MuiTab-root': { fontWeight: 'bold', fontSize: '1rem' } }}>
              <Tab label="Mô tả sản phẩm" />
              <Tab label="Chính sách shop" />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
            <Box
              className="product-description-html"
              sx={{
                color: 'text.secondary', lineHeight: 1.8, fontSize: '1.05rem',
                '& img': { maxWidth: '100%', height: 'auto', borderRadius: 2, my: 2 }
              }}
              dangerouslySetInnerHTML={{ __html: product.description || '<p>Chưa có mô tả chi tiết cho sản phẩm này.</p>' }}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Typography variant="body1" paragraph>
              <strong>1. Chính sách kiểm tra hàng:</strong> Quý khách được quyền kiểm tra tình trạng ngoại quan sản phẩm trước khi thanh toán cho bên vận chuyển.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>2. Chính sách đổi trả:</strong> Hỗ trợ hoàn trả 100% giá trị trong vòng 3 ngày nếu sản phẩm có lỗi chức năng không đúng như phần "Tình trạng thực tế" đã ghi chú trên website.
            </Typography>
            <Typography variant="body1">
              <strong>3. Vận chuyển:</strong> Phí vận chuyển và thời gian giao hàng phụ thuộc vào đơn vị trung gian (GHN/GHTK) dựa trên kích thước và cân nặng niêm yết của mặt hàng.
            </Typography>
          </TabPanel>
        </Box>

      </Container>
    </Box>
  )
}

export default ProductDetailPage
