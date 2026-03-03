import { useState, useEffect } from 'react'
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, IconButton, Collapse, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Grid, Switch,
  LinearProgress, Select, MenuItem, InputLabel, FormControl, CircularProgress,
  Tooltip
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'

import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'

import {
  fetchAdminCouponsAPI,
  createAdminCouponAPI,
  updateAdminCouponAPI,
  deleteAdminCouponAPI
} from '~/apis'

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)
const formatDateTimeUI = (timestamp) => {
  if (!timestamp) return ''
  const d = new Date(timestamp)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear().toString().slice(-2)}`
}
const toInputDateTime = (timestamp) => {
  if (!timestamp) return ''
  const d = new Date(timestamp)
  const tzOffset = d.getTimezoneOffset() * 60000
  return (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 16)
}

const AddCouponModal = ({ open, onClose, onReload }) => {
  const theme = useTheme()
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
    defaultValues: {
      code: '', name: '', type: 'FIXED', value: '', maxAmount: '', minOrder: 0,
      quantity: '', startDate: '', endDate: ''
    }
  })

  const discountType = watch('type')

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (data) => {
    if (new Date(data.endDate).getTime() <= new Date(data.startDate).getTime()) {
      return toast.error("Thời gian kết thúc phải sau thời gian bắt đầu!")
    }

    const payload = {
      code: data.code.trim().toUpperCase(),
      name: data.name.trim(),
      isActive: true,
      discount: {
        type: data.type,
        value: Number(data.value),
        maxAmount: data.type === 'PERCENT' && data.maxAmount ? Number(data.maxAmount) : null,
        minOrder: Number(data.minOrder)
      },
      quantity: Number(data.quantity),
      startDate: new Date(data.startDate).getTime(),
      endDate: new Date(data.endDate).getTime()
    }

    try {
      await toast.promise(createAdminCouponAPI(payload), { pending: 'Đang tạo mã...', success: 'Tạo mã thành công!', error: 'Lỗi tạo mã!' })
      handleClose()
      onReload()
    } catch (error) { console.error(error) }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: theme.palette.primary.main, fontWeight: 'bold' }}>
        Tạo Mã Giảm Giá Mới
        <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers sx={{ bgcolor: '#f8fafc' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField fullWidth size="small" color="primary" label="Mã Code (VD: SUMMER26) *" sx={{ bgcolor: 'white' }}
                {...register('code', { required: 'Không được để trống' })} error={!!errors.code}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField fullWidth size="small" color="primary" label="Tên chương trình *" sx={{ bgcolor: 'white' }}
                {...register('name', { required: 'Không được để trống' })} error={!!errors.name}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 1 }}>Cấu hình giảm giá</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small" color="primary" sx={{ bgcolor: 'white' }}>
                <InputLabel>Loại giảm giá *</InputLabel>
                <Select label="Loại giảm giá *" {...register('type')}>
                  <MenuItem value="FIXED">Giảm tiền mặt (VNĐ)</MenuItem>
                  <MenuItem value="PERCENT">Giảm phần trăm (%)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth size="small" color="primary" type="number" sx={{ bgcolor: 'white' }}
                label={discountType === 'FIXED' ? "Số tiền giảm (VNĐ) *" : "Phần trăm giảm (%) *"}
                {...register('value', { required: 'Bắt buộc nhập' })} error={!!errors.value}
              />
            </Grid>
            {discountType === 'PERCENT' ? (
              <Grid item xs={12} md={4}>
                <TextField fullWidth size="small" color="primary" label="Giảm tối đa (VNĐ)" type="number" sx={{ bgcolor: 'white' }} {...register('maxAmount')} />
              </Grid>
            ) : <Grid item xs={12} md={4} />}

            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 1 }}>Điều kiện & Thời hạn</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth size="small" color="primary" label="Đơn tối thiểu áp dụng (VNĐ)" type="number" sx={{ bgcolor: 'white' }} {...register('minOrder')} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth size="small" color="primary" label="Tổng số lượng mã *" type="number" sx={{ bgcolor: 'white' }}
                {...register('quantity', { required: true })} error={!!errors.quantity}
              />
            </Grid>
            <Grid item xs={12} md={4} />

            <Grid item xs={12} md={6}>
              <TextField fullWidth size="small" color="primary" label="Thời gian bắt đầu *" type="datetime-local" InputLabelProps={{ shrink: true }} sx={{ bgcolor: 'white' }}
                {...register('startDate', { required: true })} error={!!errors.startDate}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth size="small" color="primary" label="Thời gian kết thúc *" type="datetime-local" InputLabelProps={{ shrink: true }} sx={{ bgcolor: 'white' }}
                {...register('endDate', { required: true })} error={!!errors.endDate}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f8fafc' }}>
          <Button color="inherit" onClick={handleClose}>Hủy</Button>
          <Button type="submit" variant="contained" color="primary">Lưu Mã Khuyến Mãi</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

const CouponRow = ({ row, isExpanded, onToggleExpand, onDeleteClick, onReload }) => {
  const isUsed = row.usedCount > 0
  const percentUsed = row.quantity > 0 ? Math.round((row.usedCount / row.quantity) * 100) : 0

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      name: row.name || '',
      type: row.discount?.type || 'FIXED',
      value: row.discount?.value || 0,
      quantity: row.quantity || 0,
      endDate: toInputDateTime(row.endDate)
    }
  })

  const editType = watch('type')

  const onUpdateSubmit = async (data) => {
    const payload = {
      name: data.name,
      discount: {
        ...row.discount,
        type: isUsed ? row.discount.type : data.type,
        value: Number(data.value)
      },
      quantity: Number(data.quantity),
      endDate: new Date(data.endDate).getTime()
    }

    try {
      await toast.promise(updateAdminCouponAPI(row._id, payload), { pending: 'Đang cập nhật...', success: 'Đã lưu thay đổi!', error: 'Lỗi cập nhật!' })
      onToggleExpand(null)
      onReload()
    } catch (error) { console.error(error) }
  }

  const handleToggleStatus = async (e) => {
    e.stopPropagation()
    const newIsActive = e.target.checked
    try {
      await updateAdminCouponAPI(row._id, { isActive: newIsActive })
      onReload()
    } catch (error) { toast.error("Không thể đổi trạng thái") }
  }

  return (
    <>
      <TableRow hover onClick={() => onToggleExpand(isExpanded ? null : row._id)} sx={{ cursor: 'pointer', '& > *': { borderBottom: 'unset' }, opacity: row._destroy ? 0.5 : 1 }}>
        <TableCell width="40px"><IconButton size="small"><KeyboardArrowDownIcon sx={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.3s' }} /></IconButton></TableCell>
        <TableCell>
          <Typography sx={{ fontWeight: 'bold', color: '#1976D2', fontSize: '15px' }}>{row.code}</Typography>
          <Typography variant="caption" color="text.secondary">{row.name}</Typography>
        </TableCell>
        <TableCell sx={{ fontWeight: 'bold' }}>
          {row.discount?.type === 'FIXED' ? formatPrice(row.discount?.value) : `${row.discount?.value}%`}
        </TableCell>
        <TableCell>
          <Typography fontSize="13px" color="text.secondary">{formatDateTimeUI(row.startDate)}</Typography>
          <Typography fontSize="13px">đến {formatDateTimeUI(row.endDate)}</Typography>
        </TableCell>
        <TableCell width="180px">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" fontWeight="bold">{row.usedCount} / {row.quantity}</Typography>
            <Typography variant="body2" color="text.secondary">{percentUsed}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={percentUsed} color={percentUsed >= 100 ? "error" : "primary"} sx={{ height: 6, borderRadius: 3 }} />
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <Tooltip title={row.isActive ? "Đang bật" : "Đang tắt"}>
            <Switch color="primary" checked={row.isActive === true} onChange={handleToggleStatus} />
          </Tooltip>
        </TableCell>
        <TableCell align="right">
          <Tooltip title="Xóa mã giảm giá">
            <IconButton color="error" onClick={(e) => { e.stopPropagation(); onDeleteClick(row._id) }}><DeleteOutlineIcon /></IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box component="form" onSubmit={handleSubmit(onUpdateSubmit)} sx={{ p: 3, my: 2, bgcolor: '#e3f2fd', borderRadius: 2, border: '1px dashed #1976D2' }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Cập nhật mã: <span style={{ color: '#1976D2' }}>{row.code}</span>
                {isUsed && <span style={{ color: '#d32f2f', fontSize: '13px', fontWeight: 'normal', marginLeft: '10px' }}>(*Mã đã được sử dụng, không thể sửa loại giảm giá)</span>}
              </Typography>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                  <TextField fullWidth size="small" color="primary" label="Tên chương trình" sx={{ bgcolor: 'white' }} {...register('name')} />
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth size="small" disabled={isUsed} sx={{ bgcolor: 'white' }}>
                    <InputLabel color="primary">Loại giảm giá</InputLabel>
                    <Select color="primary" label="Loại giảm giá" {...register('type')}>
                      <MenuItem value="FIXED">Tiền mặt</MenuItem>
                      <MenuItem value="PERCENT">Phần trăm</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField fullWidth size="small" color="primary" label="Mức giảm" type="number" sx={{ bgcolor: 'white' }} disabled={isUsed && editType === 'PERCENT'} {...register('value')} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField fullWidth size="small" color="primary" label="Ngày kết thúc" type="datetime-local" InputLabelProps={{ shrink: true }} sx={{ bgcolor: 'white' }} {...register('endDate')} />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField fullWidth size="small" color="primary" label="Tổng số lượng" type="number" sx={{ bgcolor: 'white' }} {...register('quantity')} />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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

function CouponLayout() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [openAddModal, setOpenAddModal] = useState(false)
  const [expandedRowId, setExpandedRowId] = useState(null)

  const confirm = useConfirm()

  const loadData = async () => {
    try {
      setLoading(true)
      const res = await fetchAdminCouponsAPI()
      if (res.success) setCoupons(res.data)
      else if (Array.isArray(res)) setCoupons(res)
    } catch (error) { console.error('Lỗi tải mã giảm giá:', error) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [])

  const handleDeleteCoupon = (id) => {
    confirm({
      title: 'Xác nhận xóa?',
      description: 'Bạn có chắc chắn muốn xóa vĩnh viễn mã giảm giá này?',
      confirmationText: 'Xóa ngay',
      cancellationText: 'Hủy bỏ',
      confirmationButtonProps: { color: 'error', variant: 'contained' }
    })
      .then(async () => {
        try {
          await toast.promise(deleteAdminCouponAPI(id), { pending: 'Đang xóa...', success: 'Xóa thành công!', error: 'Không thể xóa mã đã có khách sử dụng!' })
          loadData()
        } catch (error) { console.error(error) }
      })
      .catch(() => { })
  }

  if (loading) return <CircularProgress color="primary" sx={{ display: 'block', mx: 'auto', mt: 10 }} />

  return (
    <Box sx={{ pb: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ConfirmationNumberIcon color="primary" fontSize="large" />
          <Typography variant="h5" fontWeight="bold">Quản lý Mã Giảm Giá</Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenAddModal(true)}>
          Tạo Mã Mới
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell width="40px" />
              <TableCell sx={{ fontWeight: 'bold' }}>Mã & Tên Chương Trình</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Mức Giảm</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Thời Hạn</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Đã Dùng</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Trạng Thái</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.filter(row => !row._destroy).map((row) => (
              <CouponRow
                key={row._id}
                row={row}
                isExpanded={expandedRowId === row._id}
                onToggleExpand={setExpandedRowId}
                onDeleteClick={handleDeleteCoupon}
                onReload={loadData}
              />
            ))}
            {coupons.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3, color: 'text.secondary' }}>Chưa có mã giảm giá nào.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AddCouponModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onReload={loadData}
      />
    </Box>
  )
}

export default CouponLayout