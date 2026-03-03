import { useState, useEffect } from 'react'
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Tabs, Tab, Select, MenuItem,
  IconButton, Collapse, Avatar, CircularProgress, Pagination, Chip,
  Grid, Tooltip, Divider
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useConfirm } from 'material-ui-confirm'
import { toast } from 'react-toastify'

import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import PaymentsIcon from '@mui/icons-material/Payments'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'

import {
  fetchAdminOrdersAPI,
  updateAdminOrderStatusAPI
} from '~/apis'

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)

const formatDate = (timestamp) => {
  const d = new Date(timestamp)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} - ${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
}

const STATUS_CONFIG = {
  PENDING: { label: 'Chờ xác nhận', color: '#d97706', bg: '#fef3c7', level: 1 },
  CONFIRMED: { label: 'Đã xác nhận', color: '#2563eb', bg: '#dbeafe', level: 2 },
  SHIPPING: { label: 'Đang giao', color: '#0284c7', bg: '#e0f2fe', level: 3 },
  DELIVERED: { label: 'Đã giao', color: '#16a34a', bg: '#dcfce7', level: 4 },
  CANCELLED: { label: 'Đã hủy', color: '#dc2626', bg: '#fee2e2', level: 99 }
}

const OrderRow = ({ row, isExpanded, onToggleExpand, onReload }) => {
  const currentStatusInfo = STATUS_CONFIG[row.status]
  const confirm = useConfirm()

  const handleStatusChange = (event) => {
    const newStatus = event.target.value
    if (newStatus === row.status) return
    const newStatusLabel = STATUS_CONFIG[newStatus].label

    confirm({
      title: 'Cập nhật trạng thái',
      description: `Bạn có chắc chắn muốn chuyển đơn hàng này sang trạng thái "${newStatusLabel}" không?`,
      confirmationText: 'Đồng ý',
      cancellationText: 'Hủy bỏ',
      confirmationButtonProps: { color: 'primary', variant: 'contained' }
    })
      .then(async () => {
        try {
          await toast.promise(
            updateAdminOrderStatusAPI(row._id, newStatus),
            { pending: 'Đang cập nhật...', success: 'Đổi trạng thái thành công!', error: 'Lỗi cập nhật!' }
          )
          onReload()
        } catch (error) { console.error(error) }
      })
      .catch(() => { })
  }

  const isPaid = row.payment?.status === 'PAID' || row.status === 'DELIVERED'

  return (
    <>
      <TableRow hover sx={{ cursor: 'pointer', '& > *': { borderBottom: 'unset' } }} onClick={() => onToggleExpand(isExpanded ? null : row._id)}>
        <TableCell width="40px">
          <IconButton size="small"><KeyboardArrowDownIcon sx={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.3s' }} /></IconButton>
        </TableCell>
        <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>#{row._id.slice(-8).toUpperCase()}</TableCell>
        <TableCell>
          <Typography fontWeight="bold" fontSize="14px">{row.shippingAddress?.fullname || 'Khách Hàng'}</Typography>
          <Typography fontSize="13px" color="text.secondary">{row.shippingAddress?.phone || 'Chưa cập nhật SĐT'}</Typography>
        </TableCell>
        <TableCell>{formatDate(row.createdAt)}</TableCell>

        <TableCell>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>{formatPrice(row.finalPrice)}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                size="small"
                icon={row.payment?.method === 'COD' ? <LocalShippingIcon sx={{ fontSize: 14 }} /> : <AccountBalanceWalletIcon sx={{ fontSize: 14 }} />}
                label={row.payment?.method === 'VNPAY' ? 'VNPay' : row.payment?.method === 'MOMO' ? 'MoMo' : 'COD'}
                sx={{ fontSize: '11px', height: 20, bgcolor: '#f1f5f9' }}
              />
              <Chip
                size="small"
                label={isPaid ? 'Đã thu tiền' : 'Chưa thu'}
                color={isPaid ? 'success' : 'default'}
                sx={{ fontSize: '11px', height: 20, fontWeight: isPaid ? 'bold' : 'normal' }}
              />
            </Box>
          </Box>
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Nhấp để chuyển trạng thái đơn hàng">
            <Select
              value={row.status}
              onChange={handleStatusChange}
              size="small"
              disabled={row.status === 'DELIVERED' || row.status === 'CANCELLED'}
              sx={{
                bgcolor: currentStatusInfo?.bg,
                color: currentStatusInfo?.color,
                fontWeight: 'bold',
                borderRadius: '8px',
                fieldset: { border: 'none' },
                '& .MuiSelect-select': { py: 0.8, px: 2 },
                '& .MuiSvgIcon-root': { color: currentStatusInfo?.color }
              }}
            >
              {Object.keys(STATUS_CONFIG).map((statusKey) => {
                const option = STATUS_CONFIG[statusKey]
                const isDisabled = option.level <= currentStatusInfo.level && statusKey !== row.status && statusKey !== 'CANCELLED'

                return (
                  <MenuItem key={statusKey} value={statusKey} disabled={isDisabled}>
                    {option.label}
                  </MenuItem>
                )
              })}
            </Select>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ p: 3, my: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)' }}>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ReceiptLongIcon /> Chi tiết đơn hàng
                </Typography>

                {row.payment?.transactionId && (
                  <Typography variant="caption" color="text.secondary" sx={{ bgcolor: 'white', px: 1.5, py: 0.5, borderRadius: 1, border: '1px solid #cbd5e1' }}>
                    Mã GD Điện tử: <strong>{row.payment.transactionId}</strong>
                  </Typography>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid #cbd5e1', height: '100%' }}>
                    <Typography variant="body2" fontWeight="bold" sx={{ mb: 1.5, color: 'text.secondary', textTransform: 'uppercase' }}>Thông tin vận chuyển</Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body2">
                        <strong>Người nhận:</strong> {row.shippingAddress?.fullname} - {row.shippingAddress?.phone}
                      </Typography>
                      <Divider />
                      <Typography variant="body2">
                        <strong>📍 Địa chỉ:</strong> {row.shippingAddress?.address}, {row.shippingAddress?.ward}, {row.shippingAddress?.district}, {row.shippingAddress?.province}
                      </Typography>
                      {row.shippingAddress?.note && (
                        <>
                          <Divider />
                          <Typography variant="body2" color="error.main">
                            <strong>📝 Ghi chú từ khách:</strong> {row.shippingAddress.note}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Paper elevation={0} sx={{ p: 0, borderRadius: 2, border: '1px solid #cbd5e1', overflow: 'hidden' }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Sản phẩm</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>Đơn giá</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'bold' }}>SL</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>Thành tiền</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {row.items?.map((item, idx) => {
                          const thumbUrl = Array.isArray(item.image) && item.image.length > 0 ? item.image[0] : item.image
                          return (
                            <TableRow key={idx}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                  <Avatar src={thumbUrl} variant="rounded" sx={{ width: 44, height: 44, border: '1px solid #e2e8f0' }} />
                                  <Box>
                                    <Typography variant="body2" fontWeight="bold">{item.name}</Typography>
                                    {item.defects && <Typography variant="caption" color="text.secondary">Tình trạng: {item.defects}</Typography>}
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell align="right" sx={{ color: 'text.secondary' }}>{formatPrice(item.price)}</TableCell>
                              <TableCell align="center">x{1}</TableCell>
                              <TableCell align="right" fontWeight="bold">{formatPrice(item.price * 1)}</TableCell>
                            </TableRow>
                          )
                        })}

                        <TableRow>
                          <TableCell colSpan={3} align="right" sx={{ borderBottom: 'none', pb: 0.5, pt: 2, color: 'text.secondary' }}>Tổng tiền hàng:</TableCell>
                          <TableCell align="right" sx={{ borderBottom: 'none', pb: 0.5, pt: 2 }}>{formatPrice(row.totalProductPrice)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={3} align="right" sx={{ borderBottom: 'none', py: 0.5, color: 'text.secondary' }}>Phí vận chuyển:</TableCell>
                          <TableCell align="right" sx={{ borderBottom: 'none', py: 0.5 }}>{formatPrice(row.shippingFee)}</TableCell>
                        </TableRow>
                        {row.discountAmount > 0 && (
                          <TableRow>
                            <TableCell colSpan={3} align="right" sx={{ borderBottom: 'none', py: 0.5 }}>
                              Giảm giá <Chip label={row.couponCode} size="small" sx={{ height: 18, fontSize: '10px', ml: 1 }} />:
                            </TableCell>
                            <TableCell align="right" sx={{ borderBottom: 'none', py: 0.5, color: 'success.main' }}>-{formatPrice(row.discountAmount)}</TableCell>
                          </TableRow>
                        )}
                        <TableRow>
                          <TableCell colSpan={3} align="right" sx={{ pt: 1 }}><strong>TỔNG THANH TOÁN:</strong></TableCell>
                          <TableCell align="right" sx={{ pt: 1, color: 'primary.main' }}>
                            <Typography variant="subtitle1" fontWeight="bold">{formatPrice(row.finalPrice)}</Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
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

function OrderLayout() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentTab, setCurrentTab] = useState('ALL')
  const [expandedRowId, setExpandedRowId] = useState(null)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadOrders = async () => {
    try {
      setLoading(true)
      const params = { page: page, limit: 10 }
      if (currentTab !== 'ALL') {
        params.status = currentTab
      }
      const res = await fetchAdminOrdersAPI(params)
      if (res && res.data) {
        setOrders(res.data.orders || [])
        setTotalPages(res.data.pagination?.totalPages || 1)
      }
    } catch (error) { console.error('Lỗi lấy đơn hàng:', error) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadOrders() }, [page, currentTab])

  if (loading && orders.length === 0) return <CircularProgress color="primary" sx={{ display: 'block', mx: 'auto', mt: 10 }} />

  return (
    <Box sx={{ pb: 5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <PaymentsIcon color="primary" fontSize="large" />
        <Typography variant="h5" fontWeight="bold">Quản lý Đơn hàng</Typography>
      </Box>

      <Paper elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={currentTab}
          onChange={(e, newVal) => { setCurrentTab(newVal); setPage(1); setExpandedRowId(null); }}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
        >
          <Tab label="TẤT CẢ" value="ALL" sx={{ fontWeight: 'bold' }} />
          <Tab label="CHỜ XÁC NHẬN" value="PENDING" sx={{ fontWeight: 'bold' }} />
          <Tab label="ĐÃ XÁC NHẬN" value="CONFIRMED" sx={{ fontWeight: 'bold' }} />
          <Tab label="ĐANG GIAO" value="SHIPPING" sx={{ fontWeight: 'bold' }} />
          <Tab label="ĐÃ GIAO" value="DELIVERED" sx={{ fontWeight: 'bold' }} />
          <Tab label="ĐÃ HỦY" value="CANCELLED" sx={{ fontWeight: 'bold', color: 'error.main' }} />
        </Tabs>
      </Paper>

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell width="40px" />
              <TableCell sx={{ fontWeight: 'bold' }}>Mã Đơn</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Khách Hàng</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ngày Đặt</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tổng Tiền / Thanh Toán</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Trạng Thái Giao Hàng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((row) => (
                <OrderRow
                  key={row._id}
                  row={row}
                  isExpanded={expandedRowId === row._id}
                  onToggleExpand={setExpandedRowId}
                  onReload={loadOrders}
                />
              ))
            ) : (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>Không tìm thấy đơn hàng nào!</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => { setPage(value); setExpandedRowId(null); }}
            size="large"
            color="primary"
          />
        </Box>
      )}
    </Box>
  )
}

export default OrderLayout