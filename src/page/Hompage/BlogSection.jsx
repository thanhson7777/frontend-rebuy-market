import React, { useState, useEffect } from 'react'
import {
  Box, Typography, Grid, Button, Card, CardMedia,
  CardContent, Stack, CircularProgress
} from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'

import NewspaperIcon from '@mui/icons-material/Newspaper'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { fetchArticlesAPI } from '~/apis'

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const d = new Date(timestamp)
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
}

function BlogSection() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const getArticles = async () => {
      try {
        setLoading(true)
        // Gọi API lấy bài viết đang public, lấy khoảng 3-4 bài mới nhất cho trang chủ
        const res = await fetchArticlesAPI()

        // Mock data tạm thời khớp với cấu trúc JSON của bạn để test UI
        // const mockData = res || [
        //   {
        //     _id: "69a6686d9e995d598db69835",
        //     name: "Kinh nghiệm chọn mua iPhone cũ nguyên zin, không sợ hàng dựng",
        //     summary: "Bài viết này rất hay đó, hướng dẫn chi tiết cách kiểm tra ngoại hình, màn hình, true tone và pin trước khi xuống tiền mua iPhone cũ.",
        //     slug: "bai-viet-hay",
        //     image: "https://res.cloudinary.com/dwlio4rp3/image/upload/v1772513388/image-article-rebuy-market/qge1ffctjwikym8nbdri.jpg",
        //     createdAt: 1772513389410,
        //   },
        // ]

        setArticles(res.slice(0, 4))
      } catch (error) {
        console.error('Lỗi lấy bài viết:', error)
      } finally {
        setLoading(false)
      }
    }
    getArticles()
  }, [])

  return (
    <Box sx={{ py: 6 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" mb={4}>
        <Box>
          <Typography variant="h5" fontWeight="800" color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NewspaperIcon color="primary" fontSize="large" />
            TIN TỨC & KINH NGHIỆM
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Bí kíp săn đồ cũ chất lượng và cập nhật công nghệ mới nhất
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/blog"
          endIcon={<ArrowForwardIosIcon sx={{ fontSize: '14px !important' }} />}
          sx={{ fontWeight: 'bold', textTransform: 'none', display: { xs: 'none', sm: 'flex' } }}
        >
          Xem tất cả bài viết
        </Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {articles.map((article) => (
            <Grid item xs={12} sm={6} md={3} key={article._id}>

              <Card
                elevation={0}
                onClick={() => navigate(`/blog/${article.slug}`)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-6px)',
                    boxShadow: '0 10px 20px rgba(25, 118, 210, 0.08)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={article.image || 'https://via.placeholder.com/400x250'}
                  alt={article.name}
                  sx={{ objectFit: 'cover' }}
                />

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5, fontWeight: 500 }}
                  >
                    <CalendarTodayIcon sx={{ fontSize: 14 }} />
                    {formatDate(article.createdAt)}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight="700"
                    sx={{
                      mb: 1,
                      color: 'text.primary',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {article.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      flexGrow: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {article.summary}
                  </Typography>
                  <Typography
                    variant="button"
                    color="primary.main"
                    sx={{ fontWeight: 'bold', textTransform: 'none', mt: 'auto' }}
                  >
                    Đọc tiếp →
                  </Typography>
                </CardContent>
              </Card>

            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ display: { xs: 'flex', sm: 'none' }, justifyContent: 'center', mt: 3 }}>
        <Button component={Link} to="/blog" variant="outlined" color="primary" fullWidth sx={{ borderRadius: 8 }}>
          Xem tất cả bài viết
        </Button>
      </Box>

    </Box>
  )
}

export default BlogSection