import { useEffect, useState } from 'react'
import {
  Box, Grid, Card, CardContent, Typography, Avatar, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import PeopleIcon from '@mui/icons-material/People'
import ContactSupportIcon from '@mui/icons-material/ContactSupport'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { formatCurrency } from '~/utils/formatCurrency'
import { getDashboardStatsAPI } from '~/apis'

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(date)
}

const timeAgo = (timestamp) => {
  if (!timestamp) return ''
  const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000)
  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + " năm trước"
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + " tháng trước"
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + " ngày trước"
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + " giờ trước"
  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + " phút trước"
  return Math.floor(seconds) + " giây trước"
}


export default function DashboardLayout() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStatsAPI()
        // console.log('Dashboard stats response:', res)
        if (res) {
          setStats(res)
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!stats) return <Typography>Lỗi tải dữ liệu</Typography>

  const {
    kpis = { newOrders: 0, newUsers: 0, newContacts: 0, revenue: 0 },
    revenueChartData = [],
    orderStatusChartData = [],
    recentOrders = [],
    recentContacts = []
  } = stats

  const summaryCards = [
    { title: 'Đơn hàng mới', value: kpis.newOrders, icon: <ShoppingCartIcon />, bg: '#eef2ff', color: '#6366f1' },
    { title: 'Khách hàng mới', value: kpis.newUsers, icon: <PeopleIcon />, bg: '#f0fdf4', color: '#22c55e' },
    { title: 'Liên hệ mới', value: kpis.newContacts, icon: <ContactSupportIcon />, bg: '#fffbeb', color: '#f59e0b' },
    { title: 'Doanh thu hôm nay', value: formatCurrency(kpis.revenue), icon: <AttachMoneyIcon />, bg: '#fef2f2', color: '#ef4444' }
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7']

  const getOrderStatusLabel = (status) => {
    switch (status) {
      case 'Pending': return { text: 'Chờ T.Toán', color: 'warning' }
      case 'Processing': return { text: 'Chờ Xử lý', color: 'info' }
      case 'Shipping': return { text: 'Đang giao', color: 'primary' }
      case 'Delivered': return { text: 'Hoàn thành', color: 'success' }
      case 'Cancelled': return { text: 'Đã hủy', color: 'error' }
      default: return { text: status, color: 'default' }
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Tổng quan hoạt động
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                <Avatar sx={{ bgcolor: card.bg, color: card.color, width: 56, height: 56, mr: 2 }}>
                  {card.icon}
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="medium">
                    {card.title}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ mt: 0.5 }}>
                    {card.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', p: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Doanh thu 7 ngày qua
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip formatter={(value) => [formatCurrency(value), 'Doanh thu']} />
                  <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', p: 2, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Trạng thái đơn hàng
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={orderStatusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="status"
                  >
                    {orderStatusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Tables */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #f0f0f0' }}>
              <Typography variant="h6" fontWeight="bold">
                Đơn hàng mới nhất
              </Typography>
            </Box>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead sx={{ bgcolor: '#fafafa' }}>
                  <TableRow>
                    <TableCell>Mã đơn</TableCell>
                    <TableCell>Khách hàng</TableCell>
                    <TableCell align="right">Tổng tiền</TableCell>
                    <TableCell align="center">Trạng thái</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((order) => {
                    const statusInfo = getOrderStatusLabel(order.status)
                    return (
                      <TableRow key={order._id} hover>
                        <TableCell>#{order.orderNumber}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">{order.shippingAddress?.fullname}</Typography>
                          <Typography variant="caption" color="text.secondary">{formatDate(order.createdAt)}</Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium' }}>{formatCurrency(order.finalPrice ?? 0)}</TableCell>
                        <TableCell align="center">
                          <Box sx={{
                            px: 1, py: 0.5, borderRadius: 1, display: 'inline-block', fontSize: '0.75rem', fontWeight: 'bold',
                            bgcolor: `${statusInfo.color}.light`, color: `${statusInfo.color}.main`
                          }}>
                            {statusInfo.text}
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {recentOrders.length === 0 && (
                    <TableRow><TableCell colSpan={4} align="center">Chưa có đơn hàng nào</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #f0f0f0' }}>
              <Typography variant="h6" fontWeight="bold">
                Yêu cầu liên hệ mới
              </Typography>
            </Box>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableBody>
                  {recentContacts.map((contact) => (
                    <TableRow key={contact._id} hover>
                      <TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
                          <Typography variant="body2" fontWeight="bold" sx={{ mr: 1 }}>
                            {contact.fullname}
                          </Typography>
                          {contact.status === 'NEW' && (
                            <Box sx={{ width: 8, height: 8, bgcolor: 'error.main', borderRadius: '50%', mt: 0.6 }} />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 220 }}>
                          {contact.message || contact.content || 'Không có nội dung'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {timeAgo(contact.createdAt)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  {recentContacts.length === 0 && (
                    <TableRow><TableCell align="center">Chưa có liên hệ mới</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

      </Grid>
    </Box>
  )
}
