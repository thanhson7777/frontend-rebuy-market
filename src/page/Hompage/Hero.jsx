import React, { useState, useEffect } from 'react'
import { Box, Skeleton, IconButton } from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import { useNavigate } from 'react-router-dom'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import { fetchAdminBannersAPI } from '~/apis'

function Hero() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const getBanners = async () => {
      try {
        setLoading(true)
        const res = await fetchAdminBannersAPI()
        const activeBanners = (res.data || res).filter(b => b.isActive && !b._destroy)

        const allImages = []
        activeBanners.forEach(banner => {
          if (Array.isArray(banner.image)) {
            banner.image.forEach(imgUrl => allImages.push({ url: imgUrl, title: banner.title }))
          }
        })

        setBanners(allImages)
      } catch (error) {
        console.error('Lỗi khi lấy banner:', error)
      } finally {
        setLoading(false)
      }
    }
    getBanners()
  }, [])

  if (loading) {
    return (
      <Box sx={{ width: '100%', height: { xs: 200, sm: 350, md: 500 } }}>
        <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: { xs: 200, sm: 350, md: 500 },
        bgcolor: '#f1f5f9',
        overflow: 'hidden',
        '& .swiper-pagination-bullet-active': {
          bgcolor: 'primary.main',
          width: 24,
          borderRadius: 4
        }
      }}
    >
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
        style={{ width: '100%', height: '100%' }}
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <Box
              component="img"
              src={banner.url}
              alt={banner.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                cursor: 'pointer',
                transition: 'transform 0.5s ease',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
              onClick={() => navigate('/all-products')}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  )
}

export default Hero