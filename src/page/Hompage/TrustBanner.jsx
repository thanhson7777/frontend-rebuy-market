import React from 'react'
import { Box, Container, Grid, Typography, Stack, Paper } from '@mui/material'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'

const TRUST_DATA = [
  {
    icon: <VerifiedUserIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Bảo hành 6-12 tháng',
    description: 'Xóa tan nỗi lo máy hỏng, hỗ trợ phần cứng tận tâm.'
  },
  {
    icon: <AutorenewIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: '7 ngày đổi trả',
    description: 'Yên tâm trải nghiệm, lỗi là đổi không cần lý do.'
  },
  {
    icon: <FactCheckIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Kiểm định 30 bước',
    description: 'Minh bạch chất lượng từ ngoại hình đến nội thất máy.'
  }
]

function TrustBanner() {
  return (
    <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: 'transparent' }}>
      <Grid container spacing={3}>
        {TRUST_DATA.map((item, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: 4,
                bgcolor: 'white',
                border: '1px solid',
                borderColor: '#e2e8f0',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 25px -5px rgba(25, 118, 210, 0.1)'
                }
              }}
            >
              <Box
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: 'rgba(25, 118, 210, 0.05)',
                  borderRadius: '50%',
                  display: 'flex'
                }}
              >
                {item.icon}
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  color: 'text.primary',
                  fontSize: '1.1rem'
                }}
              >
                {item.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.6,
                  px: 2
                }}
              >
                {item.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default TrustBanner