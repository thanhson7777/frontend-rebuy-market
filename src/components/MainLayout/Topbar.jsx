import React from 'react'
import { Box, Container, Typography, Stack, Link } from '@mui/material'

import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'

function TopBar() {
  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 0.8,
        display: { xs: 'none', sm: 'block' }
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={3}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <PhoneIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Hotline: <Link href="tel:0363798364" color="inherit" underline="hover">036.379.8364</Link>
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={0.5}>
              <EmailIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">
                <Link href="mailto:support@rebuymarket.com" color="inherit" underline="hover">
                  support@rebuymarket.com
                </Link>
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={0.5}>
            <VerifiedUserIcon sx={{ fontSize: 16, color: '#4ade80' }} />
            <Typography variant="caption" sx={{ fontWeight: 600, letterSpacing: 0.5 }}>
              NỀN TẢNG MUA BÁN ĐỒ CŨ UY TÍN SỐ 1 CẦN THƠ
            </Typography>
          </Stack>

        </Stack>
      </Container>
    </Box>
  )
}

export default TopBar