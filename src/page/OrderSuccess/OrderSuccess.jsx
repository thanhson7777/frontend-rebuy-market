import React from 'react'
import { Container, Box, Typography, Button, Paper } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { Link } from 'react-router-dom'

function OrderSuccessPage() {
  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '80vh', display: 'flex', alignItems: 'center', py: 8 }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
          <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" color="success.main" gutterBottom>
            Đặt hàng thành công!
          </Typography>
          <Typography color="text.secondary" mb={4}>
            Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đang được xử lý và sẽ được giao trong thời gian sớm nhất.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="outlined" component={Link} to="/my-orders">
              Xem đơn hàng
            </Button>
            <Button variant="contained" component={Link} to="/products">
              Tiếp tục mua sắm
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default OrderSuccessPage