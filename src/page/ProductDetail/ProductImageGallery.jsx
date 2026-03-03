import React, { useState } from 'react'
import { Box, CardMedia } from '@mui/material'

function ProductImageGallery({ images }) {
  const [activeImg, setActiveImg] = useState(images?.[0] || 'https://via.placeholder.com/600')

  if (!images || images.length === 0) {
    return (
      <Box sx={{ width: '100%', borderRadius: 3, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image="https://via.placeholder.com/600"
          alt="Placeholder"
          sx={{ width: '100%', height: 'auto', aspectRatio: '1/1', objectFit: 'cover' }}
        />
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Main Image */}
      <Box sx={{
        width: '100%', borderRadius: 3, overflow: 'hidden', mb: 2,
        border: '1px solid', borderColor: 'grey.200',
        bgcolor: 'white'
      }}>
        <CardMedia
          component="img"
          image={activeImg}
          alt="Product detail"
          sx={{ width: '100%', height: 'auto', aspectRatio: '1/1', objectFit: 'contain' }}
        />
      </Box>

      {/* Thumbnails */}
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { height: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.300', borderRadius: 4 } }}>
        {images.map((img, idx) => (
          <Box
            key={idx}
            onClick={() => setActiveImg(img)}
            sx={{
              width: 80, height: 80, flexShrink: 0,
              borderRadius: 2, overflow: 'hidden',
              cursor: 'pointer',
              border: '2px solid',
              borderColor: activeImg === img ? 'primary.main' : 'transparent',
              opacity: activeImg === img ? 1 : 0.6,
              transition: 'all 0.2s ease',
              '&:hover': { opacity: 1 }
            }}
          >
            <CardMedia
              component="img"
              image={img}
              alt={`thumbnail-${idx}`}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default ProductImageGallery
