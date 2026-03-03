import React, { useState, useEffect, useMemo } from 'react'
import { Box, Typography, Tabs, Tab, Container, CircularProgress, Paper, Stack } from '@mui/material'
import OrderItemCard from './OrderItemCard'
import { getOrdersAPI } from '~/apis'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { useConfirm } from 'material-ui-confirm'
import { toast } from 'react-toastify'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'

function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState('ALL')
  const confirmCancel = useConfirm()

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const data = await getOrdersAPI()
      setOrders(data || [])
    } catch (error) {
      toast.error('Không thể tải lịch sử đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    window.scrollTo(0, 0)
  }, [])

  const handleTabChange = (event, newValue) => setTabValue(newValue)

  const handleCancelOrder = (orderId) => {
    confirmCancel({
      title: 'Xác nhận hủy đơn hàng?',
      description: 'Hành động này không thể hoàn tác. Bạn có chắc chắn muốn hủy đơn hàng này?',
      confirmationText: 'Đồng ý hủy',
      cancellationText: 'Quay lại',
      confirmationButtonProps: { color: 'error', variant: 'contained' }
    }).then(async () => {
      try {
        await authorizeAxiosInstance.put(`${API_ROOT}/v1/orders/${orderId}/cancel`)
        toast.success('Đã hủy đơn hàng thành công')
        fetchOrders()
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Lỗi khi hủy đơn hàng')
      }
    }).catch(() => { })
  }

  const filteredOrders = useMemo(() => {
    if (tabValue === 'ALL') return orders
    return orders.filter(order => order.status === tabValue)
  }, [orders, tabValue])

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pt: 4, pb: 10 }}>
      <Container maxWidth="md">
        <Stack direction="row" alignItems="center" spacing={1.5} mb={4}>
          <ShoppingBagIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h5" fontWeight="900" color="#0f172a">
            ĐƠN HÀNG CỦA TÔI
          </Typography>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '0.95rem',
                py: 2,
                minWidth: 120
              },
              '& .Mui-selected': {
                color: 'primary.main',
              }
            }}
          >
            <Tab label="Tất cả" value="ALL" />
            <Tab label="Chờ xác nhận" value="PENDING" />
            <Tab label="Đã xác nhận" value="CONFIRMED" />
            <Tab label="Đang giao" value="SHIPPING" />
            <Tab label="Đã giao" value="DELIVERED" />
            <Tab label="Đã hủy" value="CANCELLED" />
          </Tabs>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
            <CircularProgress thickness={4} size={50} sx={{ color: 'primary.main' }} />
            <Typography color="text.secondary" fontWeight="500">Đang tải đơn hàng...</Typography>
          </Box>
        ) : filteredOrders.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              textAlign: 'center',
              py: 10,
              bgcolor: 'white',
              borderRadius: 4,
              border: '1px dashed #cbd5e1'
            }}
          >
            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-2130356-1800917.png"
              alt="empty"
              style={{ width: 180, opacity: 0.7, marginBottom: 20 }}
            />
            <Typography variant="h6" fontWeight="bold" color="text.primary">Chưa có đơn hàng nào</Typography>
            <Typography variant="body2" color="text.secondary">Hãy tiếp tục mua sắm để lấp đầy lịch sử của bạn nhé!</Typography>
          </Paper>
        ) : (
          <Box>
            {filteredOrders.map(order => (
              <OrderItemCard key={order._id} order={order} onCancelOrder={handleCancelOrder} />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default OrderHistory