import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Chip,
  Button,
  Skeleton
} from '@mui/material'
import { Link } from 'react-router-dom'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { fetchArticlesAPI } from '~/apis'

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const d = new Date(timestamp)
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
}

function BlogPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true)
        const data = await fetchArticlesAPI()
        setArticles(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Loi lay danh sach bai viet:', error)
        setArticles([])
      } finally {
        setLoading(false)
      }
    }
    loadArticles()
  }, [])

  const publishedArticles = useMemo(() => {
    return articles
      .filter(item => item && !item._destroy && item.status === 'published')
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  }, [articles])

  return (
    <Box sx={{ bgcolor: '#f5f1ea', py: { xs: 5, md: 8 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            bgcolor: '#111827',
            color: 'white',
            borderRadius: 4,
            p: { xs: 3, md: 5 },
            mb: { xs: 4, md: 6 },
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(80% 80% at 10% 20%, rgba(248, 113, 113, 0.35), transparent), radial-gradient(70% 70% at 90% 10%, rgba(59, 130, 246, 0.35), transparent)'
            }}
          />
          <Box sx={{ position: 'relative' }}>
            <Chip label="Blog" sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white', mb: 1 }} />
            <Typography variant="h3" fontWeight={800} sx={{ mb: 1, letterSpacing: '-0.02em' }}>
              Chia se kinh nghiem mua do cu thong minh
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: 680 }}>
              Cap nhat kien thuc, meo chon do, va nhung bai viet giai tri tu cong dong REBUY.
            </Typography>
          </Box>
        </Box>

        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={800}>Bài viết mới nhất</Typography>
          <Button
            component={Link}
            to="/"
            variant="outlined"
            endIcon={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />}
            sx={{ textTransform: 'none', borderRadius: 6 }}
          >
            Ve trang chu
          </Button>
        </Stack>

        <Grid container spacing={3}>
          {loading && Array.from({ length: 6 }).map((_, idx) => (
            <Grid item xs={12} sm={6} md={4} key={`skeleton-${idx}`}>
              <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton height={20} width="40%" />
                  <Skeleton height={28} width="90%" />
                  <Skeleton height={20} width="100%" />
                </CardContent>
              </Card>
            </Grid>
          ))}

          {!loading && publishedArticles.map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article._id}>
              <Card
                component={Link}
                to={`/blog/${article._id}`}
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  height: '100%',
                  borderRadius: 3,
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.12)',
                    borderColor: '#cbd5f5'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={article.image || 'https://via.placeholder.com/400x250'}
                  alt={article.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(article.createdAt)}
                    </Typography>
                    <Chip label={article.status} size="small" sx={{ ml: 'auto', textTransform: 'capitalize' }} />
                  </Stack>
                  <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                    {article.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {article.summary}
                  </Typography>
                  <Typography variant="button" color="primary" sx={{ mt: 'auto', textTransform: 'none', fontWeight: 700 }}>
                    Doc tiep
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {!loading && publishedArticles.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              Chua co bai viet nao
            </Typography>
            <Typography color="text.secondary">
              Hay quay lai sau, chung toi se cap nhat noi dung moi.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default BlogPage
