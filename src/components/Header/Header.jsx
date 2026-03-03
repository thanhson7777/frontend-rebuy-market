import React from 'react'
import { AppBar, Toolbar, Container, Box } from '@mui/material'

import Logo from './Logo'
import SearchBar from './SearchBar'
import HeaderActions from './HeaderActions'

function Header() {
  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={1}
      sx={{
        bgcolor: 'white',
        zIndex: 1000
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: '64px', md: '80px' },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box sx={{ flexShrink: 0 }}>
            <Logo />
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }}>
            <SearchBar />
          </Box>
          <Box sx={{ flexShrink: 0 }}>
            <HeaderActions />
          </Box>
        </Toolbar>
        <Box sx={{ display: { xs: 'block', md: 'none' }, pb: 2 }}>
          <SearchBar />
        </Box>

      </Container>
    </AppBar>
  )
}

export default Header