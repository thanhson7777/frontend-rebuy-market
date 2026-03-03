import React from 'react'
import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import StorefrontIcon from '@mui/icons-material/Storefront'

function Logo() {
  return (
    <Box
      component={Link}
      to="/"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        textDecoration: 'none',
        color: 'primary.main',
        transition: 'opacity 0.2s ease',
        '&:hover': {
          opacity: 0.8
        }
      }}
    >
      <StorefrontIcon sx={{ fontSize: { xs: 28, md: 36 } }} />
      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          fontSize: { xs: '1.2rem', md: '1.5rem' },
          letterSpacing: 0.5,
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        REBUY
        <Typography
          component="span"
          sx={{
            fontWeight: 400,
            fontSize: 'inherit',
            ml: 0.5,
            color: 'text.secondary'
          }}
        >
          MARKET
        </Typography>
      </Typography>
    </Box>
  )
}

export default Logo