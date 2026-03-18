import React, { useState, useEffect } from 'react'
import {
  Container, Grid, Box, Typography,
  Breadcrumbs, Link as MuiLink, Select, MenuItem,
  FormControl, InputLabel, Pagination,
  Accordion, AccordionSummary, AccordionDetails,
  Checkbox, FormGroup, FormControlLabel, Slider, Button
} from '@mui/material'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FilterListIcon from '@mui/icons-material/FilterList'
import ProductCard from '~/components/ProductCard'
import { fetchProductsAPI, fetchAdminCategoriesAPI } from '~/apis'
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

function ProductsPage() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    sort: 'newest',
    category: 'all',
    priceRange: [0, 50000000],
    condition: {
      new99: false,
      new95: false,
      used: false
    },
    keyword: searchParams.get('keyword') || ''
  })

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetchAdminCategoriesAPI()
        if (res) setCategories(res)
      } catch (error) {
        console.error(error)
      }
    }
    getCategories()
  }, [])

  useEffect(() => {
    const urlKeyword = searchParams.get('keyword') || ''
    setFilters(prev => (prev.keyword !== urlKeyword ? { ...prev, keyword: urlKeyword, page: 1 } : prev))
  }, [searchParams])

  // Gọi API lấy Sản phẩm theo filter
  useEffect(() => {
    const getProducts = async () => {
      setLoading(true)
      try {
        const queryParams = {
          page: filters.page,
          limit: filters.limit
        }

        if (filters.category !== 'all') {
          queryParams.category = filters.category
        }

        if (filters.keyword) {
          queryParams.keyword = filters.keyword
        }

        // Lọc theo khoảng giá
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000000) {
          queryParams.minPrice = filters.priceRange[0]
          queryParams.maxPrice = filters.priceRange[1]
        }

        // Lọc theo tình trạng
        const conditions = []
        if (filters.condition.new99) conditions.push('new99')
        if (filters.condition.new95) conditions.push('new95')
        if (filters.condition.used) conditions.push('used')
        if (conditions.length > 0) {
          queryParams.condition = conditions.join(',')
        }

        switch (filters.sort) {
          case 'price_asc':
            queryParams.sortBy = 'price'
            queryParams.orderBy = 'asc'
            break
          case 'price_desc':
            queryParams.sortBy = 'price'
            queryParams.orderBy = 'desc'
            break
          default:
            // newest
            queryParams.sortBy = 'createdAt'
            queryParams.orderBy = 'desc'
            break
        }

        const res = await fetchProductsAPI(queryParams)
        if (res.products) {
          console.log('Products response:', res)
          setProducts(res.products || [])
          setTotalProducts(res.totalProducts || 0)
          const total = Math.ceil((res.totalProducts || 0) / filters.limit)
          setTotalPage(total > 0 ? total : 1)
        }
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error)
        toast.error('Không thể tải danh sách sản phẩm')
      } finally {
        setLoading(false)
      }
    }

    getProducts()
  }, [filters])

  const handlePageChange = (event, value) => {
    setFilters(prev => ({ ...prev, page: value }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSortChange = (event) => {
    setFilters(prev => ({ ...prev, sort: event.target.value, page: 1 }))
  }

  const handleCategorySelect = (categoryId) => {
    setFilters(prev => ({ ...prev, category: categoryId, page: 1 }))
  }

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', pb: 8, pt: 4 }}>
      <Container maxWidth="lg">
        {/* Breadcrumb */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <MuiLink component={Link} to="/" underline="hover" color="inherit">Trang chủ</MuiLink>
          <MuiLink component={Link} to="/products" underline="hover" color="inherit">Sản phẩm đồ cũ</MuiLink>
          {filters.keyword && (
            <Typography color="text.primary" fontWeight="bold">
              Tìm kiếm: "{filters.keyword}"
            </Typography>
          )}
          {!filters.keyword && (
            <Typography color="text.primary" fontWeight="bold">Sản phẩm đồ cũ</Typography>
          )}
        </Breadcrumbs>

        <Grid container spacing={3}>
          {/* Cột trái: Bộ lọc (Sidebar) */}
          <Grid item xs={12} md={3}>
            <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                <FilterListIcon />
                <Typography variant="h6" fontWeight="bold">Bộ lọc</Typography>
              </Box>

              {/* Danh mục */}
              <Accordion defaultExpanded disableGutters elevation={0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
                  <Typography fontWeight="bold">Danh mục</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0, pt: 0 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography
                      onClick={() => handleCategorySelect('all')}
                      sx={{
                        cursor: 'pointer',
                        color: filters.category === 'all' ? 'primary.main' : 'text.secondary',
                        fontWeight: filters.category === 'all' ? 'bold' : 'normal',
                        '&:hover': { color: 'primary.main' }
                      }}
                    >
                      Tất cả sản phẩm
                    </Typography>
                    {categories.map((cat) => (
                      <Typography
                        key={cat._id}
                        onClick={() => handleCategorySelect(cat._id)}
                        sx={{
                          cursor: 'pointer',
                          color: filters.category === cat._id ? 'primary.main' : 'text.secondary',
                          fontWeight: filters.category === cat._id ? 'bold' : 'normal',
                          '&:hover': { color: 'primary.main' }
                        }}
                      >
                        {cat.name}
                      </Typography>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Khoảng giá */}
              <Accordion defaultExpanded disableGutters elevation={0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
                  <Typography fontWeight="bold">Khoảng giá</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0, pt: 0 }}>
                  <Slider
                    value={filters.priceRange}
                    onChange={(e, newValue) => setFilters(prev => ({ ...prev, priceRange: newValue }))}
                    valueLabelDisplay="auto"
                    min={0}
                    max={50000000}
                    step={500000}
                    color="primary"
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="caption">{filters.priceRange[0].toLocaleString()}đ</Typography>
                    <Typography variant="caption">{filters.priceRange[1].toLocaleString()}đ</Typography>
                  </Box>
                  <Button
                    fullWidth variant="outlined" size="small" sx={{ mt: 2 }}
                    onClick={() => setFilters(prev => ({ ...prev, page: 1 }))}
                  >
                    Áp dụng giá
                  </Button>
                </AccordionDetails>
              </Accordion>

              {/* Tình trạng */}
              <Accordion defaultExpanded disableGutters elevation={0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
                  <Typography fontWeight="bold">Tình trạng</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0, pt: 0 }}>
                  <FormGroup>
                    <FormControlLabel 
                      control={<Checkbox size="small" checked={filters.condition.new99} 
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          condition: { ...prev.condition, new99: e.target.checked },
                          page: 1 
                        }))} 
                      />} 
                      label="Like New 99%" 
                    />
                    <FormControlLabel 
                      control={<Checkbox size="small" checked={filters.condition.new95}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          condition: { ...prev.condition, new95: e.target.checked },
                          page: 1 
                        }))} 
                      />} 
                      label="Hàng dùng tốt 95%" 
                    />
                    <FormControlLabel 
                      control={<Checkbox size="small" checked={filters.condition.used}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          condition: { ...prev.condition, used: e.target.checked },
                          page: 1 
                        }))} 
                      />} 
                      label="Có xước / Lỗi nhẹ" 
                    />
                  </FormGroup>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Grid>

          {/* Cột phải: Danh sách Sản phẩm */}
          <Grid item xs={12} md={9}>
            {/* Header: Sorting & Info */}
            <Box sx={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              bgcolor: 'white', p: 2, borderRadius: 2, mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <Typography variant="body1">
                {totalProducts > 0 && (
                  <span>
                    Hiển thị <b>{(filters.page - 1) * filters.limit + 1}</b> - <b>{Math.min(filters.page * filters.limit, totalProducts)}</b> của <b>{totalProducts}</b> sản phẩm
                  </span>
                )}
                {totalProducts === 0 && !loading && (
                  <span>Không tìm thấy sản phẩm nào</span>
                )}
              </Typography>

              <FormControl size="small" sx={{ minWidth: 200, ...fieldSx }}>
                <InputLabel>Sắp xếp theo</InputLabel>
                <Select
                  value={filters.sort}
                  label="Sắp xếp theo"
                  onChange={handleSortChange}
                >
                  <MenuItem value="newest">Mới nhất</MenuItem>
                  <MenuItem value="price_asc">Giá: Thấp đến Cao</MenuItem>
                  <MenuItem value="price_desc">Giá: Cao đến Thấp</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* List products */}
            <Grid container spacing={2}>
              {loading ? (
                <Box sx={{ width: '100%', py: 10, display: 'flex', justifyContent: 'center' }}>
                  <Typography>Đang tải dữ liệu...</Typography>
                </Box>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product._id}>
                    <ProductCard product={product} />
                  </Grid>
                ))
              ) : (
                <Box sx={{ width: '100%', py: 10, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="h6" color="text.secondary">Không tìm thấy sản phẩm nào phù hợp!</Typography>
                  <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setFilters(prev => ({ ...prev, category: 'all' }))}>
                    Xóa bộ lọc
                  </Button>
                </Box>
              )}
            </Grid>

            {/* Pagination */}
            {totalPage > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Pagination
                  count={totalPage}
                  page={filters.page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default ProductsPage
