import React, { useState } from 'react'
import {
  Card, Box, Typography, Button, Divider, Chip,
  Dialog, DialogTitle, DialogContent, Grid, Stack, Avatar
} from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

const STATUS_MAP = {
  PENDING: { label: 'Chờ xác nhận', color: 'warning', icon: <AccessTimeIcon fontSize="small" /> },
  CONFIRMED: { label: 'Đã xác nhận', color: 'info', icon: <InfoOutlinedIcon fontSize="small" /> },
  SHIPPING: { label: 'Đang giao hàng', color: 'primary', icon: <LocalShippingIcon fontSize="small" /> },
  DELIVERED: { label: 'Giao thành công', color: 'success', icon: <ReceiptLongIcon fontSize="small" /> },
  CANCELLED: { label: 'Đã hủy', color: 'error', icon: null }
}

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)

function OrderItemCard({ order, onCancelOrder }) {
  const [openDetail, setOpenDetail] = useState(false)
  const isAllowCancel = order.status === 'PENDING'

  return (
    <Card
      elevation={0}
      sx={{
        mb: 3,
        p: 2.5,
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        transition: '0.3s',
        '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <ReceiptLongIcon sx={{ color: 'primary.main' }} />
          <Typography variant="subtitle1" fontWeight="800" color="text.primary">
            ĐƠN HÀNG #{order._id?.substring(0, 8).toUpperCase()}
          </Typography>
        </Stack>
        <Chip
          icon={STATUS_MAP[order.status]?.icon}
          label={STATUS_MAP[order.status]?.label || order.status}
          color={STATUS_MAP[order.status]?.color || 'default'}
          variant="light"
          sx={{ fontWeight: 'bold', borderRadius: 1 }}
        />
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
        Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}
      </Typography>

      <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

      <Stack spacing={2}>
        {order.items?.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Avatar
              variant="rounded"
              src={item.image[0]}
              sx={{ width: 64, height: 64, border: '1px solid #f1f5f9' }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight="bold" noWrap>{item.name}</Typography>
              <Typography variant="caption" color="text.secondary">Số lượng: x{item.quantity}</Typography>
            </Box>
            <Typography variant="body2" fontWeight="bold" color="primary.main">
              {formatPrice(item.price)}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" spacing={1}>
          <Button
            variant="text"
            color="primary"
            size="small"
            startIcon={<InfoOutlinedIcon />}
            onClick={() => setOpenDetail(true)}
            sx={{ fontWeight: 'bold', textTransform: 'none' }}
          >
            Chi tiết đơn
          </Button>
          {isAllowCancel && (
            <Button
              variant="text"
              color="error"
              size="small"
              onClick={() => onCancelOrder(order._id)}
              sx={{ fontWeight: 'bold', textTransform: 'none' }}
            >
              Hủy đơn
            </Button>
          )}
        </Stack>

        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="caption" color="text.secondary" display="block">Tổng thanh toán:</Typography>
          <Typography variant="h6" color="primary.main" fontWeight="900">
            {formatPrice(order.totalProductPrice + order.shippingFee)}
          </Typography>
        </Box>
      </Box>

      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #eee' }}>
          Chi tiết đơn hàng #{order._id?.substring(0, 8).toUpperCase()}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>ĐỊA CHỈ NHẬN HÀNG</Typography>
              <Typography variant="body2" fontWeight="bold">{order.shippingAddress?.fullname}</Typography>
              <Typography variant="body2" color="text.secondary">{order.shippingAddress?.phone}</Typography>
              <Typography variant="body2" color="text.secondary">
                {order.shippingAddress?.address}, {order.shippingAddress?.district}, {order.shippingAddress?.province}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>THANH TOÁN</Typography>
              <Typography variant="body2">Phương thức: <strong>{order.payment?.method}</strong></Typography>
              <Typography variant="body2">
                Trạng thái: <Chip label={order.payment?.status === 'PAID' ? 'Đã trả tiền' : 'Chờ thanh toán'} size="small" color={order.payment?.status === 'PAID' ? 'success' : 'warning'} />
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default OrderItemCard