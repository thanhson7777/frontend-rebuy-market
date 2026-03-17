import { useState, useEffect } from 'react'
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Collapse, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Grid, Avatar, CircularProgress,
  Tooltip, FormControl, InputLabel, Select, MenuItem, Chip
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm' // Thêm thư viện confirm
import { useTheme } from '@mui/material/styles'

import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import SaveIcon from '@mui/icons-material/Save'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CloseIcon from '@mui/icons-material/Close'
import InventoryIcon from '@mui/icons-material/Inventory'

import {
  fetchAdminProductsAPI,
  createAdminProductAPI,
  updateAdminProductAPI,
  deleteAdminProductAPI,
  fetchAdminCategoriesAPI
} from '~/apis'

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)

const STATUS_OPTIONS = [
  { value: 'available', label: 'Còn hàng', color: 'success' },
  { value: 'sold', label: 'Đã bán', color: 'default' },
  { value: 'hidden', label: 'Tạm ẩn', color: 'error' }
]

const AddProductModal = ({ open, onClose, onReload, categories }) => {
  const theme = useTheme()
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: '', sku: '', categoryId: '', price: '', status: 'available',
      defects: '', description: '', weight: '', length: '', width: '', height: ''
    }
  })

  useEffect(() => {
    return () => imagePreviews.forEach(url => URL.revokeObjectURL(url))
  }, [imagePreviews])

  const handleClose = () => {
    reset()
    setImageFiles([])
    setImagePreviews([])
    onClose()
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setImageFiles(prev => [...prev, ...files])
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(prev => [...prev, ...newPreviews])
  }

  const handleRemoveImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data) => {
    if (imageFiles.length === 0) return toast.error('Vui lòng chọn ít nhất 1 hình ảnh!')

    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('sku', data.sku.toUpperCase())
    formData.append('categoryId', data.categoryId)
    formData.append('price', Number(data.price))
    formData.append('status', data.status)
    formData.append('defects', data.defects)
    formData.append('description', data.description)
    formData.append('weight', Number(data.weight))
    formData.append('length', Number(data.length))
    formData.append('width', Number(data.width))
    formData.append('height', Number(data.height))

    imageFiles.forEach(file => formData.append('image', file))

    try {
      await toast.promise(createAdminProductAPI(formData), { pending: 'Đang lưu...', success: 'Thêm sản phẩm thành công!', error: 'Thêm thất bại!' })
      handleClose()
      onReload()
    } catch (error) { console.error(error) }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: theme.palette.primary.main, fontWeight: 'bold' }}>
        Thêm Sản Phẩm Đồ Cũ
        <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers sx={{ bgcolor: '#f8fafc' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>Thư viện ảnh ({imageFiles.length}/5)</Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, mb: 2 }}>
                  {imagePreviews.map((preview, index) => (
                    <Box key={index} sx={{ position: 'relative', paddingTop: '100%', borderRadius: 1, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                      <img src={preview} alt="preview" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      <IconButton
                        size="small" color="error"
                        sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'white' } }}
                        onClick={() => handleRemoveImage(index)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}

                  {imageFiles.length < 5 && (
                    <Box component="label" sx={{ paddingTop: '100%', position: 'relative', border: '2px dashed #90caf9', borderRadius: 1, cursor: 'pointer', bgcolor: '#e3f2fd', '&:hover': { bgcolor: '#bbdefb' } }}>
                      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <AddIcon color="primary" />
                        <Typography variant="caption" color="primary">Thêm ảnh</Typography>
                      </Box>
                      <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>1. Thông tin cơ bản</Typography>
                </Grid>
                <Grid item xs={12} md={8}><TextField fullWidth size="small" label="Tên sản phẩm *" {...register('name', { required: 'Không được để trống' })} error={!!errors.name} sx={fieldSx} /></Grid>
                <Grid item xs={12} md={4}><TextField fullWidth size="small" label="Mã SKU (VD: IP12-001) *" {...register('sku', { required: 'Bắt buộc' })} error={!!errors.sku} sx={fieldSx} /></Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small" sx={fieldSx}>
                    <InputLabel>Danh mục *</InputLabel>
                    <Select defaultValue="" label="Danh mục *" {...register('categoryId', { required: true })}>
                      {categories.map((cat) => <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}><TextField fullWidth size="small" type="number" label="Giá bán (VNĐ) *" {...register('price', { required: true })} sx={fieldSx} /></Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small" sx={fieldSx}>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select defaultValue="available" label="Trạng thái" {...register('status')}>
                      {STATUS_OPTIONS.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>2. Tình trạng máy (Đặc thù đồ cũ)</Typography>
                </Grid>
                <Grid item xs={12}><TextField fullWidth size="small" label="Khuyết điểm (VD: Trầy viền, xước dăm màn hình...)" multiline rows={2} {...register('defects')} sx={fieldSx} /></Grid>
                <Grid item xs={12}><TextField fullWidth size="small" label="Mô tả chi tiết" multiline rows={3} {...register('description')} sx={fieldSx} /></Grid>

                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>3. Vận chuyển (Giao hàng)</Typography>
                </Grid>
                <Grid item xs={6} md={3}><TextField fullWidth size="small" type="number" label="Trọng lượng (gram)" {...register('weight')} sx={fieldSx} /></Grid>
                <Grid item xs={6} md={3}><TextField fullWidth size="small" type="number" label="Dài (cm)" {...register('length')} sx={fieldSx} /></Grid>
                <Grid item xs={6} md={3}><TextField fullWidth size="small" type="number" label="Rộng (cm)" {...register('width')} sx={fieldSx} /></Grid>
                <Grid item xs={6} md={3}><TextField fullWidth size="small" type="number" label="Cao (cm)" {...register('height')} sx={fieldSx} /></Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f8fafc' }}>
          <Button color="inherit" onClick={handleClose}>Hủy</Button>
          <Button type="submit" variant="contained" color="primary">Lưu Sản Phẩm</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

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

const ProductRow = ({ row, categories, isExpanded, onToggleExpand, onDeleteClick, onReload }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: row.name, sku: row.sku, categoryId: row.categoryId, price: row.price, status: row.status,
      defects: row.defects, description: row.description, weight: row.weight, length: row.length, width: row.width, height: row.height
    }
  })

  const onUpdateSubmit = async (data) => {
    const formData = new FormData()
    Object.keys(data).forEach(key => formData.append(key, data[key]))

    try {
      await toast.promise(updateAdminProductAPI(row._id, formData), { pending: 'Đang cập nhật...', success: 'Cập nhật thành công!', error: 'Cập nhật thất bại!' })
      onToggleExpand(null)
      onReload()
    } catch (error) { console.error('Lỗi cập nhật:', error) }
  }

  const thumbUrl = Array.isArray(row.image) && row.image.length > 0 ? row.image[0] : row.image

  const statusConfig = STATUS_OPTIONS.find(s => s.value === row.status) || STATUS_OPTIONS[0]

  return (
    <>
      <TableRow hover onClick={() => onToggleExpand(isExpanded ? null : row._id)} sx={{ cursor: 'pointer', opacity: row._destroy ? 0.5 : 1 }}>
        <TableCell width="40px">
          <IconButton size="small"><KeyboardArrowDownIcon sx={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.3s' }} /></IconButton>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar variant="rounded" src={thumbUrl} alt={row.name} sx={{ width: 50, height: 50, boxShadow: 1 }} />
            <Box>
              <Typography fontWeight="bold">{row.name}</Typography>
              <Typography variant="caption" color="text.secondary">SKU: {row.sku}</Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell>
          <Chip label={statusConfig.label} color={statusConfig.color} size="small" variant={row.status === 'available' ? 'filled' : 'outlined'} />
        </TableCell>
        <TableCell sx={{ color: '#1976D2', fontWeight: 'bold' }}>{formatPrice(row.price)}</TableCell>
        <TableCell align="right">
          <Tooltip title="Xóa sản phẩm">
            <IconButton color="error" onClick={(e) => { e.stopPropagation(); onDeleteClick(row._id) }}>
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box component="form" onSubmit={handleSubmit(onUpdateSubmit)} sx={{ p: 3, my: 2, bgcolor: '#e3f2fd', borderRadius: 2, border: '1px dashed #1976D2' }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: '#1976D2' }}>Chỉnh sửa nhanh: {row.name}</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}><TextField fullWidth size="small" label="Tên sản phẩm" {...register('name')} sx={fieldSx} /></Grid>
                <Grid item xs={6} md={2}><TextField fullWidth size="small" label="SKU" {...register('sku')} sx={fieldSx} /></Grid>
                <Grid item xs={6} md={2}><TextField fullWidth size="small" type="number" label="Giá bán" {...register('price')} sx={fieldSx} /></Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth size="small" sx={fieldSx}>
                    <InputLabel>Danh mục</InputLabel>
                    <Select label="Danh mục" defaultValue={row.categoryId} {...register('categoryId')}>
                      {categories.map((cat) => <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth size="small" sx={fieldSx}>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select label="Trạng thái" defaultValue={row.status} {...register('status')}>
                      {STATUS_OPTIONS.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}><TextField fullWidth size="small" label="Khuyết điểm (Hiển thị cho khách)" {...register('defects')} sx={fieldSx} /></Grid>
              </Grid>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" color="inherit" onClick={() => onToggleExpand(null)}>Hủy</Button>
                <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />}>Lưu thay đổi</Button>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

function ProductLayout() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const [openAddModal, setOpenAddModal] = useState(false)
  const [expandedRowId, setExpandedRowId] = useState(null)

  const confirm = useConfirm()

  const loadData = async () => {
    try {
      setLoading(true)
      const [prodRes, catRes] = await Promise.all([fetchAdminProductsAPI(), fetchAdminCategoriesAPI()])
      if (prodRes.success) setProducts(prodRes.data)
      if (Array.isArray(catRes)) setCategories(catRes)
      else if (catRes.success) setCategories(catRes.data)
    } catch (error) { console.error('Lỗi lấy dữ liệu:', error) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [])

  const handleDeleteProduct = (id) => {
    confirm({
      title: 'Xác nhận xóa?',
      description: 'Sản phẩm này sẽ bị chuyển vào trạng thái đã xóa. Bạn có chắc chắn không?',
      confirmationText: 'Xóa ngay',
      cancellationText: 'Hủy bỏ',
      confirmationButtonProps: { color: 'error', variant: 'contained' },
      cancellationButtonProps: { color: 'inherit' }
    })
      .then(async () => {
        try {
          await toast.promise(deleteAdminProductAPI(id), { pending: 'Đang xóa...', success: 'Xóa thành công!', error: 'Lỗi khi xóa!' })
          loadData()
        } catch (error) { console.error('Lỗi xóa:', error) }
      })
      .catch(() => {
      })
  }

  if (loading) return <CircularProgress color="primary" sx={{ display: 'block', mx: 'auto', mt: 10 }} />

  return (
    <Box sx={{ pb: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InventoryIcon color="primary" fontSize="large" />
          <Typography variant="h5" fontWeight="bold">Quản lý Kho Đồ Cũ</Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenAddModal(true)}>
          Thêm Sản Phẩm
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f1f5f9' }}>
            <TableRow>
              <TableCell width="40px" />
              <TableCell sx={{ fontWeight: 'bold' }}>Sản Phẩm</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Trạng Thái</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Giá Bán</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.filter(row => row._destroy !== true).map((row) => (
              <ProductRow
                key={row._id}
                row={row}
                categories={categories}
                isExpanded={expandedRowId === row._id}
                onToggleExpand={setExpandedRowId}
                onDeleteClick={handleDeleteProduct}
                onReload={loadData}
              />
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>Chưa có sản phẩm nào trong kho.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AddProductModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onReload={loadData}
        categories={categories}
      />
    </Box>
  )
}

export default ProductLayout