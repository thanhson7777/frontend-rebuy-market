import { useState, useEffect } from 'react'
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, IconButton, Collapse, Grid,
  CircularProgress, Tooltip, Chip, Tabs, Tab, TextField, Select,
  MenuItem, FormControl, InputLabel, Divider, Pagination
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'

import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import SaveIcon from '@mui/icons-material/Save'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'

import {
  fetchAdminContactsAPI,
  updateAdminContactAPI,
  deleteAdminContactAPI
} from '~/apis'

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const d = new Date(timestamp)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} - ${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
}

const STATUS_CONFIG = {
  NEW: { label: 'Mới nhận', color: 'error' },
  IN_PROGRESS: { label: 'Đang xử lý', color: 'primary' },
  RESOLVED: { label: 'Đã giải quyết', color: 'success' }
}

const ContactRow = ({ row, isExpanded, onToggleExpand, onDeleteClick, onReload }) => {
  const confirm = useConfirm()
  const { register, handleSubmit } = useForm({
    defaultValues: {
      status: row.status || 'NEW',
      adminNotes: row.adminNotes || ''
    }
  })

  const onUpdateSubmit = async (data) => {
    if (data.status === 'RESOLVED' && row.status !== 'RESOLVED') {
      await confirm({
        title: 'Đóng yêu cầu hỗ trợ?',
        description: 'Bạn xác nhận đã giải quyết xong vấn đề của khách hàng này?',
        confirmationText: 'Đã giải quyết',
        cancellationText: 'Hủy',
        confirmationButtonProps: { color: 'success', variant: 'contained' }
      })
    }

    try {
      await toast.promise(
        updateAdminContactAPI(row._id, { status: data.status, adminNotes: data.adminNotes }),
        { pending: 'Đang lưu ghi chú...', success: 'Cập nhật tiến độ thành công!', error: 'Lỗi cập nhật!' }
      )
      onToggleExpand(null)
      onReload()
    } catch (error) { console.error(error) }
  }

  const currentStatus = STATUS_CONFIG[row.status] || STATUS_CONFIG['NEW']

  return (
    <>
      <TableRow hover onClick={() => onToggleExpand(isExpanded ? null : row._id)} sx={{ cursor: 'pointer', '& > *': { borderBottom: 'unset' }, bgcolor: row.status === 'NEW' ? '#fff5f5' : 'inherit' }}>
        <TableCell width="40px">
          <IconButton size="small"><KeyboardArrowDownIcon sx={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.3s' }} /></IconButton>
        </TableCell>

        <TableCell>
          <Typography fontWeight="bold" fontSize="14px" color="primary.main" textTransform="capitalize">{row.fullname}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PhoneIcon sx={{ fontSize: 14 }} /> {row.phone}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <EmailIcon sx={{ fontSize: 14 }} /> {row.email}
            </Typography>
          </Box>
        </TableCell>

        <TableCell sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'text.secondary' }}>
          {row.message}
        </TableCell>

        <TableCell>
          <Chip label={currentStatus.label} color={currentStatus.color} size="small" sx={{ fontWeight: 'bold' }} variant={row.status === 'NEW' ? 'filled' : 'outlined'} />
        </TableCell>

        <TableCell>{formatDate(row.createdAt)}</TableCell>

        <TableCell align="right">
          <Tooltip title="Xóa liên hệ này">
            <IconButton color="error" onClick={(e) => { e.stopPropagation(); onDeleteClick(row._id) }}><DeleteOutlineIcon /></IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box component="form" onSubmit={handleSubmit(onUpdateSubmit)} sx={{ p: 3, my: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #cbd5e1' }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary.main" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssignmentIndIcon /> Xử lý yêu cầu hỗ trợ
              </Typography>

              <Grid container spacing={3} alignItems="flex-start">
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: 'white', height: '100%' }}>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold" mb={1} textTransform="uppercase">Nội dung khách gửi</Typography>

                    <Box sx={{ p: 1.5, bgcolor: '#f1f5f9', borderRadius: 1, mb: 2, minHeight: 80 }}>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{row.message}</Typography>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />
                    <Typography variant="body2" color="text.secondary" fontWeight="bold" mb={1}>Thao tác nhanh:</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small" variant="outlined" color="primary" startIcon={<PhoneIcon />}
                        href={`tel:${row.phone}`} onClick={(e) => e.stopPropagation()}
                      >
                        Gọi điện
                      </Button>
                      <Button
                        size="small" variant="outlined" color="primary" startIcon={<EmailIcon />}
                        href={`mailto:${row.email}?subject=Phản hồi từ Rebuy Market`} onClick={(e) => e.stopPropagation()}
                      >
                        Gửi Email
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: 'white', height: '100%' }}>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold" mb={1} textTransform="uppercase">Ghi chú & Trạng thái xử lý</Typography>

                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                      <InputLabel>Trạng thái hiện tại</InputLabel>
                      <Select label="Trạng thái hiện tại" defaultValue={row.status || 'NEW'} {...register('status')}>
                        <MenuItem value="NEW" sx={{ color: 'error.main', fontWeight: 'bold' }}>Mới nhận (Cần xử lý)</MenuItem>
                        <MenuItem value="IN_PROGRESS" sx={{ color: 'primary.main', fontWeight: 'bold' }}>Đang xử lý</MenuItem>
                        <MenuItem value="RESOLVED" sx={{ color: 'success.main', fontWeight: 'bold' }}>Đã giải quyết xong</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth size="small" label="Ghi chú của Admin (Nội bộ)" multiline rows={3}
                      placeholder="VD: Đã gọi điện xin lỗi khách và tặng mã giảm giá..."
                      {...register('adminNotes')}
                    />

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                      <Button variant="outlined" color="inherit" onClick={() => onToggleExpand(null)}>Hủy</Button>
                      <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />}>Cập nhật tiến độ</Button>
                    </Box>
                  </Paper>
                </Grid>

              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

function ContactLayout() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentTab, setCurrentTab] = useState('ALL')
  const [expandedRowId, setExpandedRowId] = useState(null)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const confirm = useConfirm()

  const loadData = async () => {
    try {
      setLoading(true)
      const params = { page, limit: 10 }
      if (currentTab !== 'ALL') params.status = currentTab

      const res = await fetchAdminContactsAPI(params)
      if (res && res.data) {
        const dataList = Array.isArray(res.data) ? res.data : (res.data.contacts || [])
        setContacts(dataList.filter(item => !item._destroy))
        setTotalPages(res.data.pagination?.totalPages || 1)
      } else if (Array.isArray(res)) {
        setContacts(res.filter(item => !item._destroy))
      }
    } catch (error) { console.error('Lỗi tải liên hệ:', error) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [page, currentTab])

  const handleDeleteContact = (id) => {
    confirm({
      title: 'Xóa thư liên hệ?',
      description: 'Dữ liệu liên hệ này sẽ bị xóa vĩnh viễn. Bạn có chắc chắn không?',
      confirmationText: 'Xóa ngay',
      cancellationText: 'Hủy',
      confirmationButtonProps: { color: 'error', variant: 'contained' }
    }).then(async () => {
      try {
        await toast.promise(deleteAdminContactAPI(id), { pending: 'Đang xóa...', success: 'Xóa thành công!', error: 'Lỗi xóa liên hệ!' })
        loadData()
      } catch (error) { console.error(error) }
    }).catch(() => { })
  }

  if (loading && contacts.length === 0) return <CircularProgress color="primary" sx={{ display: 'block', mx: 'auto', mt: 10 }} />

  return (
    <Box sx={{ pb: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SupportAgentIcon color="primary" fontSize="large" />
          <Typography variant="h5" fontWeight="bold">Phản hồi & Liên hệ</Typography>
        </Box>
      </Box>

      <Paper elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={currentTab}
          onChange={(e, newVal) => { setCurrentTab(newVal); setPage(1); setExpandedRowId(null) }}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
        >
          <Tab label="TẤT CẢ" value="ALL" sx={{ fontWeight: 'bold' }} />
          <Tab label="MỚI NHẬN" value="NEW" sx={{ fontWeight: 'bold', color: currentTab === 'NEW' ? 'error.main' : 'inherit' }} />
          <Tab label="ĐANG XỬ LÝ" value="IN_PROGRESS" sx={{ fontWeight: 'bold' }} />
          <Tab label="ĐÃ GIẢI QUYẾT" value="RESOLVED" sx={{ fontWeight: 'bold' }} />
        </Tabs>
      </Paper>

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell width="40px" />
              <TableCell sx={{ fontWeight: 'bold' }}>Khách Hàng</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nội Dung Tin Nhắn</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Trạng Thái</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ngày Gửi</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map(row => (
              <ContactRow
                key={row._id}
                row={row}
                isExpanded={expandedRowId === row._id}
                onToggleExpand={setExpandedRowId}
                onDeleteClick={handleDeleteContact}
                onReload={loadData}
              />
            ))}
            {contacts.length === 0 && (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>Chưa có tin nhắn liên hệ nào.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, val) => { setPage(val); setExpandedRowId(null); }}
            size="large"
            color="primary"
          />
        </Box>
      )}
    </Box>
  )
}

export default ContactLayout