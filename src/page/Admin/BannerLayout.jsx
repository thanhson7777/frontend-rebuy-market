import { useState, useEffect } from 'react'
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, IconButton, Collapse, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Grid, Avatar,
  CircularProgress, Tooltip, Switch, Tabs, Tab, Badge
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'

import ViewCarouselIcon from '@mui/icons-material/ViewCarousel'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import SaveIcon from '@mui/icons-material/Save'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CloseIcon from '@mui/icons-material/Close'
import CollectionsIcon from '@mui/icons-material/Collections'

import {
  fetchAdminBannersAPI,
  createAdminBannerAPI,
  updateAdminBannerAPI,
  deleteAdminBannerAPI
} from '~/apis'

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const d = new Date(timestamp)
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
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

const AddBannerModal = ({ open, onClose, onReload }) => {
  const theme = useTheme()
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: { title: '' }
  })

  useEffect(() => {
    return () => { imagePreviews.forEach(url => URL.revokeObjectURL(url)) }
  }, [imagePreviews])

  const handleClose = () => {
    reset()
    setImageFiles([])
    setImagePreviews([])
    onClose()
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setImageFiles(prev => [...prev, ...files])

    const newPreviews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(prev => [...prev, ...newPreviews])

    e.target.value = null
  }

  const handleRemoveImage = (indexToRemove) => {
    setImageFiles(prev => prev.filter((_, idx) => idx !== indexToRemove))
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[indexToRemove])
      return prev.filter((_, idx) => idx !== indexToRemove)
    })
  }

  const onSubmit = async (data) => {
    if (imageFiles.length === 0) return toast.error('Vui lòng tải lên ít nhất 1 ảnh cho Banner!')

    const formData = new FormData()
    formData.append('title', data.title)
    imageFiles.forEach(file => {
      formData.append('image', file)
    })

    try {
      await toast.promise(createAdminBannerAPI(formData), { pending: 'Đang lưu Banner...', success: 'Thêm mới thành công!', error: 'Lỗi khi lưu!' })
      handleClose()
      onReload()
    } catch (error) { console.error(error) }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: theme.palette.primary.main, fontWeight: 'bold' }}>
        Tạo Banner Mới
        <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers sx={{ bgcolor: '#f8fafc' }}>
          <TextField
            fullWidth size="small" label="Tiêu đề chiến dịch / Banner *" color="primary" sx={{ mb: 3, ...fieldSx }}
            {...register('title', { required: 'Vui lòng nhập tiêu đề' })} error={!!errors.title} helperText={errors.title?.message}
          />

          <Typography variant="subtitle2" fontWeight="bold" mb={1} color="text.secondary">Danh sách hình ảnh (Tải nhiều ảnh) *</Typography>

          <Box
            component="label"
            sx={{
              border: '2px dashed #90caf9', borderRadius: 2, p: 3,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', bgcolor: '#e3f2fd', mb: 2, transition: 'all 0.2s ease',
              '&:hover': { bgcolor: '#bbdefb', borderColor: 'primary.main' }
            }}
          >
            <CollectionsIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="body1" color="primary" fontWeight="bold">Click để chọn ảnh</Typography>
            <Typography variant="caption" color="text.secondary">Có thể chọn nhiều ảnh cùng lúc</Typography>
            <input type="file" hidden multiple accept="image/*" onChange={handleFileChange} />
          </Box>

          {imagePreviews.length > 0 && (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid #e2e8f0' }}>
              {imagePreviews.map((preview, index) => (
                <Box key={index} sx={{ position: 'relative', width: 80, height: 80, borderRadius: 1, border: '1px solid #cbd5e1', overflow: 'hidden' }}>
                  <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                    sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', p: 0.2, '&:hover': { bgcolor: 'error.main' } }}
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}

        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f8fafc' }}>
          <Button color="inherit" onClick={handleClose}>Hủy</Button>
          <Button type="submit" variant="contained" color="primary">Lưu Banner</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

const BannerRow = ({ row, isExpanded, onToggleExpand, onDeleteClick, onReload }) => {
  const confirm = useConfirm()
  const { register, handleSubmit } = useForm({ defaultValues: { title: row.title } })

  const handleToggleActive = (e) => {
    e.stopPropagation()
    const newStatus = e.target.checked
    const actionText = newStatus ? 'Hiển thị' : 'Ẩn'

    confirm({
      title: `${actionText} Banner?`,
      description: `Bạn có chắc chắn muốn ${actionText.toLowerCase()} banner "${row.title}" trên trang chủ không?`,
      confirmationText: 'Đồng ý',
      cancellationText: 'Hủy',
      confirmationButtonProps: { color: 'primary', variant: 'contained' }
    }).then(async () => {
      try {
        await toast.promise(updateAdminBannerAPI(row._id, { isActive: newStatus }), { pending: 'Đang cập nhật...', success: 'Cập nhật thành công!', error: 'Lỗi!' })
        onReload()
      } catch (error) { console.error(error) }
    }).catch(() => { })
  }

  const onUpdateSubmit = async (data) => {
    try {
      await toast.promise(updateAdminBannerAPI(row._id, { title: data.title }), { pending: 'Đang lưu...', success: 'Cập nhật thành công!', error: 'Lỗi!' })
      onToggleExpand(null)
      onReload()
    } catch (error) { console.error(error) }
  }

  const firstImage = Array.isArray(row.image) && row.image.length > 0 ? row.image[0] : ''
  const additionalImageCount = Array.isArray(row.image) ? row.image.length - 1 : 0

  return (
    <>
      <TableRow hover onClick={() => onToggleExpand(isExpanded ? null : row._id)} sx={{ cursor: 'pointer', '& > *': { borderBottom: 'unset' } }}>
        <TableCell width="40px">
          <IconButton size="small"><KeyboardArrowDownIcon sx={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.3s' }} /></IconButton>
        </TableCell>

        <TableCell>
          <Badge badgeContent={additionalImageCount > 0 ? `+${additionalImageCount}` : 0} color="primary" overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Avatar variant="rounded" src={firstImage} sx={{ width: 100, height: 50, border: '1px solid #e2e8f0' }} />
          </Badge>
        </TableCell>

        <TableCell>
          <Typography fontWeight="bold" fontSize="15px" color="primary.main">{row.title}</Typography>
          <Typography variant="caption" color="text.secondary">/{row.slug}</Typography>
        </TableCell>

        <TableCell onClick={(e) => e.stopPropagation()}>
          <Tooltip title={row.isActive ? 'Đang hiển thị' : 'Đang ẩn'}>
            <Switch color="primary" checked={row.isActive === true} onChange={handleToggleActive} />
          </Tooltip>
        </TableCell>

        <TableCell>{formatDate(row.createdAt)}</TableCell>

        <TableCell align="right">
          <Tooltip title="Xóa toàn bộ banner này">
            <IconButton color="error" onClick={(e) => { e.stopPropagation(); onDeleteClick(row._id) }}><DeleteOutlineIcon /></IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box component="form" onSubmit={handleSubmit(onUpdateSubmit)} sx={{ p: 3, my: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #cbd5e1' }}>
              <Typography variant="subtitle2" fontWeight="bold" color="primary.main" mb={2}>Cập nhật thông tin</Typography>

              <Grid container spacing={3} alignItems="flex-start">
                <Grid item xs={12} md={5}>
                  <TextField fullWidth size="small" label="Tiêu đề Banner" sx={fieldSx} {...register('title', { required: true })} />
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Button variant="outlined" color="inherit" onClick={() => onToggleExpand(null)}>Đóng</Button>
                    <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />}>Lưu Tiêu Đề</Button>
                  </Box>
                </Grid>

                <Grid item xs={12} md={7}>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" mb={1}>Các hình ảnh đang chạy ({Array.isArray(row.image) ? row.image.length : 0})</Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                    {Array.isArray(row.image) && row.image.map((imgUrl, idx) => (
                      <Box key={idx} sx={{ width: 120, height: 60, borderRadius: 1, overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                        <img src={imgUrl} alt="banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Box>
                    ))}
                  </Box>
                  <Typography variant="caption" color="primary.main" fontStyle="italic" mt={1} display="block">
                    * Mẹo: Để thay đổi hình ảnh, vui lòng Xóa banner này và Tạo banner mới.
                  </Typography>
                </Grid>
              </Grid>

            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

function BannerLayout() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentTab, setCurrentTab] = useState('ALL')
  const [openAddModal, setOpenAddModal] = useState(false)
  const [expandedRowId, setExpandedRowId] = useState(null)

  const confirm = useConfirm()

  const loadData = async () => {
    try {
      setLoading(true)
      const res = await fetchAdminBannersAPI()
      let dataList = Array.isArray(res) ? res : (res.data || [])

      if (currentTab === 'ACTIVE') dataList = dataList.filter(item => item.isActive === true)
      if (currentTab === 'HIDDEN') dataList = dataList.filter(item => item.isActive === false)

      setBanners(dataList.filter(item => !item._destroy))
    } catch (error) { console.error('Lỗi tải banner:', error) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [currentTab])

  const handleDeleteBanner = (id) => {
    confirm({
      title: 'Xóa chiến dịch Banner?',
      description: 'Hành động này sẽ xóa toàn bộ hình ảnh thuộc banner này. Bạn có chắc chắn không?',
      confirmationText: 'Xóa vĩnh viễn',
      cancellationText: 'Hủy',
      confirmationButtonProps: { color: 'error', variant: 'contained' }
    }).then(async () => {
      try {
        await toast.promise(deleteAdminBannerAPI(id), { pending: 'Đang xóa...', success: 'Xóa thành công!', error: 'Lỗi xóa banner!' })
        loadData()
      } catch (error) { console.error(error) }
    }).catch(() => { })
  }

  if (loading) return <CircularProgress color="primary" sx={{ display: 'block', mx: 'auto', mt: 10 }} />

  return (
    <Box sx={{ pb: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ViewCarouselIcon color="primary" fontSize="large" />
          <Typography variant="h5" fontWeight="bold">Quản lý Slider & Banner</Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenAddModal(true)}>
          Tạo Banner Mới
        </Button>
      </Box>

      <Paper elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs value={currentTab} onChange={(e, newVal) => { setCurrentTab(newVal); setExpandedRowId(null) }} textColor="primary" indicatorColor="primary">
          <Tab label="TẤT CẢ" value="ALL" sx={{ fontWeight: 'bold' }} />
          <Tab label="ĐANG HIỂN THỊ" value="ACTIVE" sx={{ fontWeight: 'bold' }} />
          <Tab label="ĐANG ẨN" value="HIDDEN" sx={{ fontWeight: 'bold' }} />
        </Tabs>
      </Paper>

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell width="40px" />
              <TableCell sx={{ fontWeight: 'bold' }}>Hình Ảnh</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tiêu Đề Chiến Dịch</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Hiển Thị</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ngày Tạo</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {banners.map(row => (
              <BannerRow
                key={row._id}
                row={row}
                isExpanded={expandedRowId === row._id}
                onToggleExpand={setExpandedRowId}
                onDeleteClick={handleDeleteBanner}
                onReload={loadData}
              />
            ))}
            {banners.length === 0 && (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>Chưa có banner nào.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AddBannerModal open={openAddModal} onClose={() => setOpenAddModal(false)} onReload={loadData} />
    </Box>
  )
}

export default BannerLayout