import React, { useEffect } from 'react'
import { Box, Container, Stack } from '@mui/material'
import Hero from './Hero'
import TrustBanner from './TrustBanner'
import NewArrivals from './NewArrivals'
import BlogSection from './BlogSection'

function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Box
      sx={{
        bgcolor: '#f8fafc',
        minHeight: '100vh',
        pb: 8
      }}
    >
      <Hero />
      <Container maxWidth="lg">
        <Stack
          spacing={{ xs: 6, md: 8 }}
          sx={{
            mt: { xs: 4, md: 6 },
            position: 'relative',
            zIndex: 10
          }}
        >
          <TrustBanner />
          <NewArrivals />
          <BlogSection />

        </Stack>

      </Container>
    </Box>
  )
}

export default HomePage