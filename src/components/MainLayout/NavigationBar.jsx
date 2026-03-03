import React, { useState, useEffect } from 'react'
import {
  Box, Container, Stack, Button, Menu, MenuItem,
  ListItemIcon, ListItemText, Typography, CircularProgress
} from '@mui/material'
import { NavLink, Link } from 'react-router-dom'

// Icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk'
import HomeIcon from '@mui/icons-material/Home'
import CategoryIcon from '@mui/icons-material/Category'

import { fetchCategoriesAPI } from '~/apis'

function NavigationBar() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const openMenu = Boolean(anchorEl)
  useEffect(() => {
    fetchCategoriesAPI()
      .then((res) => {
        // console.log(res)
        setCategories(res || [])
      })
      .catch((err) => { console.log('Lỗi ở category: ', err) })
      .finally(() => setLoading(false))
  }, [])

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget)
  const handleCloseMenu = () => setAnchorEl(null)

  const navLinkStyle = {
    color: 'text.primary',
    fontWeight: 600,
    fontSize: '15px',
    textTransform: 'none',
    px: 2,
    '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
    '&.active': { color: 'primary.main' }
  }

  return (
    <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e2e8f0', display: { xs: 'none', md: 'block' } }}>
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" spacing={1} sx={{ height: 50 }}>
          <Button component={NavLink} to="/" end sx={navLinkStyle}>
            Trang chủ
          </Button>
          <Button
            id="product-button"
            onClick={handleOpenMenu}
            endIcon={<KeyboardArrowDownIcon sx={{ transform: openMenu ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />}
            sx={{
              ...navLinkStyle,
              color: openMenu ? 'primary.main' : 'text.primary'
            }}
          >
            Sản phẩm
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
            sx={{ mt: 1 }}
            PaperProps={{
              elevation: 3,
              sx: { minWidth: 220, borderRadius: 2, border: '1px solid #e2e8f0' }
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}><CircularProgress size={20} /></Box>
            ) : (
              categories.map((cat) => (
                <MenuItem
                  key={cat._id}
                  component={Link}
                  to={`/category/${cat._id}`}
                  onClick={handleCloseMenu}
                  sx={{ py: 1.5, '&:hover': { bgcolor: '#f1f5f9', color: 'primary.main' } }}
                >
                  <ListItemIcon><CategoryIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary={cat.name} primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
                </MenuItem>
              ))
            )}
            <Divider sx={{ my: 0.5 }} />
            <MenuItem component={Link} to="/all-products" onClick={handleCloseMenu} sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Xem tất cả sản phẩm
            </MenuItem>
          </Menu>
          <Button component={NavLink} to="/blog" sx={navLinkStyle}>
            Tin tức
          </Button>
          <Button component={NavLink} to="/contact" sx={navLinkStyle}>
            Liên hệ
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="text"
            color="primary"
            startIcon={<PhoneInTalkIcon />}
            sx={{ fontWeight: 'bold', textTransform: 'none' }}
          >
            Hỗ trợ: 036.379.8364
          </Button>

        </Stack>
      </Container>
    </Box>
  )
}

const Divider = ({ sx }) => <Box sx={{ height: '1px', bgcolor: '#e2e8f0', ...sx }} />

export default NavigationBar