import React, { useEffect, useMemo, useState } from 'react'
import { Box, Container, Typography, Stack, Chip, Divider, Button, Skeleton } from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { fetchArticlesAPI } from '~/apis'

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const d = new Date(timestamp)
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
}

function BlogDetail() {
  const { slug } = useParams()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true)
        const data = await fetchArticlesAPI()
        // console.log('data', data)
        setArticles(Array.isArray(data) ? data : [])
        // console.log(data)
      } catch (error) {
        console.error('Loi lay bai viet:', error)
        setArticles([])
      } finally {
        setLoading(false)
      }
    }
    loadArticles()
  }, [])

  const article = useMemo(() => {
    return articles.find(item => item && !item._destroy && item.status === 'published')
  }, [articles, slug])

  if (loading) {
    return (
      <Box sx={{ bgcolor: '#f5f1ea', py: { xs: 5, md: 8 } }}>
        <Container maxWidth="md">
          <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 3, mb: 3 }} />
          <Skeleton height={40} width="80%" />
          <Skeleton height={22} width="40%" />
          <Skeleton height={140} />
        </Container>
      </Box>
    )
  }

  if (!article) {
    return (
      <Box sx={{ bgcolor: '#f5f1ea', py: { xs: 5, md: 8 } }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
            Khong tim thay bai viet
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Bai viet co the da bi xoa hoac chua duoc cong bo.
          </Typography>
          <Button component={Link} to="/blog" variant="outlined" startIcon={<ArrowBackIosNewIcon />}>
            Quay ve blog
          </Button>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: '#f5f1ea', py: { xs: 5, md: 8 } }}>
      <Container maxWidth="md">
        <Button
          component={Link}
          to="/blog"
          startIcon={<ArrowBackIosNewIcon />}
          sx={{ textTransform: 'none', mb: 3 }}
        >
          Quay ve danh sach
        </Button>

        <Box
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            mb: 3,
            boxShadow: '0 18px 30px rgba(15, 23, 42, 0.15)'
          }}
        >
          <Box
            component="img"
            src={article.image || 'https://via.placeholder.com/900x520'}
            alt={article.name}
            sx={{ width: '100%', height: { xs: 220, md: 420 }, objectFit: 'cover' }}
          />
        </Box>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            {formatDate(article.createdAt)}
          </Typography>
          <Chip label={article.status} size="small" sx={{ textTransform: 'capitalize' }} />
        </Stack>

        <Typography variant="h3" fontWeight={800} sx={{ mb: 2, letterSpacing: '-0.02em' }}>
          {article.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          {article.summary}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Box
          sx={{
            lineHeight: 1.8,
            fontSize: 16,
            color: '#111827',
            '& img': { maxWidth: '100%', borderRadius: 2 },
            '& p': { margin: '0 0 16px' },
            '& h1, & h2, & h3': { marginTop: 24, marginBottom: 12 }
          }}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </Container>
    </Box>
  )
}

export default BlogDetail
