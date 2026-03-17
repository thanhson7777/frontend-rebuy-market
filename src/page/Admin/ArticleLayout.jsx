import { useState, useEffect } from 'react'
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, IconButton, Collapse, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Grid, Avatar,
  CircularProgress, Tooltip, Chip, Tabs, Tab, FormControl, InputLabel, Select, MenuItem
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import NewspaperIcon from '@mui/icons-material/Newspaper'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import SaveIcon from '@mui/icons-material/Save'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CloseIcon from '@mui/icons-material/Close'

import {
  fetchAdminArticlesAPI,
  createAdminArticleAPI,
  updateAdminArticleAPI,
  deleteAdminArticleAPI
} from '~/apis'

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const d = new Date(timestamp)
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
}

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Bản nháp', color: 'default' },
  { value: 'published', label: 'Đã xuất bản', color: 'success' },
  { value: 'hidden', label: 'Đang ẩn', color: 'error' }
]

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

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ],
}

const quillStyles = {
  bgcolor: 'white',
  mb: 2,
  '& .quill': {
    display: 'flex',
    flexDirection: 'column',
  },
  '& .ql-toolbar': {
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    borderColor: '#c4c4c4',
  },
  '& .ql-container': {
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
    borderColor: '#c4c4c4',
    minHeight: '250px',
    fontSize: '15px'
  },
  '& .ql-editor': {
    minHeight: '250px',
  }
}

const AddArticleModal = ({ open, onClose, onReload }) => {
  const theme = useTheme()
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    defaultValues: { name: '', summary: '', content: '', status: 'draft' }
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
    if (!imageFile) return toast.error('Vui lòng chọn ảnh bìa cho bài viết!')

    const isEmptyContent = data.content.replace(/<(.|\n)*?>/g, '').trim().length === 0
    if (isEmptyContent) return toast.error('Vui lòng nhập nội dung bài viết!')

    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('summary', data.summary)
    formData.append('content', data.content)
    formData.append('status', data.status)
    formData.append('image', imageFile)

    try {
      await toast.promise(createAdminArticleAPI(formData), { pending: 'Đang lưu bài viết...', success: 'Thêm mới thành công!', error: 'Lỗi khi lưu!' })
      handleClose()
      onReload()
    } catch (error) { console.error(error) }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: theme.palette.primary.main, fontWeight: 'bold' }}>
        Viết Bài Mới
        <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers sx={{ bgcolor: '#f8fafc' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle2" fontWeight="bold" mb={2}>Ảnh bìa (Thumbnail)</Typography>
                <Box
                  component="label"
                  sx={{
                    border: '2px dashed #90caf9', borderRadius: 2, height: 180,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', bgcolor: '#e3f2fd', mb: 3, overflow: 'hidden',
                    '&:hover': { bgcolor: '#bbdefb' }
                  }}
                >
                  {imagePreview ? (
                    <Avatar src={imagePreview} variant="rounded" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <>
                      <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="body2" color="primary">Tải ảnh lên</Typography>
                    </>
                  )}
                  <input type="file" hidden accept="image/*" onChange={(e) => {
                    if (e.target.files[0]) {
                      setImageFile(e.target.files[0])
                      setImagePreview(URL.createObjectURL(e.target.files[0]))
                    }
                  }} />
                </Box>

                <FormControl fullWidth size="small" sx={fieldSx}>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select label="Trạng thái" {...register('status')}>
                    {STATUS_OPTIONS.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                  </Select>
                </FormControl>
              </Paper>
            </Grid>

            <Grid item xs={12} md={9}>
              <TextField
                fullWidth size="small" label="Tiêu đề bài viết *" color="primary" sx={{ mb: 2, ...fieldSx }}
                {...register('name', { required: 'Không được để trống' })} error={!!errors.name} helperText={errors.name?.message}
              />
              <TextField
                fullWidth size="small" label="Tóm tắt ngắn (Summary) *" multiline rows={2} color="primary" sx={{ mb: 2, ...fieldSx }}
                {...register('summary', { required: 'Vui lòng nhập tóm tắt' })} error={!!errors.summary}
              />

              <Typography variant="body2" fontWeight="bold" mb={1}>Nội dung chi tiết *</Typography>
              <Box sx={quillStyles}>
                <Controller
                  name="content"
                  control={control}
                  rules={{ required: 'Vui lòng nhập nội dung' }}
                  render={({ field }) => (
                    <ReactQuill
                      theme="snow"
                      modules={quillModules}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Viết nội dung bài viết tại đây..."
                    />
                  )}
                />
              </Box>
              {errors.content && <Typography color="error" variant="caption">{errors.content.message}</Typography>}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f8fafc' }}>
          <Button color="inherit" onClick={handleClose}>Hủy</Button>
          <Button type="submit" variant="contained" color="primary">Xuất bản bài viết</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

const ArticleRow = ({ row, isExpanded, onToggleExpand, onDeleteClick, onReload }) => {
  const [editImgFile, setEditImgFile] = useState(null)
  const [editImgPreview, setEditImgPreview] = useState(row.image)

  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      name: row.name, summary: row.summary, content: row.content, status: row.status
    }
  })

  useEffect(() => {
    return () => { if (editImgPreview && editImgPreview !== row.image) URL.revokeObjectURL(editImgPreview) }
  }, [editImgPreview, row.image])

  const onUpdateSubmit = async (data) => {
    const isEmptyContent = data.content.replace(/<(.|\n)*?>/g, '').trim().length === 0
    if (isEmptyContent) return toast.error('Vui lòng nhập nội dung bài viết!')

    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('summary', data.summary)
    formData.append('content', data.content)
    formData.append('status', data.status)
    if (editImgFile) formData.append('image', editImgFile)

    try {
      await toast.promise(updateAdminArticleAPI(row._id, formData), { pending: 'Đang cập nhật...', success: 'Đã lưu thay đổi!', error: 'Lỗi cập nhật!' })
      onToggleExpand(null)
      onReload()
    } catch (error) { console.error(error) }
  }

  const statusConfig = STATUS_OPTIONS.find(s => s.value === row.status) || STATUS_OPTIONS[0]

  return (
    <>
      <TableRow hover onClick={() => onToggleExpand(isExpanded ? null : row._id)} sx={{ cursor: 'pointer', '& > *': { borderBottom: 'unset' } }}>
        <TableCell width="40px">
          <IconButton size="small"><KeyboardArrowDownIcon sx={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.3s' }} /></IconButton>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar variant="rounded" src={row.image} alt={row.name} sx={{ width: 60, height: 40, border: '1px solid #e2e8f0' }} />
            <Box>
              <Typography fontWeight="bold" fontSize="14px" color="primary.main">{row.name}</Typography>
              <Typography variant="caption" color="text.secondary">/{row.slug}</Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell sx={{ maxWidth: 250, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {row.summary}
        </TableCell>
        <TableCell>
          <Chip label={statusConfig.label} color={statusConfig.color} size="small" variant={row.status === 'draft' ? 'outlined' : 'filled'} />
        </TableCell>
        <TableCell>{formatDate(row.createdAt)}</TableCell>
        <TableCell align="right">
          <Tooltip title="Xóa bài viết">
            <IconButton color="error" onClick={(e) => { e.stopPropagation(); onDeleteClick(row._id) }}><DeleteOutlineIcon /></IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box component="form" onSubmit={handleSubmit(onUpdateSubmit)} sx={{ p: 3, my: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #cbd5e1' }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary.main" mb={2}>Chỉnh sửa bài viết</Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Box
                    component="label"
                    sx={{
                      border: '1px dashed #90caf9', borderRadius: 2, p: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                      bgcolor: 'white', cursor: 'pointer', '&:hover': { bgcolor: '#f1f5f9' }
                    }}
                  >
                    <Avatar src={editImgPreview} variant="rounded" sx={{ width: '100%', height: 120, mb: 1, objectFit: 'cover' }} />
                    <Typography variant="caption" color="primary" fontWeight="bold">Đổi Ảnh Bìa</Typography>
                    <input type="file" hidden accept="image/*" onChange={(e) => {
                      if (e.target.files[0]) {
                        setEditImgFile(e.target.files[0])
                        setEditImgPreview(URL.createObjectURL(e.target.files[0]))
                      }
                    }} />
                  </Box>
                  <FormControl fullWidth size="small" sx={{ mt: 2, ...fieldSx }}>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select label="Trạng thái" defaultValue={row.status} {...register('status')}>
                      {STATUS_OPTIONS.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={9}>
                  <TextField fullWidth size="small" label="Tiêu đề" sx={{ mb: 2, ...fieldSx }} {...register('name')} />
                  <TextField fullWidth size="small" label="Tóm tắt" multiline rows={2} sx={{ mb: 2, ...fieldSx }} {...register('summary')} />

                  {/* React Quill trong chế độ Edit */}
                  <Typography variant="body2" fontWeight="bold" mb={1} color="text.secondary">Nội dung chi tiết</Typography>
                  <Box sx={quillStyles}>
                    <Controller
                      name="content"
                      control={control}
                      render={({ field }) => (
                        <ReactQuill
                          theme="snow"
                          modules={quillModules}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </Box>

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

function ArticleLayout() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentTab, setCurrentTab] = useState('ALL')
  const [openAddModal, setOpenAddModal] = useState(false)
  const [expandedRowId, setExpandedRowId] = useState(null)

  const confirm = useConfirm()

  const loadData = async () => {
    try {
      setLoading(true)
      const res = await fetchAdminArticlesAPI()
      let dataList = Array.isArray(res) ? res : (res.data || [])
      if (currentTab !== 'ALL') dataList = dataList.filter(item => item.status === currentTab)
      setArticles(dataList.filter(item => !item._destroy))
    } catch (error) { console.error('Lỗi tải bài viết:', error) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [currentTab])

  const handleDeleteArticle = (id) => {
    confirm({
      title: 'Xác nhận xóa?',
      description: 'Bạn có chắc chắn muốn xóa bài viết này không? Không thể hoàn tác.',
      confirmationText: 'Xóa ngay',
      cancellationText: 'Hủy',
      confirmationButtonProps: { color: 'error', variant: 'contained' }
    }).then(async () => {
      try {
        await toast.promise(deleteAdminArticleAPI(id), { pending: 'Đang xóa...', success: 'Xóa thành công!', error: 'Lỗi xóa bài viết!' })
        loadData()
      } catch (error) { console.error(error) }
    }).catch(() => { })
  }

  if (loading) return <CircularProgress color="primary" sx={{ display: 'block', mx: 'auto', mt: 10 }} />

  return (
    <Box sx={{ pb: 5 }}>
      {/* HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NewspaperIcon color="primary" fontSize="large" />
          <Typography variant="h5" fontWeight="bold">Quản lý Tin tức / Blog</Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenAddModal(true)}>
          Viết Bài Mới
        </Button>
      </Box>

      <Paper elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs value={currentTab} onChange={(e, newVal) => { setCurrentTab(newVal); setExpandedRowId(null) }} textColor="primary" indicatorColor="primary">
          <Tab label="TẤT CẢ" value="ALL" sx={{ fontWeight: 'bold' }} />
          <Tab label="ĐÃ XUẤT BẢN" value="published" sx={{ fontWeight: 'bold' }} />
          <Tab label="BẢN NHÁP" value="draft" sx={{ fontWeight: 'bold' }} />
          <Tab label="ĐANG ẨN" value="hidden" sx={{ fontWeight: 'bold' }} />
        </Tabs>
      </Paper>

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell width="40px" />
              <TableCell sx={{ fontWeight: 'bold' }}>Tiêu đề</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tóm tắt</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ngày tạo</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.map(row => (
              <ArticleRow
                key={row._id}
                row={row}
                isExpanded={expandedRowId === row._id}
                onToggleExpand={setExpandedRowId}
                onDeleteClick={handleDeleteArticle}
                onReload={loadData}
              />
            ))}
            {articles.length === 0 && (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>Chưa có bài viết nào.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AddArticleModal open={openAddModal} onClose={() => setOpenAddModal(false)} onReload={loadData} />
    </Box>
  )
}

export default ArticleLayout