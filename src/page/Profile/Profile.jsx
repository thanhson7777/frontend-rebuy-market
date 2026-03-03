import React, { useState } from 'react'
import { Box, Tab, Tabs, Container, Typography, Paper, Stack, Divider } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import SettingsIcon from '@mui/icons-material/Settings'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'

import AccountTab from './AccountTab'
import SettingsTab from './SettingsTab'

function Profile() {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pt: 4, pb: 10 }}>
      <Container maxWidth="md">
        <Stack direction="row" alignItems="center" spacing={1.5} mb={4}>
          <ManageAccountsIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h5" fontWeight="900" color="#0f172a">
            QUẢN LÝ TÀI KHOẢN
          </Typography>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            bgcolor: 'white'
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider', px: { xs: 1, md: 3 }, pt: 1 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  minHeight: 64,
                  minWidth: 140
                }
              }}
            >
              <Tab
                icon={<AccountCircleIcon fontSize="small" />}
                iconPosition="start"
                label="Thông tin tài khoản"
              />
              <Tab
                icon={<SettingsIcon fontSize="small" />}
                iconPosition="start"
                label="Cài đặt bảo mật"
              />
            </Tabs>
          </Box>
          <Box sx={{ p: { xs: 2, md: 4 } }}>
            {tabValue === 0 && (
              <Box className="animate__animated animate__fadeIn">
                <AccountTab />
              </Box>
            )}
            {tabValue === 1 && (
              <Box className="animate__animated animate__fadeIn">
                <SettingsTab />
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default Profile