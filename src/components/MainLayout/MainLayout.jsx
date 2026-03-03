import React from 'react'
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import TopBar from './TopBar'
import Header from '../Header/Header'
import NavigationBar from './NavigationBar'
import Footer from '../Footer/Footer'

function MainLayout() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: '#f1f5f9'
      }}
    >
      <TopBar />
      <Header />
      <NavigationBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          pb: 5
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
}

export default MainLayout