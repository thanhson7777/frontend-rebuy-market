import { useState, useEffect } from 'react'
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Collapse, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Grid, Avatar, CircularProgress,
  Tooltip
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import SaveIcon from '@mui/icons-material/Save'
import ConstructionIcon from '@mui/icons-material/Construction'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CloseIcon from '@mui/icons-material/Close'
import { useTheme } from '@mui/material/styles'

import {
  fetchAdminCategoriesAPI,
  createAdminCategoryAPI,
  updateAdminCategoryAPI,
  deleteAdminCategoryAPI
} from '~/apis'
const AddCategoryModal = ({ open, onClose, onReload }) => {
  const theme = useTheme()
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: { name: '', description: '' }
  })

  useEffect(() => {
    return () => { if (imagePreview) URL.revokeObjectURL(imagePreview) }
  }, [imagePreview])

  const handleClose = () => {
    reset()
    setImageFile(null)
    setImagePreview(null)
    onClose()
  }

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('description', data.description)
    if (imageFile) formData.append('image', imageFile)

    try {
      await toast.promise(
        createAdminCategoryAPI(formData),
        { pending: 'Đang tạo danh mục...', success: 'Thêm danh mục thành công!', error: 'Thêm thất bại!' }
      )
      handleClose()
      onReload()
    } catch (error) { console.error(error) }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: theme.palette.primary.main, fontWeight: 'bold' }}>
        Thêm Danh Mục Mới
        <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Box
            component="label"
            sx={{
              border: '2px dashed #90caf9',
              borderRadius: 2,
              height: 160,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              bgcolor: '#e3f2fd',
              mb: 3,
              overflow: 'hidden',
              transition: '0.2s',
              '&:hover': { bgcolor: '#bbdefb' }
            }}
          >
            {imagePreview ? (
              <Avatar src={imagePreview} variant="rounded" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <>
                <CloudUploadIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 1 }} />
                <Typography color="text.primary" fontWeight="medium">Click để tải ảnh đại diện lên</Typography>
              </>
            )}
            <input type="file" hidden accept="image/*" onChange={(e) => {
              if (e.target.files[0]) {
                setImageFile(e.target.files[0])
                setImagePreview(URL.createObjectURL(e.target.files[0]))
              }
            }} />
          </Box>

          <TextField
            fullWidth
            color="primary"
            label="Tên danh mục *"
            sx={{ mb: 2 }}
            InputLabelProps={{ sx: { bgcolor: 'white', px: 1, borderRadius: 1 } }}
            {...register('name', { required: 'Tên danh mục không được để trống' })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            fullWidth
            color="primary"
            label="Mô tả"
            multiline
            rows={3}
            InputLabelProps={{ sx: { bgcolor: 'white', px: 1, borderRadius: 1 } }}
            {...register('description')}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button color="inherit" onClick={handleClose}>Hủy</Button>
          <Button type="submit" variant="contained" color="primary">Lưu Danh Mục</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

const CategoryRow = ({ row, isExpanded, onToggleExpand, onDeleteClick, onReload }) => {
  const [editImgFile, setEditImgFile] = useState(null)
  const [editImgPreview, setEditImgPreview] = useState(row.image)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: row.name, description: row.description || '' }
  })

  useEffect(() => {
    return () => {
      if (editImgPreview && editImgPreview !== row.image) {
        URL.revokeObjectURL(editImgPreview)
      }
    }
  }, [editImgPreview, row.image])

  const onUpdateSubmit = async (data) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('description', data.description)
    if (editImgFile) formData.append('image', editImgFile)

    try {
      await toast.promise(
        updateAdminCategoryAPI(row._id, formData),
        { pending: 'Đang cập nhật...', success: 'Cập nhật thành công!', error: 'Lỗi cập nhật!' }
      )
      onToggleExpand(null)
      onReload()
    } catch (error) { console.error(error) }
  }

  return (
    <>
      <TableRow hover onClick={() => onToggleExpand(isExpanded ? null : row._id)} sx={{ cursor: 'pointer' }}>
        <TableCell width="50px">
          <IconButton size="small">
            <KeyboardArrowDownIcon sx={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
          </IconButton>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar variant="rounded" src={row.image} alt={row.name} sx={{ boxShadow: 1 }} />
            <Typography fontWeight="bold">{row.name}</Typography>
          </Box>
        </TableCell>
        <TableCell sx={{ color: 'text.primary' }}>{row.slug}</TableCell>
        <TableCell align="right">
          <Tooltip title="Xóa danh mục">
            <IconButton color="error" onClick={(e) => { e.stopPropagation(); onDeleteClick(row._id) }}>
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box component="form" onSubmit={handleSubmit(onUpdateSubmit)} sx={{ p: 3, my: 2, bgcolor: '#e3f2fd', borderRadius: 2, border: '1px dashed #1976D2' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#1976D2' }}>Chỉnh sửa: {row.name}</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Box
                    component="label"
                    sx={{
                      border: '1px dashed #90caf9', borderRadius: 2, p: 1,
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      bgcolor: '#fff', cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                  >
                    <Avatar src={editImgPreview} variant="rounded" sx={{ width: '100%', height: 120, mb: 1, objectFit: 'cover' }} />
                    <Typography variant="body2" color="primary" fontWeight="bold"> Đổi Ảnh</Typography>
                    <input type="file" hidden accept="image/*" onChange={(e) => {
                      if (e.target.files[0]) {
                        setEditImgFile(e.target.files[0])
                        setEditImgPreview(URL.createObjectURL(e.target.files[0]))
                      }
                    }} />
                  </Box>
                </Grid>

                <Grid item xs={12} md={9}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth label="Tên danh mục *" color="primary" size="small"
                        InputLabelProps={{ sx: { bgcolor: 'white', px: 1, borderRadius: 1 } }}
                        sx={{ bgcolor: 'white', borderRadius: 1 }}
                        {...register('name', { required: 'Không được để trống' })}
                        error={!!errors.name} helperText={errors.name?.message}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth label="Mô tả" color="primary" multiline rows={3} size="small"
                        InputLabelProps={{ sx: { bgcolor: 'white', px: 1, borderRadius: 1 } }}
                        sx={{ bgcolor: 'white', borderRadius: 1 }}
                        {...register('description')}
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="outlined" color="inherit" onClick={() => onToggleExpand(null)}>Hủy</Button>
                    <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />}>Lưu thay đổi</Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

function CategoryLayout() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const [openAddModal, setOpenAddModal] = useState(false)
  const [expandedRowId, setExpandedRowId] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const res = await fetchAdminCategoriesAPI()
      if (Array.isArray(res)) setCategories(res)
      else if (res.success) setCategories(res.data)
    } catch (error) {
      console.error('Lỗi lấy danh mục:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const confirmDelete = async () => {
    try {
      await toast.promise(
        deleteAdminCategoryAPI(deleteConfirmId),
        { pending: 'Đang xóa...', success: 'Xóa thành công!', error: 'Xóa thất bại!' }
      )
      setDeleteConfirmId(null)
      loadData()
    } catch (error) { console.error(error) }
  }

  if (loading) return <CircularProgress color="primary" sx={{ display: 'block', mx: 'auto', mt: 10 }} />

  return (
    <Box sx={{ pb: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ConstructionIcon color="primary" fontSize="large" />
          <Typography variant="h5" fontWeight="bold">Quản lý Danh mục</Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenAddModal(true)}>
          Thêm Danh Mục
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f1f5f9' }}>
            <TableRow>
              <TableCell width="50px" />
              <TableCell sx={{ fontWeight: 'bold' }}>Tên Danh Mục</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Đường dẫn (Slug)</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories
              .filter(row => !row._destroy)
              .map((row) => (
                <CategoryRow
                  key={row._id}
                  row={row}
                  isExpanded={expandedRowId === row._id}
                  onToggleExpand={setExpandedRowId}
                  onDeleteClick={setDeleteConfirmId}
                  onReload={loadData}
                />
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>

      <AddCategoryModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onReload={loadData}
      />

      <Dialog open={Boolean(deleteConfirmId)} onClose={() => setDeleteConfirmId(null)}>
        <DialogTitle color="error" fontWeight="bold">Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa danh mục này? Các sản phẩm thuộc danh mục có thể bị ảnh hưởng.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button color="inherit" onClick={() => setDeleteConfirmId(null)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>Xóa ngay</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CategoryLayout