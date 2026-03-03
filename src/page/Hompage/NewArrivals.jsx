import React, { useState, useEffect } from 'react'
import { Box, Typography, Grid, Button, CircularProgress, Stack } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import NewReleasesIcon from '@mui/icons-material/NewReleases'
import ProductCard from '~/components/ProductCard'

import { fetchProductsAPI } from '~/apis'

function NewArrivals() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProductsAPI()
      .then((res) => {
        console.log('res', res)
        setProducts(res.products || [])
      })
      .catch((err) => { console.log('Loi o product: ', err) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <Box sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NewReleasesIcon color="error" /> MỚI LÊN KỆ
          </Typography>
          <Typography variant="body2" color="text.secondary">Hàng tuyển chọn, vừa cập nhật trong hôm nay</Typography>
        </Box>
        <Button
          endIcon={<ArrowForwardIcon />}
          sx={{ fontWeight: 'bold', textTransform: 'none' }}
        >
          Xem tất cả
        </Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={6} sm={4} md={3} key={product._id}>
              <ProductCard product={product} />
            </Grid>
          ))}
          {products.length === 0 && (
            <Grid item xs={12}>
              <Typography align="center" color="text.secondary">Chưa có sản phẩm mới nào.</Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  )
}

export default NewArrivals